const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Workshop = require('../models/Workshop');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const { sendEmail } = require('../utils/email');

// @desc    Get all projects (with filtering)
// @route   GET /api/public/projects
// @access  Public
router.get('/projects', async (req, res) => {
  try {
    const { category } = req.query;
    const queryObj = {};
    if (category && category !== 'All') {
      queryObj.category = category;
    }
    const projects = await Project.find(queryObj).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Fetch Projects Error:', error);
    res.status(500).json({ message: 'Failed to retrieve projects.' });
  }
});

// @desc    Get workshops (upcoming/previous)
// @route   GET /api/public/workshops
// @access  Public
router.get('/workshops', async (req, res) => {
  try {
    const { status } = req.query;
    const queryObj = {};
    if (status) {
      queryObj.status = status;
    }
    const workshops = await Workshop.find(queryObj).sort({ date: 1 });
    res.json(workshops);
  } catch (error) {
    console.error('Fetch Workshops Error:', error);
    res.status(500).json({ message: 'Failed to retrieve workshops.' });
  }
});

// @desc    Get gallery items
// @route   GET /api/public/gallery
// @access  Public
router.get('/gallery', async (req, res) => {
  try {
    const { type } = req.query;
    const queryObj = {};
    if (type && type !== 'All') {
      queryObj.type = type;
    }
    const gallery = await Gallery.find(queryObj).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    console.error('Fetch Gallery Error:', error);
    res.status(500).json({ message: 'Failed to retrieve gallery items.' });
  }
});

// @desc    Get testimonials
// @route   GET /api/public/testimonials
// @access  Public
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Fetch Testimonials Error:', error);
    res.status(500).json({ message: 'Failed to retrieve testimonials.' });
  }
});

// @desc    Submit contact message
// @route   POST /api/public/contact
// @access  Public
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject: subject || 'Contact Submission',
      message,
      status: 'Unread'
    });

    // Notify administrator
    const adminEmailBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #d9534f;">New Inquiry Received!</h2>
        <p>You have received a new contact inquiry from the TechNest Projects website.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Subject:</strong> ${subject || 'General Enquiry'}</li>
        </ul>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d9534f; border-radius: 4px; font-style: italic;">
          "${message}"
        </div>
        <p>Log in to the Admin Dashboard to reply or manage requests.</p>
      </div>
    `;

    await sendEmail({
      to: 'projectstechnest@gmail.com', // Admin inbox
      subject: `TechNest Website Enquiry - ${name}`,
      html: adminEmailBody
    });

    res.status(201).json({ success: true, message: 'Message sent successfully! We will contact you soon.' });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({ message: 'Failed to submit message.' });
  }
});

module.exports = router;
