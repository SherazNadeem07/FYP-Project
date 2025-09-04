require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const con = require('./db'); 

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in .env');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx|mp4|mov|avi/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, MP4, MOV, AVI allowed.'));
  }
}).single('file');

// Email transporter configuration
let emailTransporter;
try {
  const emailPassword = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/\s/g, '') : '';
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPassword
    }
  });

  emailTransporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email connection error:', error.message);
      console.log('ℹ️ Ensure 2-Step Verification and App Password are set in Gmail');
    } else {
      console.log('✅ Email server is ready');
    }
  });
} catch (error) {
  console.error('❌ Email transporter creation failed:', error.message);
  emailTransporter = {
    sendMail: async () => {
      throw new Error('Email not configured properly');
    }
  };
}

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Received token:', token ? 'Present' : 'Missing'); // Debug log
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    const result = await con.query(
      'SELECT id, full_name, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    console.log('User lookup result:', result.rows);
    if (result.rows.length === 0) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Routes

// User registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    if (!['entrepreneur', 'investor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userExists = await con.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await con.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
      [fullName, email, hashedPassword, role]
    );

    const token = generateToken(result.rows[0].id, role);

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
      token
    });
  } catch (err) {
    console.error('Signup error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await con.query(
      'SELECT id, full_name, email, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.role);
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (err) {
    console.error('Login error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('Get profile error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user.id;

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const result = await con.query(
      'UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, full_name, email, role',
      [fullName, userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Update profile error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const result = await con.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await con.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await con.query(
      'SELECT id, email, full_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ 
        success: true, 
        message: 'If the email exists, a password reset link has been sent' 
      });
    }

    const user = result.rows[0];
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    await con.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL \'1 hour\' WHERE id = $2',
      [resetToken, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset Request - Shark Tank Idea Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #D0140F; margin: 0;">Shark Tank Idea Platform</h2>
            <p style="color: #666; margin: 5px 0;">Reset Your Password</p>
          </div>
          <p>Hello ${user.full_name},</p>
          <p>You requested to reset your password. Click below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #D0140F; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; 
                      display: inline-block; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this URL:</p>
          <p style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px;">
            ${resetLink}
          </p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you did not request this, please ignore or contact support.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message. Do not reply.<br>
            © 2024 Shark Tank Idea Platform. All rights reserved.
          </p>
        </div>
      `
    };

    try {
      await emailTransporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to: ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError.message);
    }

    res.json({ 
      success: true, 
      message: 'If the email exists, a password reset link has been sent' 
    });
  } catch (err) {
    console.error('Forgot password error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const result = await con.query(
      'SELECT id, reset_token_expiry FROM users WHERE id = $1 AND reset_token = $2',
      [decoded.userId, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const user = result.rows[0];
    if (new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await con.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, decoded.userId]
    );

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
  } catch (err) {
    console.error('Reset password error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all pitches
app.get('/api/entrepreneur/pitches', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await con.query(
      `SELECT 
        p.id, p.name, p.description, p.status, 
        p.funding_goal as "fundingGoal", p.equity_offered as "equityOffered",
        p.pitch_doc_url as "pitchDocUrl", p.pitch_video_url as "pitchVideoUrl",
        p.created_at as "dateSubmitted",
        COUNT(i.id) as "investorCount"
      FROM pitches p 
      LEFT JOIN investments i ON p.id = i.pitch_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({ pitches: result.rows });
  } catch (err) {
    console.error('Get pitches error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single pitch
app.get('/api/entrepreneur/pitches/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await con.query(
      `SELECT 
        p.*, 
        u.full_name as "userName",
        u.email as "userEmail",
        COUNT(i.id) as "investorCount",
        COALESCE(SUM(i.amount), 0) as "totalInvested"
      FROM pitches p 
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN investments i ON p.id = i.pitch_id
      WHERE p.id = $1 AND p.user_id = $2
      GROUP BY p.id, u.full_name, u.email`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    res.json({ pitch: result.rows[0] });
  } catch (err) {
    console.error('Get pitch error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new pitch
app.post('/api/entrepreneur/pitches', authenticateToken, async (req, res) => {
  console.log('Pitch creation request:', req.body, 'User:', req.user);
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      fundingGoal,
      equityOffered,
      pitchDocUrl,
      pitchVideoUrl,
      industry,
      businessModel,
      teamSize,
      foundedYear,
      location,
      revenue
    } = req.body;

    if (!name || !description || fundingGoal == null || equityOffered == null) {
      return res.status(400).json({ error: 'Name, description, funding goal, and equity offered are required' });
    }
    if (isNaN(fundingGoal) || fundingGoal <= 0) {
      return res.status(400).json({ error: 'Funding goal must be a positive number' });
    }
    if (isNaN(equityOffered) || equityOffered < 0 || equityOffered > 100) {
      return res.status(400).json({ error: 'Equity offered must be between 0 and 100' });
    }

    const result = await con.query(
      `INSERT INTO pitches 
        (user_id, name, description, funding_goal, equity_offered, 
         pitch_doc_url, pitch_video_url, industry, business_model, 
         team_size, founded_year, location, revenue, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Pending')
       RETURNING 
         id, name, description, status, 
         funding_goal as "fundingGoal", equity_offered as "equityOffered",
         pitch_doc_url as "pitchDocUrl", pitch_video_url as "pitchVideoUrl",
         created_at as "dateSubmitted"`,
      [
        userId, name, description, parseFloat(fundingGoal), parseFloat(equityOffered),
        pitchDocUrl, pitchVideoUrl, industry, businessModel,
        teamSize, foundedYear, location, revenue
      ]
    );

    res.status(201).json({
      message: 'Pitch created successfully',
      pitch: result.rows[0]
    });
  } catch (err) {
    console.error('Create pitch error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pitch
app.put('/api/entrepreneur/pitches/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      description,
      fundingGoal,
      equityOffered,
      pitchDocUrl,
      pitchVideoUrl,
      industry,
      businessModel,
      teamSize,
      foundedYear,
      location,
      revenue
    } = req.body;

    const checkResult = await con.query(
      'SELECT id FROM pitches WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    const result = await con.query(
      `UPDATE pitches SET 
        name = $1, description = $2, funding_goal = $3, equity_offered = $4,
        pitch_doc_url = $5, pitch_video_url = $6, industry = $7, business_model = $8,
        team_size = $9, founded_year = $10, location = $11, revenue = $12,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $13 AND user_id = $14
       RETURNING 
         id, name, description, status, 
         funding_goal as "fundingGoal", equity_offered as "equityOffered",
         pitch_doc_url as "pitchDocUrl", pitch_video_url as "pitchVideoUrl"`,
      [
        name, description, parseFloat(fundingGoal), parseFloat(equityOffered),
        pitchDocUrl, pitchVideoUrl, industry, businessModel,
        teamSize, foundedYear, location, revenue, id, userId
      ]
    );

    res.json({
      message: 'Pitch updated successfully',
      pitch: result.rows[0]
    });
  } catch (err) {
    console.error('Update pitch error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete pitch
app.delete('/api/entrepreneur/pitches/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const checkResult = await con.query(
      'SELECT id FROM pitches WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    await con.query(
      'DELETE FROM pitches WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Pitch deleted successfully' });
  } catch (err) {
    console.error('Delete pitch error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get startup information
app.get('/api/entrepreneur/startup-info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await con.query(
      `SELECT 
        founded_year as "founded",
        team_size as "teamSize",
        industry,
        location,
        business_model as "businessModel",
        revenue
      FROM user_profiles 
      WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        founded: '',
        teamSize: '',
        industry: '',
        location: '',
        businessModel: '',
        revenue: ''
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get startup info error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update startup information
app.put('/api/entrepreneur/startup-info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { founded, teamSize, industry, location, businessModel, revenue } = req.body;

    const checkResult = await con.query(
      'SELECT user_id FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (checkResult.rows.length === 0) {
      await con.query(
        `INSERT INTO user_profiles 
          (user_id, founded_year, team_size, industry, location, business_model, revenue)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, founded, teamSize, industry, location, businessModel, revenue]
      );
    } else {
      await con.query(
        `UPDATE user_profiles SET 
          founded_year = $1, team_size = $2, industry = $3, 
          location = $4, business_model = $5, revenue = $6,
          updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $7`,
        [founded, teamSize, industry, location, businessModel, revenue, userId]
      );
    }

    res.json({ 
      message: 'Startup information updated successfully',
      startupInfo: { founded, teamSize, industry, location, businessModel, revenue }
    });
  } catch (err) {
    console.error('Update startup info error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload route
app.post('/api/upload/pitch-file', authenticateToken, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${req.file.filename}`;
    console.log('File uploaded:', fileUrl);
    res.json({ 
      message: 'File uploaded successfully',
      fileUrl 
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('JWT_SECRET:', JWT_SECRET ? 'Set' : 'Not set');
  console.log('Frontend URL:', process.env.FRONTEND_URL);
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await con.end();
  process.exit(0);
});