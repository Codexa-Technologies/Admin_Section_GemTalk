const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide an article description'],
      maxlength: [500, 'Description cannot be longer than 500 characters'],
    },
    pdf: {
      type: String,
      required: [true, 'Please upload a PDF file'],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    publishedDate: {
      type: Date,
      default: null,
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for text search
articleSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Article', articleSchema);
