const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
