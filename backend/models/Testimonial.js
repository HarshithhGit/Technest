const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  college: { type: String, required: true },
  projectTitle: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  comment: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
