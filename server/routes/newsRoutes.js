const express = require('express');
const { createController } = require('../controllers/contentController');
const News = require('../models/News');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();
const newsCtrl = createController(News, {
  hasPdf: false,
  hasImage: true,
  imageRequired: true,
  folder: 'gemtalk/news',
});

router.use(protect);

router.delete('/bulk', newsCtrl.bulkRemove);
router.get('/', newsCtrl.getAll);
router.get('/:id', newsCtrl.getOne);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), newsCtrl.create);
router.put('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), newsCtrl.update);
router.delete('/:id', newsCtrl.remove);

module.exports = router;
