const express = require('express');
const router = express.Router();
const { getHero, uploadImage, deleteImage } = require('../controllers/heroController');
const upload = require('../middlewares/upload');
const { protect } = require('../middlewares/auth');

// Public: get configured hero images
router.get('/', getHero);

// Admin: upload or replace hero image
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }]), uploadImage);

// Admin: delete by cloudinary public id
router.delete('/:publicId', protect, deleteImage);

module.exports = router;
