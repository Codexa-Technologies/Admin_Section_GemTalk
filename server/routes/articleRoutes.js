const express = require('express');
const { createController, getDashboardStats } = require('../controllers/contentController');
const Article = require('../models/Article');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();
const articleCtrl = createController(Article, {
  hasPdf: true,
  hasImage: true,
  imageRequired: false,
  folder: 'gemtalk/articles',
});

// Apply authentication to all routes
router.use(protect);

router.delete('/bulk', articleCtrl.bulkRemove);
router.get('/stats', getDashboardStats);
router.get('/', articleCtrl.getAll);
router.get('/:id', articleCtrl.getOne);
router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), articleCtrl.create);
router.put('/:id', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), articleCtrl.update);
router.delete('/:id', articleCtrl.remove);

module.exports = router;
