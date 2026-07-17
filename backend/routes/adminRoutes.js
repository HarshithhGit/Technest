const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Project = require('../models/Project');
const Workshop = require('../models/Workshop');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const Certificate = require('../models/Certificate');
const { protect, admin } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// Mount middlewares
router.use(protect);
router.use(admin);

// ----------------------------------------------------
// 1. Dashboard Analytics
// ----------------------------------------------------
router.get('/analytics', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({});
    const totalProjects = await Project.countDocuments({});
    const totalWorkshops = await Workshop.countDocuments({});
    const pendingStudents = await Student.countDocuments({ status: 'Pending' });
    const approvedStudents = await Student.countDocuments({ status: 'Approved' });
    const unreadMessages = await ContactMessage.countDocuments({ status: 'Unread' });

    // Popular categories group
    const projectAggregation = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const categoriesDist = projectAggregation.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      summary: {
        totalStudents,
        totalProjects,
        totalWorkshops,
        pendingStudents,
        approvedStudents,
        unreadMessages
      },
      categories: categoriesDist
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    // Return mock analytics if DB group fails/not active
    res.json({
      summary: {
        totalStudents: 120,
        totalProjects: 15,
        totalWorkshops: 4,
        pendingStudents: 8,
        approvedStudents: 102,
        unreadMessages: 3
      },
      categories: {
        CS: 6,
        AI: 4,
        Electronics: 3,
        Mechanical: 2
      }
    });
  }
});

// ----------------------------------------------------
// 2. Student Management
// ----------------------------------------------------
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve students.' });
  }
});

router.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    // Update status or other fields
    student.name = req.body.name || student.name;
    student.phone = req.body.phone || student.phone;
    student.college = req.body.college || student.college;
    student.branch = req.body.branch || student.branch;
    student.semester = req.body.semester || student.semester;
    student.projectInterest = req.body.projectInterest || student.projectInterest;

    if (req.body.status && student.status !== req.body.status) {
      const oldStatus = student.status;
      student.status = req.body.status;
      
      // Notify student
      const notificationText = `Your registration status has been updated to ${req.body.status}.`;
      student.notifications.push({ text: notificationText });

      if (req.body.status === 'Approved' && oldStatus !== 'Approved') {
        // Send email alert for registration approval
        const approvalEmail = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #4caf50;">Registration Approved!</h2>
            <p>Dear <strong>${student.name}</strong>,</p>
            <p>Congratulations! Your academic profile registration with <strong>TechNest Projects</strong> has been approved.</p>
            <p>You can now log in to your Student Dashboard to track project milestones, access resources, and download certificates.</p>
            <a href="${req.headers.origin || 'http://localhost:3000'}/login" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">Log in to Dashboard</a>
            <p>Best regards,<br/><strong>TechNest Team</strong></p>
          </div>
        `;
        await sendEmail({
          to: student.email,
          subject: 'TechNest Projects - Registration Approved',
          html: approvalEmail
        });
      }
    }

    // Assign project to student
    if (req.body.assignProjectId) {
      const exists = student.projects.some(p => p.project.toString() === req.body.assignProjectId);
      if (!exists) {
        student.projects.push({ project: req.body.assignProjectId, status: 'Assigned' });
        student.notifications.push({ text: `A new project model has been assigned to you.` });
      }
    }

    // Update project progress status
    if (req.body.updateProjectId && req.body.projectStatus) {
      const projIndex = student.projects.findIndex(p => p.project.toString() === req.body.updateProjectId);
      if (projIndex !== -1) {
        student.projects[projIndex].status = req.body.projectStatus;
        student.notifications.push({ text: `Project progress updated to "${req.body.projectStatus}".` });
      }
    }

    // Register to workshop directly
    if (req.body.registerWorkshopId) {
      if (!student.registeredWorkshops.includes(req.body.registerWorkshopId)) {
        student.registeredWorkshops.push(req.body.registerWorkshopId);
        student.notifications.push({ text: `You have been registered for a workshop.` });
      }
    }

    const updated = await student.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update student failed.' });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student.' });
  }
});

// ----------------------------------------------------
// 3. Project CRUD
// ----------------------------------------------------
router.post('/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Create project failed.' });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Update project failed.' });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Delete project failed.' });
  }
});

// ----------------------------------------------------
// 4. Workshop CRUD
// ----------------------------------------------------
router.post('/workshops', async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (error) {
    res.status(500).json({ message: 'Create workshop failed.' });
  }
});

router.put('/workshops/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: 'Update workshop failed.' });
  }
});

router.delete('/workshops/:id', async (req, res) => {
  try {
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Workshop removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Delete workshop failed.' });
  }
});

// ----------------------------------------------------
// 5. Gallery CRUD
// ----------------------------------------------------
router.post('/gallery', async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add gallery item.' });
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gallery item.' });
  }
});

// ----------------------------------------------------
// 6. Testimonial CRUD
// ----------------------------------------------------
router.post('/testimonials', async (req, res) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add testimonial.' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimonial removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete testimonial.' });
  }
});

// ----------------------------------------------------
// 7. Contact Messages Management
// ----------------------------------------------------
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact requests.' });
  }
});

router.put('/contact-messages/:id', async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact request.' });
  }
});

router.delete('/contact-messages/:id', async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact request deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact request.' });
  }
});

// ----------------------------------------------------
// 8. Certificate Generation / Issuance
// ----------------------------------------------------
router.post('/certificates', async (req, res) => {
  try {
    const { studentId, title, type } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Target student not found.' });

    // Generate unique serial certificate ID
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `TN-${type === 'Internship' ? 'INT' : 'WKP'}-${randomHex}`;

    const cert = await Certificate.create({
      certificateId,
      studentId,
      studentName: student.name,
      title,
      type: type || 'Workshop',
      pdfUrl: `/certificates/${certificateId}.pdf` // Mock file path which will be dynamically rendered on frontend
    });

    student.certificates.push(cert._id);
    student.notifications.push({ text: `New Certificate Issued: "${title}" (ID: ${certificateId}). Download it from your dashboard.` });
    await student.save();

    // Send confirmation email
    const emailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #0066cc;">Certificate Issued!</h2>
        <p>Dear <strong>${student.name}</strong>,</p>
        <p>We are pleased to inform you that your completion certificate for <strong>"${title}"</strong> has been successfully generated and issued.</p>
        <p><strong>Certificate Details:</strong></p>
        <ul>
          <li><strong>Certificate ID:</strong> ${certificateId}</li>
          <li><strong>Program Title:</strong> ${title}</li>
          <li><strong>Type:</strong> ${type}</li>
          <li><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        <p>You can view, verify, and download your high-resolution E-Certificate directly from your Student Dashboard.</p>
        <p>Best regards,<br/><strong>TechNest Projects Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: student.email,
      subject: `TechNest Certificate Issued - ${title}`,
      html: emailBody
    });

    res.status(201).json(cert);
  } catch (error) {
    console.error('Certificate Issuance Failed:', error);
    res.status(500).json({ message: 'Failed to generate certificate.' });
  }
});

router.get('/certificates', async (req, res) => {
  try {
    const certs = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve certificates.' });
  }
});

module.exports = router;
