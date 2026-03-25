const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    images: [
      {
        url: { type: String },
        publicId: { type: String },
        fileName: { type: String },
        position: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hero', heroSchema);
