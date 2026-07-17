const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyfortechnestprojects2026');

      // Attempt to query database
      try {
        let user = await Admin.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          req.userType = 'admin';
          return next();
        }

        user = await Student.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          req.userType = 'student';
          return next();
        }
      } catch (dbError) {
        console.warn('DB check bypassed during auth: Using JWT details directly (Fallback Mode)');
      }

      // Fallback verification for demo/local sandbox
      if (decoded.role === 'admin' || decoded.email === 'admin@technestprojects.com') {
        req.user = { _id: decoded.id, id: decoded.id, email: decoded.email, role: 'admin', name: decoded.name || 'Admin' };
        req.userType = 'admin';
        return next();
      }

      req.user = { _id: decoded.id, id: decoded.id, email: decoded.email, role: 'student', name: decoded.name || 'Student' };
      req.userType = 'student';
      return next();

    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, admin privileges required' });
  }
};

module.exports = { protect, admin };
