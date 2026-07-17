const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  title: { type: String, required: true }, // e.g., Web Development Internship
  issueDate: { type: Date, default: Date.now },
  pdfUrl: { type: String, default: '' },
  type: { type: String, enum: ['Workshop', 'Internship', 'Project'], default: 'Workshop' }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
