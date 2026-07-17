const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Workshop', 'Project', 'College Event', 'Certificate', 'Video'], required: true },
  url: { type: String, required: true },
  caption: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
