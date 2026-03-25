const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const uploadImageToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const uploadRawToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const deleteCloudinaryImage = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try { await cloudinary.uploader.destroy(publicId, { resource_type: resourceType }); } catch (e) { console.log('Cloudinary delete error:', e.message); }
};

const deleteLocalFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(path.join(__dirname, '../' + filePath), () => {});
};

// ── Factory: returns controller functions bound to a specific Model ──
const createController = (Model, { hasPdf = true, hasImage = true, imageRequired = false, folder = 'gemtalk' } = {}) => {

  const getAll = async (req, res) => {
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
      // allow filtering by type (news/event) for collections that have a `type` field
      if (req.query.type) filter.type = req.query.type;
      if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
        if (dateTo) { const to = new Date(dateTo); to.setHours(23, 59, 59, 999); filter.createdAt.$lte = to; }
      }

      const allowedSort = { createdAt: 'createdAt', title: 'title', fileSize: 'fileSize' };
      const sortBy = allowedSort[sortField] || 'createdAt';
      const totalCount = await Model.countDocuments(filter);
      const items = await Model.find(filter).select('-admin').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);

      res.json({ success: true, articles: items, pagination: { totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, limit } });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  };

  const getOne = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      if (item.admin.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  };

  const create = async (req, res) => {
    const pdfFile   = hasPdf    ? req.files?.pdf?.[0]   : null;
    const imageFile = hasImage  ? req.files?.image?.[0] : null;
    const imagesFiles = req.files?.images || null;
    let imageUrl = null, imagePublicId = null;

    const uploadedImages = [];

    try {
      const { title, description, publishedDate, downloadAvailable, type, eventDate, location } = req.body;
      if (!title || !description) {
        if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
        return res.status(400).json({ success: false, message: 'Please provide title and description' });
      }
      if (hasPdf && !pdfFile) {
        return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
      }
      if (imageRequired && !imageFile && !(type === 'event' && imagesFiles?.length)) {
        if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
        return res.status(400).json({ success: false, message: 'Please upload a cover image' });
      }

      if (imageFile?.buffer) {
        const result = await uploadImageToCloudinary(imageFile.buffer, folder);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      }

      if (imagesFiles && imagesFiles.length) {
        for (const f of imagesFiles.slice(0, 5)) {
          if (f?.buffer) {
            const r = await uploadImageToCloudinary(f.buffer, folder);
            uploadedImages.push({ url: r.secure_url, publicId: r.public_id, fileName: f.originalname, fileSize: f.size });
          }
        }
      }

      if (!imageUrl && uploadedImages.length) {
        imageUrl = uploadedImages[0].url;
        imagePublicId = uploadedImages[0].publicId;
      }

      const doc = {
        title,
        description,
        type: type || 'news',
        image: imageUrl,
        imagePublicId,
        images: uploadedImages.length ? uploadedImages : undefined,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        eventDate: eventDate ? new Date(eventDate) : null,
        location: location || null,
        // allow boolean string from FormData ('true'/'false')
        ...(downloadAvailable !== undefined ? { downloadAvailable: downloadAvailable === 'true' || downloadAvailable === true } : {}),
        admin: req.user.id,
      };
      if (hasPdf && pdfFile) {
        const localPath = path.join(__dirname, '../uploads/articles', pdfFile.filename);
        const buffer = fs.readFileSync(localPath);
        try {
          const r = await uploadRawToCloudinary(buffer, `${folder}/pdfs`);
          doc.pdf = r.secure_url;
          doc.pdfPublicId = r.public_id;
        } catch (err) {
          deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
          throw err;
        }
        doc.fileName = pdfFile.originalname;
        doc.fileSize = pdfFile.size;
        deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      }

      const item = await Model.create(doc);
      res.status(201).json({ success: true, data: item });
    } catch (e) {
      if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      if (imagePublicId) await deleteCloudinaryImage(imagePublicId);
      res.status(500).json({ success: false, message: e.message });
    }
  };

  const update = async (req, res) => {
    const pdfFile   = hasPdf   ? req.files?.pdf?.[0]   : null;
    const imageFile = hasImage ? req.files?.image?.[0] : null;
    const imagesFiles = req.files?.images || null;

    try {
      let item = await Model.findById(req.params.id);
      if (!item) {
        if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      if (item.admin.toString() !== req.user.id) {
        if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      if (req.body.title)       item.title       = req.body.title;
      if (req.body.description) item.description = req.body.description;
      if (req.body.publishedDate !== undefined) item.publishedDate = req.body.publishedDate ? new Date(req.body.publishedDate) : null;
      if (req.body.eventDate !== undefined) item.eventDate = req.body.eventDate ? new Date(req.body.eventDate) : null;
      if (req.body.location !== undefined) item.location = req.body.location || null;
      if (req.body.type !== undefined) item.type = req.body.type;
      if (req.body.downloadAvailable !== undefined) item.downloadAvailable = req.body.downloadAvailable === 'true' || req.body.downloadAvailable === true;

      if (hasPdf && pdfFile) {
        if (item.pdfPublicId) await deleteCloudinaryImage(item.pdfPublicId, 'raw');
        const localPath = path.join(__dirname, '../uploads/articles', pdfFile.filename);
        const buffer = fs.readFileSync(localPath);
        const r = await uploadRawToCloudinary(buffer, `${folder}/pdfs`);
        item.pdf = r.secure_url;
        item.pdfPublicId = r.public_id;
        item.fileName = pdfFile.originalname;
        item.fileSize = pdfFile.size;
        deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      }
      if (hasImage && imageFile?.buffer) {
        await deleteCloudinaryImage(item.imagePublicId);
        const result = await uploadImageToCloudinary(imageFile.buffer, folder);
        item.image         = result.secure_url;
        item.imagePublicId = result.public_id;
      }

      // replace event images if provided
      if (imagesFiles && imagesFiles.length) {
        // delete previous images
        if (Array.isArray(item.images)) {
          for (const img of item.images) {
            if (img?.publicId) await deleteCloudinaryImage(img.publicId);
          }
        }
        const newImages = [];
        for (const f of imagesFiles.slice(0,5)) {
          if (f?.buffer) {
            const r = await uploadImageToCloudinary(f.buffer, folder);
            newImages.push({ url: r.secure_url, publicId: r.public_id, fileName: f.originalname, fileSize: f.size });
          }
        }
        item.images = newImages;

        if (newImages.length && (!item.image || req.body.type === 'event')) {
          if (item.imagePublicId) {
            await deleteCloudinaryImage(item.imagePublicId);
          }
          item.image = newImages[0].url;
          item.imagePublicId = newImages[0].publicId;
        }
      }

      item = await item.save();
      res.json({ success: true, data: item });
    } catch (e) {
      if (pdfFile) deleteLocalFile(`/uploads/articles/${pdfFile.filename}`);
      res.status(500).json({ success: false, message: e.message });
    }
  };

  const remove = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      if (item.admin.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

      if (hasPdf) deleteLocalFile(item.pdf);
      if (item.pdfPublicId) await deleteCloudinaryImage(item.pdfPublicId, 'raw');
      await deleteCloudinaryImage(item.imagePublicId);
      if (Array.isArray(item.images)) {
        for (const img of item.images) {
          if (img?.publicId) await deleteCloudinaryImage(img.publicId);
        }
      }
      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  };

  const bulkRemove = async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids?.length) return res.status(400).json({ success: false, message: 'No IDs provided' });
      const items = await Model.find({ _id: { $in: ids }, admin: req.user.id });
      for (const item of items) {
        if (hasPdf) deleteLocalFile(item.pdf);
        if (item.pdfPublicId) await deleteCloudinaryImage(item.pdfPublicId, 'raw');
        await deleteCloudinaryImage(item.imagePublicId);
      }
      await Model.deleteMany({ _id: { $in: ids }, admin: req.user.id });
      res.json({ success: true, message: `${items.length} items deleted` });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  };

  // Public: list
  const publicGetAll = async (req, res) => {
    try {
      const page      = parseInt(req.query.page)  || 1;
      const limit     = parseInt(req.query.limit) || 12;
      const search    = req.query.search    || '';
      const sortField = req.query.sortField || 'createdAt';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      const dateFrom  = req.query.dateFrom;
      const dateTo    = req.query.dateTo;
      const skip      = (page - 1) * limit;

      let filter = {};
      if (req.query.type && Model.schema.path('type')) {
        filter.type = req.query.type;
      }
      if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
      if (dateFrom || dateTo) {
        const dateField =
          req.query.type === 'event' && Model.schema.path('eventDate')
            ? 'eventDate'
            : Model.schema.path('publishedDate')
              ? 'publishedDate'
              : 'createdAt';

        filter[dateField] = {};
        if (dateFrom) filter[dateField].$gte = new Date(dateFrom);
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          filter[dateField].$lte = to;
        }
      }

      const allowedSort = { createdAt: 'createdAt', title: 'title' };
      const sortBy = allowedSort[sortField] || 'createdAt';
      const totalCount = await Model.countDocuments(filter);
      const items = await Model.find(filter).select('-admin -imagePublicId').sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);

      res.json({ success: true, articles: items, pagination: { totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, limit } });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  };

  // Public: single
  const publicGetOne = async (req, res) => {
    try {
      const item = await Model.findById(req.params.id).select('-admin -imagePublicId');
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
  };

  return { getAll, getOne, create, update, remove, bulkRemove, publicGetAll, publicGetOne };
};

