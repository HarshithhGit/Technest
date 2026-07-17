const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true },
  projectInterest: { type: String, default: '' },
  workshopSelection: [{ type: String }],
  internshipSelection: [{ type: String }],
  message: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  password: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  registeredWorkshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
  projects: [{
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: ['Assigned', 'In Progress', 'Testing', 'Completed'], default: 'Assigned' }
  }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],
  notifications: [{
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }]
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
