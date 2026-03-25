const Article = require('../models/Article');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const uploadImageToCloudinary = (buffer, folder = 'gemtalk/articles') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const uploadRawToCloudinary = (buffer, folder = 'gemtalk/articles/pdfs') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const deleteCloudinaryImage = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try { await cloudinary.uploader.destroy(publicId, { resource_type: resourceType }); } catch (e) { console.log('Cloudinary delete error:', e.message); }
};

const deleteLocalFile = (filePath) => {
  if (!filePath) return;
  const full = path.join(__dirname, '../' + filePath);
  fs.unlink(full, () => {});
};

exports.getArticles = async (req, res) => {
  try {
    const page      = parseInt(req.query.page)  || 1;
    const limit     = parseInt(req.query.limit) || 10;
    const search    = req.query.search    || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const dateFrom  = req.query.dateFrom;
    const dateTo    = req.query.dateTo;
    const skip      = (page - 1) * limit;

    let filter = { admin: req.user.id };
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) { const to = new Date(dateTo); to.setHours(23,59,59,999); filter.createdAt.$lte = to; }
    }
    if (req.query.type) filter.type = req.query.type;

    const allowedSort = { createdAt: 'createdAt', title: 'title', fileSize: 'fileSize' };
    const sortBy = allowedSort[sortField] || 'createdAt';

    const totalCount = await Article.countDocuments(filter);
    const articles   = await Article.find(filter).select('-admin').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);

    res.status(200).json({ success: true, articles, pagination: { totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, limit } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET single article (admin) ────────────────────────
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    if (article.admin.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── CREATE article ────────────────────────────────────
exports.createArticle = async (req, res) => {
  const pdfFile   = req.files?.pdf?.[0];
  const imageFile = req.files?.image?.[0];
  let imageUrl = null, imagePublicId = null;
  let pdfUrl = null, pdfPublicId = null;

  try {
    const { title, description, type = 'news' } = req.body;

    if (!title || !description) {
      if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      return res.status(400).json({ success: false, message: 'Please provide title and description' });
    }

    // news type doesn't require PDF
    if (type !== 'news' && !pdfFile) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    // Upload image to Cloudinary if provided
    if (imageFile?.buffer) {
      const result = await uploadImageToCloudinary(imageFile.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Upload PDF to Cloudinary (raw) if provided
    if (pdfFile) {
      const localPath = path.join(__dirname, '../uploads/articles', pdfFile.filename);
      const buffer = fs.readFileSync(localPath);
      try {
        const r = await uploadRawToCloudinary(buffer);
        pdfUrl = r.secure_url;
        pdfPublicId = r.public_id;
      } catch (err) {
        deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
        throw err;
      }
      deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
    }

    const article = await Article.create({
      title,
      description,
      pdf:           pdfFile ? pdfUrl : null,
      pdfPublicId:   pdfFile ? pdfPublicId : null,
      fileName:      pdfFile ? pdfFile.originalname : null,
      fileSize:      pdfFile ? pdfFile.size : null,
      image:         imageUrl,
      imagePublicId,
      type,
      publishedDate: req.body.publishedDate ? new Date(req.body.publishedDate) : null,
      admin:         req.user.id,
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
    if (pdfPublicId) await deleteCloudinaryImage(pdfPublicId, 'raw');
    if (imagePublicId) await deleteCloudinaryImage(imagePublicId);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE article ────────────────────────────────────
exports.updateArticle = async (req, res) => {
  const pdfFile   = req.files?.pdf?.[0];
  const imageFile = req.files?.image?.[0];

  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    if (article.admin.toString() !== req.user.id) {
      if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (req.body.title)       article.title       = req.body.title;
    if (req.body.description) article.description = req.body.description;
    if (req.body.type)        article.type        = req.body.type;
    if (req.body.publishedDate !== undefined) article.publishedDate = req.body.publishedDate ? new Date(req.body.publishedDate) : null;

    if (pdfFile) {
      if (article.pdfPublicId) await deleteCloudinaryImage(article.pdfPublicId, 'raw');
      const localPath = path.join(__dirname, '../uploads/articles', pdfFile.filename);
      const buffer = fs.readFileSync(localPath);
      const r = await uploadRawToCloudinary(buffer);
      article.pdf = r.secure_url;
      article.pdfPublicId = r.public_id;
      article.fileName = pdfFile.originalname;
      article.fileSize = pdfFile.size;
      deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
    }

    if (imageFile?.buffer) {
      await deleteCloudinaryImage(article.imagePublicId);
      const result = await uploadImageToCloudinary(imageFile.buffer);
      article.image         = result.secure_url;
      article.imagePublicId = result.public_id;
    }

    article = await article.save();
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE article ────────────────────────────────────
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    if (article.admin.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    deleteLocalFile(article.pdf);
    if (article.pdfPublicId) await deleteCloudinaryImage(article.pdfPublicId, 'raw');
    await deleteCloudinaryImage(article.imagePublicId);
    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── BULK DELETE ───────────────────────────────────────
exports.bulkDeleteArticles = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, message: 'No article IDs provided' });

    const articles = await Article.find({ _id: { $in: ids }, admin: req.user.id });
    for (const a of articles) {
      deleteLocalFile(a.pdf);
      if (a.pdfPublicId) await deleteCloudinaryImage(a.pdfPublicId, 'raw');
      await deleteCloudinaryImage(a.imagePublicId);
    }
    await Article.deleteMany({ _id: { $in: ids }, admin: req.user.id });

    res.status(200).json({ success: true, message: `${articles.length} articles deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DASHBOARD STATS ───────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCount, thisMonthCount, storageResult, lastArticle, recent] = await Promise.all([
      Article.countDocuments({ admin: adminId }),
      Article.countDocuments({ admin: adminId, createdAt: { $gte: startOfMonth } }),
      Article.aggregate([
        { $match: { admin: require('mongoose').Types.ObjectId.createFromHexString(adminId) } },
        { $group: { _id: null, total: { $sum: '$fileSize' } } },
      ]),
      Article.findOne({ admin: adminId }).sort({ createdAt: -1 }).select('createdAt title'),
      Article.find({ admin: adminId }).sort({ createdAt: -1 }).limit(5).select('title fileName fileSize createdAt type'),
    ]);

    const [newsCount, researchCount] = await Promise.all([
      Article.countDocuments({ admin: adminId, type: 'news' }),
      Article.countDocuments({ admin: adminId, type: 'research' }),
    ]);

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyRaw = await Article.aggregate([
      { $match: { admin: require('mongoose').Types.ObjectId.createFromHexString(adminId), createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const found = monthlyRaw.find(m => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1);
      monthlyData.push({ month: monthNames[d.getMonth()], uploads: found ? found.count : 0 });
    }

    res.status(200).json({
      success: true,
      stats: { totalArticles: totalCount, thisMonth: thisMonthCount, newsCount, researchCount, totalStorageBytes: storageResult[0]?.total || 0, lastUpload: lastArticle?.createdAt || null, recentArticles: recent, monthlyData },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUBLIC: GET all articles ──────────────────────────
exports.getPublicArticles = async (req, res) => {
  try {
    const page      = parseInt(req.query.page)  || 1;
    const limit     = parseInt(req.query.limit) || 12;
    const search    = req.query.search    || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const skip      = (page - 1) * limit;

    let filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];

    const allowedSort = { createdAt: 'createdAt', title: 'title' };
    const sortBy = allowedSort[sortField] || 'createdAt';

    const totalCount = await Article.countDocuments(filter);
    const articles   = await Article.find(filter).select('-admin -imagePublicId').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);

    res.status(200).json({ success: true, articles, pagination: { totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, limit } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUBLIC: GET single article ────────────────────────
exports.getPublicArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).select('-admin -imagePublicId');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
