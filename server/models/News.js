const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true, maxlength: 100 },
    description:  { type: String, required: true, maxlength: 500 },
    // type: 'news' or 'event'
    type:         { type: String, enum: ['news', 'event'], default: 'news' },
    // single cover image for news
    image:        { type: String, default: null },
    imagePublicId:{ type: String, default: null },
    // for events: multiple images (max 5)
    images:       [{ url: String, publicId: String, fileName: String, fileSize: Number }],
    // date for news or event date
    publishedDate:{ type: Date, default: null },
    eventDate:    { type: Date, default: null },
    // event location
    location:     { type: String, default: null },
    admin:        { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

newsSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('News', newsSchema);
