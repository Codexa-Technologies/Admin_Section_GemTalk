const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');

// @desc    Get all articles with pagination and search
// @route   GET /api/articles
// @access  Private
exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    const skip = (page - 1) * limit;

    // Build filter
    let filter = { admin: req.user.id };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = to;
      }
    }

    const allowedSortFields = { createdAt: 'createdAt', title: 'title', fileSize: 'fileSize' };
    const sortBy = allowedSortFields[sortField] || 'createdAt';

    // Get total count for pagination
    const totalCount = await Article.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get articles
    const articles = await Article.find(filter)
      .select('-admin')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      articles,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Private
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check if article belongs to logged in admin
    if (article.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this article',
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private
exports.createArticle = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate inputs
    if (!title || !description) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log(err);
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
    }

    // Create article
    const article = await Article.create({
      title,
      description,
      pdf: `/uploads/articles/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      publishedDate: req.body.publishedDate ? new Date(req.body.publishedDate) : null,
      admin: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    // Delete uploaded file if article creation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log(err);
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check if article belongs to logged in admin
    if (article.admin.toString() !== req.user.id) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log(err);
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article',
      });
    }

    // Update basic fields
    if (req.body.title) article.title = req.body.title;
    if (req.body.description) article.description = req.body.description;
    if (req.body.publishedDate !== undefined) article.publishedDate = req.body.publishedDate ? new Date(req.body.publishedDate) : null;

    // If new file is uploaded, delete old file and update
    if (req.file) {
      const oldFilePath = path.join(__dirname, '../' + article.pdf);
      fs.unlink(oldFilePath, (err) => {
        if (err) console.log(err);
      });

      article.pdf = `/uploads/articles/${req.file.filename}`;
      article.fileName = req.file.originalname;
      article.fileSize = req.file.size;
    }

    article = await article.save();

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Bulk delete articles
// @route   DELETE /api/articles/bulk
// @access  Private
exports.bulkDeleteArticles = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No article IDs provided' });
    }

    const articles = await Article.find({ _id: { $in: ids }, admin: req.user.id });

    for (const article of articles) {
      const filePath = path.join(__dirname, '../' + article.pdf);
      fs.unlink(filePath, (err) => { if (err) console.log(err); });
    }

    await Article.deleteMany({ _id: { $in: ids }, admin: req.user.id });

    res.status(200).json({ success: true, message: `${articles.length} articles deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/articles/stats
// @access  Private
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
      Article.find({ admin: adminId }).sort({ createdAt: -1 }).limit(5).select('title fileName fileSize createdAt'),
    ]);

    // Monthly uploads for last 6 months
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
      stats: {
        totalArticles: totalCount,
        thisMonth: thisMonthCount,
        totalStorageBytes: storageResult[0]?.total || 0,
        lastUpload: lastArticle?.createdAt || null,
        recentArticles: recent,
        monthlyData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check if article belongs to logged in admin
    if (article.admin.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article',
      });
    }

    // Delete PDF file from server
    const filePath = path.join(__dirname, '../' + article.pdf);
    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });

    // Delete article from database
    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
