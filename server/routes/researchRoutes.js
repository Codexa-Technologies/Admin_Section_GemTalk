const express = require('express');
const { createController } = require('../controllers/contentController');
const ResearchPaper = require('../models/ResearchPaper');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();
const researchCtrl = createController(ResearchPaper, {
  hasPdf: true,
  hasImage: true,
  imageRequired: false,
  folder: 'gemtalk/research',
});

router.use(protect);

router.delete('/bulk', researchCtrl.bulkRemove);
router.get('/', researchCtrl.getAll);
router.get('/:id', researchCtrl.getOne);
router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), researchCtrl.create);
router.put('/:id', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'image', maxCount: 1 }]), researchCtrl.update);
router.delete('/:id', researchCtrl.remove);

module.exports = router;