// ── Dashboard stats (across all 3 collections) ────────
const getDashboardStats = async (req, res) => {
  const News     = require('../models/News');
  const Article  = require('../models/Article');
  const Research = require('../models/ResearchPaper');

  try {
    const adminId = req.user.id;
    const adminObjId = mongoose.Types.ObjectId.createFromHexString(adminId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [newsCount, articleCount, researchCount, newsMonth, articleMonth, researchMonth] = await Promise.all([
      News.countDocuments({ admin: adminId }),
      Article.countDocuments({ admin: adminId }),
      Research.countDocuments({ admin: adminId }),
      News.countDocuments({ admin: adminId, createdAt: { $gte: startOfMonth } }),
      Article.countDocuments({ admin: adminId, createdAt: { $gte: startOfMonth } }),
      Research.countDocuments({ admin: adminId, createdAt: { $gte: startOfMonth } }),
    ]);

    const storageResult = await Article.aggregate([
      { $match: { admin: adminObjId } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } },
    ]);
    const researchStorage = await Research.aggregate([
      { $match: { admin: adminObjId } },
      { $group: { _id: null, total: { $sum: '$fileSize' } } },
    ]);

    const recent = await Promise.all([
      News.find({ admin: adminId }).sort({ createdAt: -1 }).limit(3).select('title createdAt'),
      Article.find({ admin: adminId }).sort({ createdAt: -1 }).limit(3).select('title fileName fileSize createdAt'),
      Research.find({ admin: adminId }).sort({ createdAt: -1 }).limit(3).select('title fileName fileSize createdAt'),
    ]);
    const recentAll = [
      ...recent[0].map(r => ({ ...r.toObject(), type: 'news' })),
      ...recent[1].map(r => ({ ...r.toObject(), type: 'article' })),
      ...recent[2].map(r => ({ ...r.toObject(), type: 'research' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const [n, a, r] = await Promise.all([
        News.countDocuments({ admin: adminId, createdAt: { $gte: d, $lt: next } }),
        Article.countDocuments({ admin: adminId, createdAt: { $gte: d, $lt: next } }),
        Research.countDocuments({ admin: adminId, createdAt: { $gte: d, $lt: next } }),
      ]);
      monthlyData.push({ month: monthNames[d.getMonth()], uploads: n + a + r });
    }

    res.json({
      success: true,
      stats: {
        totalArticles: newsCount + articleCount + researchCount,
        newsCount, articleCount, researchCount,
        thisMonth: newsMonth + articleMonth + researchMonth,
        totalStorageBytes: (storageResult[0]?.total || 0) + (researchStorage[0]?.total || 0),
        lastUpload: recentAll[0]?.createdAt || null,
        recentArticles: recentAll,
        monthlyData,
      },
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

module.exports = { createController, getDashboardStats };
