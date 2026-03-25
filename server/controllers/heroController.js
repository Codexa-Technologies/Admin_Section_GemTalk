const Hero = require('../models/Hero');
const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = (buffer, folder = 'gemtalk/hero') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try { await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }); } catch (e) { console.log('Cloudinary delete error:', e.message); }
};

exports.getHero = async (req, res) => {
  try {
    const doc = await Hero.findOne();
    if (!doc) return res.json({ success: true, data: { images: [] } });
    res.json({ success: true, data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

exports.uploadImage = async (req, res) => {
  try {
    const file = req.files?.image?.[0] || req.file;
    const position = req.body.position !== undefined ? parseInt(req.body.position, 10) : undefined;
    if (!file) return res.status(400).json({ success: false, message: 'No image provided' });

    const result = await uploadImageToCloudinary(file.buffer || file.stream, 'gemtalk/hero');

    let doc = await Hero.findOne();
    if (!doc) doc = await Hero.create({ images: [] });

    const imgObj = { url: result.secure_url, publicId: result.public_id, fileName: file.originalname || file.filename };

    if (Number.isInteger(position)) {
      doc.images[position] = imgObj;
    } else {
      doc.images.push(imgObj);
    }

    await doc.save();
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId) return res.status(400).json({ success: false, message: 'Missing publicId' });
    await deleteCloudinaryImage(publicId);
    const doc = await Hero.findOne();
    if (doc) {
      doc.images = doc.images.filter(i => i.publicId !== publicId);
      await doc.save();
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};
