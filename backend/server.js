require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Connect Database
connectDB();

// Ensure static files folders exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enable CORS
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check / API Welcome root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TechNest Projects REST API Server!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error Handler:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected server error occurred.'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
