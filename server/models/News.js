const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true, maxlength: 100 },
    description:  { type: String, required: true, maxlength: 500 },
    image:        { type: String, required: true },
    imagePublicId:{ type: String, required: true },
    publishedDate:{ type: Date, default: null },
    admin:        { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

newsSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('News', newsSchema);
