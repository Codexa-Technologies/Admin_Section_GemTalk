const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true, maxlength: 100 },
    description:  { type: String, required: true, maxlength: 500 },
    pdf:          { type: String, required: true },
    fileName:     { type: String, required: true },
    fileSize:     { type: Number },
    image:        { type: String, default: null },
    imagePublicId:{ type: String, default: null },
    publishedDate:{ type: Date, default: null },
    admin:        { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Article', articleSchema);
