const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Computer Science, Electronics, Electrical, Mechanical, Civil, AI, IoT, Python, Java
  techUsed: [{ type: String }],
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  imageUrl: { type: String, default: '' },
  brochureUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
