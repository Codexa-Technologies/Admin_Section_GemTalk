const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true, maxlength: 100 },
    description:  { type: String, required: true, maxlength: 500 },
    pdf:          { type: String, required: true },
    fileName:     { type: String, required: true },
    fileSize:     { type: Number },
    image:        { type: String, default: null },
    imagePublicId:{ type: String, default: null },
    publishedDate:{ type: Date, default: null },
    downloadAvailable: { type: Boolean, default: true },
    admin:        { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

researchSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('ResearchPaper', researchSchema);
