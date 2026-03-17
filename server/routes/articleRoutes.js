const express = require('express');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getDashboardStats,
  bulkDeleteArticles,
} = require('../controllers/articleController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

router.delete('/bulk', bulkDeleteArticles);
router.get('/stats', getDashboardStats);
router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', upload.single('pdf'), createArticle);
router.put('/:id', upload.single('pdf'), updateArticle);
router.delete('/:id', deleteArticle);

module.exports = router;
