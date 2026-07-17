const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, default: 'Online' },
  fee: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['Upcoming', 'Previous'], default: 'Upcoming' },
  category: { type: String, default: 'General' },
  duration: { type: String, default: '1 Day' },
  benefits: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
