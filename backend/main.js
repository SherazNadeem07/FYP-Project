require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-jwt-key-minimum-32-characters-change-this';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:${PORT}`;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in .env');
  process.exit(1);
}

// Ensure Uploads directory exists
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created Uploads directory');
}

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  port: process.env.DB_PORT || 5432,
  password: process.env.DB_PASSWORD || 'sheraz12',
  database: process.env.DB_NAME || 'unifyp'
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
    process.exit(1);
  } else {
    console.log('✅ Connected to database');
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx|mp4|mov|avi|jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, MP4, MOV, AVI, JPEG, JPG, PNG allowed.'));
  }
});

const pitchUpload = upload.single('file');
const profileImageUpload = upload.single('profileImage');

// Email transporter configuration
let emailTransporter;
try {
  const emailPassword = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/\s/g, '') : '';
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'sherazkhan48477@gmail.com',
      pass: emailPassword || 'qgoxaincifjkrggs'
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

  console.log('Received token:', token ? 'Present' : 'Missing');
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    const result = await pool.query(
      `SELECT id, full_name, email, role, title, bio, phone, website, linkedin, twitter, profile_image_url 
       FROM users WHERE id = $1`,
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
    const { fullName, email, password, role, title, bio, phone, website, linkedin, twitter } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: 'Full name, email, password, and role are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    if (!['entrepreneur', 'investor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, role, title, bio, phone, website, linkedin, twitter) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, full_name, email, role, title, bio, phone, website, linkedin, twitter, profile_image_url`,
      [fullName, email, hashedPassword, role, title || null, bio || null, phone || null, website || null, linkedin || null, twitter || null]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User created successfully',
      user,
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

    const result = await pool.query(
      `SELECT id, full_name, email, password, role, title, bio, phone, website, linkedin, twitter, profile_image_url 
       FROM users WHERE email = $1`,
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
app.put('/api/auth/update-profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, title, bio, phone, website, linkedin, twitter } = req.body;
    const userId = req.user.id;

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, title = $2, bio = $3, phone = $4, website = $5, linkedin = $6, twitter = $7, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $8 
       RETURNING id, full_name, email, role, title, bio, phone, website, linkedin, twitter, profile_image_url`,
      [fullName, title || null, bio || null, phone || null, website || null, linkedin || null, twitter || null, userId]
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

// Profile image upload
app.post('/api/upload/profile-image', authenticateToken, (req, res) => {
  profileImageUpload(req, res, async (err) => {
    if (err) {
      console.error('Profile image upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.error('No profile image file provided');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${API_BASE_URL}/uploads/${req.file.filename}`;
    const userId = req.user.id;

    try {
      const result = await pool.query(
        `UPDATE users 
         SET profile_image_url = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING id, full_name, email, role, title, bio, phone, website, linkedin, twitter, profile_image_url`,
        [fileUrl, userId]
      );

      console.log('Profile image uploaded:', fileUrl);
      res.json({
        message: 'Profile image uploaded successfully',
        user: result.rows[0]
      });
    } catch (err) {
      console.error('Profile image update error:', err.stack);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
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

    const result = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query(
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

    const result = await pool.query(
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

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL \'1 hour\' WHERE id = $2',
      [resetToken, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'sherazkhan48477@gmail.com',
      to: user.email,
      subject: 'Password Reset Request - InvestHub Idea Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #D0140F; margin: 0;">InvestHub Idea Platform</h2>
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
            © 2025 InvestHub Idea Platform. All rights reserved.
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

    const result = await pool.query(
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

    await pool.query(
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

// Get all pitches for entrepreneurs
app.get('/api/entrepreneur/pitches', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        id, name, description, status, 
        funding_goal AS "fundingGoal", equity_offered AS "equityOffered",
        pitch_doc_url AS "pitchDocUrl", pitch_video_url AS "pitchVideoUrl",
        industry, business_model AS "businessModel", team_size AS "teamSize",
        founded_year AS "foundedYear", location, revenue,
        created_at AS "dateSubmitted",
        (SELECT COUNT(*) FROM investments WHERE pitch_id = pitches.id) AS "investorCount",
        COALESCE((SELECT SUM(amount) FROM investments WHERE pitch_id = pitches.id AND status = 'Accepted'), 0) AS "totalInvested"
      FROM pitches 
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ pitches: result.rows });
  } catch (err) {
    console.error('Get pitches error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single pitch for entrepreneurs
app.get('/api/entrepreneur/pitches/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const result = await pool.query(
      `SELECT 
        p.*, 
        u.full_name AS "userName",
        u.email AS "userEmail",
        (SELECT COUNT(*) FROM investments WHERE pitch_id = p.id) AS "investorCount",
        COALESCE((SELECT SUM(amount) FROM investments WHERE pitch_id = p.id AND status = 'Accepted'), 0) AS "totalInvested"
      FROM pitches p 
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND p.user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found or unauthorized' });
    }

    res.json({ pitch: result.rows[0] });
  } catch (err) {
    console.error('Get pitch error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get investments for a specific pitch
app.get('/api/entrepreneur/investments/:pitchId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { pitchId } = req.params;
    const checkResult = await pool.query(
      'SELECT id FROM pitches WHERE id = $1 AND user_id = $2',
      [pitchId, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found or unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        i.id, i.amount, i.status, i.created_at AS "dateInvested",
        u.full_name AS "investorName",
        u.email AS "investorEmail"
      FROM investments i
      JOIN users u ON i.investor_id = u.id
      WHERE i.pitch_id = $1
      ORDER BY i.created_at DESC`,
      [pitchId]
    );

    res.json({ investments: result.rows });
  } catch (err) {
    console.error('Get investments error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new pitch
app.post('/api/entrepreneur/pitches', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

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
      revenue,
      status = 'Live'
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
    if (teamSize !== null && (isNaN(teamSize) || teamSize < 0)) {
      return res.status(400).json({ error: 'Team size must be a non-negative integer or null' });
    }
    if (foundedYear !== null && (isNaN(foundedYear) || foundedYear < 1900 || foundedYear > new Date().getFullYear())) {
      return res.status(400).json({ error: `Founded year must be between 1900 and ${new Date().getFullYear()} or null` });
    }
    if (revenue !== null && (isNaN(revenue) || revenue < 0)) {
      return res.status(400).json({ error: 'Revenue must be a non-negative integer or null' });
    }
    if (!['Pending', 'Live', 'Funded', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Pending, Live, Funded, or Rejected' });
    }

    const result = await pool.query(
      `INSERT INTO pitches 
        (user_id, name, description, funding_goal, equity_offered, 
         pitch_doc_url, pitch_video_url, industry, business_model, 
         team_size, founded_year, location, revenue, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING 
         id, name, description, status, 
         funding_goal AS "fundingGoal", equity_offered AS "equityOffered",
         pitch_doc_url AS "pitchDocUrl", pitch_video_url AS "pitchVideoUrl",
         industry, business_model AS "businessModel", team_size AS "teamSize",
         founded_year AS "foundedYear", location, revenue,
         created_at AS "dateSubmitted",
         (SELECT COUNT(*) FROM investments WHERE pitch_id = pitches.id) AS "investorCount",
         COALESCE((SELECT SUM(amount) FROM investments WHERE pitch_id = pitches.id AND status = 'Accepted'), 0) AS "totalInvested"`,
      [
        req.user.id,
        name,
        description,
        parseFloat(fundingGoal),
        parseFloat(equityOffered),
        pitchDocUrl || null,
        pitchVideoUrl || null,
        industry || null,
        businessModel || null,
        teamSize,
        foundedYear,
        location || null,
        revenue,
        status
      ]
    );

    console.log(`Pitch created: ${name} by user ${req.user.id} with status ${status}`);
    res.status(201).json({
      message: 'Pitch created successfully',
      pitch: result.rows[0]
    });
  } catch (err) {
    console.error('Create pitch error:', err.message);
    if (err.message.includes('invalid input syntax for type numeric')) {
      return res.status(400).json({ error: 'Invalid numeric input for funding goal or equity offered' });
    }
    if (err.message.includes('invalid input syntax for type integer')) {
      return res.status(400).json({ error: 'Invalid numeric input for team size, founded year, or revenue' });
    }
    if (err.message.includes('unique constraint')) {
      return res.status(400).json({ error: 'A pitch with this name already exists for this user' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pitch
app.put('/api/entrepreneur/pitches/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
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
      revenue,
      status
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
    if (teamSize !== null && (isNaN(teamSize) || teamSize < 0)) {
      return res.status(400).json({ error: 'Team size must be a non-negative integer or null' });
    }
    if (foundedYear !== null && (isNaN(foundedYear) || foundedYear < 1900 || foundedYear > new Date().getFullYear())) {
      return res.status(400).json({ error: `Founded year must be between 1900 and ${new Date().getFullYear()} or null` });
    }
    if (revenue !== null && (isNaN(revenue) || revenue < 0)) {
      return res.status(400).json({ error: 'Revenue must be a non-negative integer or null' });
    }
    if (status && !['Pending', 'Live', 'Funded', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Pending, Live, Funded, or Rejected' });
    }

    const checkResult = await pool.query(
      'SELECT id, status FROM pitches WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found or unauthorized' });
    }

    const currentStatus = checkResult.rows[0].status;
    if (currentStatus === 'Live' || currentStatus === 'Funded') {
      return res.status(403).json({ error: 'Cannot edit Live or Funded pitches' });
    }

    const result = await pool.query(
      `UPDATE pitches 
       SET 
         name = $1, description = $2, funding_goal = $3, equity_offered = $4,
         pitch_doc_url = $5, pitch_video_url = $6, industry = $7, business_model = $8,
         team_size = $9, founded_year = $10, location = $11, revenue = $12,
         status = $13, updated_at = CURRENT_TIMESTAMP
       WHERE id = $14 AND user_id = $15
       RETURNING 
         id, name, description, status, 
         funding_goal AS "fundingGoal", equity_offered AS "equityOffered",
         pitch_doc_url AS "pitchDocUrl", pitch_video_url AS "pitchVideoUrl",
         industry, business_model AS "businessModel", team_size AS "teamSize",
         founded_year AS "foundedYear", location, revenue,
         created_at AS "dateSubmitted",
         (SELECT COUNT(*) FROM investments WHERE pitch_id = pitches.id) AS "investorCount",
         COALESCE((SELECT SUM(amount) FROM investments WHERE pitch_id = pitches.id AND status = 'Accepted'), 0) AS "totalInvested"`,
      [
        name,
        description,
        parseFloat(fundingGoal),
        parseFloat(equityOffered),
        pitchDocUrl || null,
        pitchVideoUrl || null,
        industry || null,
        businessModel || null,
        teamSize,
        foundedYear,
        location || null,
        revenue,
        status || currentStatus,
        id,
        req.user.id
      ]
    );

    console.log(`Pitch updated: ${id} by user ${req.user.id}`);
    res.json({
      message: 'Pitch updated successfully',
      pitch: result.rows[0]
    });
  } catch (err) {
    console.error('Update pitch error:', err.message);
    if (err.message.includes('invalid input syntax for type numeric')) {
      return res.status(400).json({ error: 'Invalid numeric input for funding goal or equity offered' });
    }
    if (err.message.includes('invalid input syntax for type integer')) {
      return res.status(400).json({ error: 'Invalid numeric input for team size, founded year, or revenue' });
    }
    if (err.message.includes('unique constraint')) {
      return res.status(400).json({ error: 'A pitch with this name already exists for this user' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete pitch
app.delete('/api/entrepreneur/pitches/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const checkResult = await pool.query(
      'SELECT id, status FROM pitches WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found or unauthorized' });
    }

    const currentStatus = checkResult.rows[0].status;
    if (currentStatus === 'Live' || currentStatus === 'Funded') {
      return res.status(403).json({ error: 'Cannot delete Live or Funded pitches' });
    }

    await pool.query(
      'DELETE FROM pitches WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    console.log(`Pitch deleted: ${id} by user ${req.user.id}`);
    res.json({ message: 'Pitch deleted successfully' });
  } catch (err) {
    console.error('Delete pitch error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get startup information
app.get('/api/entrepreneur/startup-info', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        founded_year AS "founded",
        team_size AS "teamSize",
        industry,
        location,
        business_model AS "businessModel",
        revenue
      FROM user_profiles 
      WHERE user_id = $1`,
      [req.user.id]
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
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { founded, teamSize, industry, location, businessModel, revenue } = req.body;

    if (teamSize !== null && teamSize !== '' && (isNaN(teamSize) || teamSize < 0)) {
      return res.status(400).json({ error: 'Team size must be a non-negative integer or empty' });
    }
    if (founded !== null && founded !== '' && (isNaN(founded) || founded < 1900 || founded > new Date().getFullYear())) {
      return res.status(400).json({ error: `Founded year must be between 1900 and ${new Date().getFullYear()} or empty` });
    }
    if (revenue !== null && revenue !== '' && (isNaN(revenue) || revenue < 0)) {
      return res.status(400).json({ error: 'Revenue must be a non-negative integer or empty' });
    }

    const checkResult = await pool.query(
      'SELECT user_id FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (checkResult.rows.length === 0) {
      await pool.query(
        `INSERT INTO user_profiles 
          (user_id, founded_year, team_size, industry, location, business_model, revenue)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [req.user.id, founded ? parseInt(founded) : null, teamSize ? parseInt(teamSize) : null, industry || null, location || null, businessModel || null, revenue ? parseInt(revenue) : null]
      );
    } else {
      await pool.query(
        `UPDATE user_profiles 
         SET 
           founded_year = $1, team_size = $2, industry = $3, 
           location = $4, business_model = $5, revenue = $6,
           updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $7`,
        [founded ? parseInt(founded) : null, teamSize ? parseInt(teamSize) : null, industry || null, location || null, businessModel || null, revenue ? parseInt(revenue) : null, req.user.id]
      );
    }

    console.log(`Startup info updated for user ${req.user.id}`);
    res.json({
      message: 'Startup information updated successfully',
      startupInfo: { founded, teamSize, industry, location, businessModel, revenue }
    });
  } catch (err) {
    console.error('Update startup info error:', err.message);
    if (err.message.includes('invalid input syntax for type integer')) {
      return res.status(400).json({ error: 'Invalid numeric input for team size, founded year, or revenue' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File upload for pitch
app.post('/api/upload/pitch-file', authenticateToken, (req, res) => {
  pitchUpload(req, res, async (err) => {
    if (err) {
      console.error('Pitch file upload error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      console.error('No pitch file provided');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${API_BASE_URL}/uploads/${req.file.filename}`;
    console.log('Pitch file uploaded:', fileUrl);
    res.json({
      message: 'Pitch file uploaded successfully',
      fileUrl
    });
  });
});

// Get entrepreneur stats
app.get('/api/entrepreneur/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'entrepreneur') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const stats = await pool.query(
      `SELECT 
        COUNT(*) AS total_pitches,
        COUNT(*) FILTER (WHERE status = 'Funded') AS funded_pitches,
        COALESCE(SUM(funding_goal) FILTER (WHERE status = 'Funded'), 0) AS total_raised
      FROM pitches WHERE user_id = $1`,
      [req.user.id]
    );

    res.json({
      totalPitches: parseInt(stats.rows[0].total_pitches, 10),
      fundedPitches: parseInt(stats.rows[0].funded_pitches, 10),
      totalRaised: parseFloat(stats.rows[0].total_raised)
    });
  } catch (err) {
    console.error('Get stats error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all live pitches for investors
app.get('/api/investor/pitches', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        p.id, p.name AS title, p.description, p.funding_goal AS "fundingGoal", 
        p.equity_offered AS "equityOffered", p.status, 
        u.full_name AS entrepreneur,
        p.pitch_doc_url AS "pitchDocUrl", p.pitch_video_url AS "pitchVideoUrl",
        p.industry, p.business_model AS "businessModel", p.team_size AS "teamSize",
        p.founded_year AS "foundedYear", p.location, p.revenue,
        p.created_at AS "dateSubmitted",
        (SELECT COUNT(*) FROM investments WHERE pitch_id = p.id) AS "investorCount",
        COALESCE((SELECT SUM(amount) FROM investments WHERE pitch_id = p.id AND status = 'Accepted'), 0) AS "totalInvested"
      FROM pitches p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'Live'
      ORDER BY p.created_at DESC`
    );

    console.log(`Fetched ${result.rows.length} live pitches for investor ${req.user.id}`);
    res.json({ pitches: result.rows });
  } catch (err) {
    console.error('Get investor pitches error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Investor makes an investment
app.post('/api/investor/invest', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ error: 'Unauthorized: Only investors can invest' });
    }

    const { pitchId, amount, message } = req.body;
    console.log('Investment request:', { pitchId, amount, message });

    if (!pitchId || !amount) {
      return res.status(400).json({ error: 'Pitch ID and amount are required' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Investment amount must be a positive number' });
    }

    // Verify pitch exists and is live
    const pitchResult = await pool.query(
      `SELECT id, status, funding_goal, 
              COALESCE((SELECT SUM(amount) FROM investments WHERE pitch_id = $1 AND status = 'Accepted'), 0)::NUMERIC AS total_invested 
       FROM pitches 
       WHERE id = $1 AND status = 'Live'`,
      [pitchId]
    );

    if (pitchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found or not live' });
    }

    const pitch = pitchResult.rows[0];
    const newTotal = parseFloat(pitch.total_invested) + parsedAmount;

    if (newTotal > parseFloat(pitch.funding_goal)) {
      return res.status(400).json({ error: 'Investment exceeds funding goal' });
    }

    // Insert investment
    try {
      const result = await pool.query(
        `INSERT INTO investments (pitch_id, investor_id, amount, status)
         VALUES ($1, $2, $3, 'Accepted')
         RETURNING id, pitch_id AS "pitchId", investor_id AS "investorId", amount, status, created_at AS "dateInvested"`,
        [pitchId, req.user.id, parsedAmount]
      );

      // Update pitch status to Funded if goal is reached
      if (newTotal >= parseFloat(pitch.funding_goal)) {
        await pool.query(
          'UPDATE pitches SET status = \'Funded\' WHERE id = $1',
          [pitchId]
        );
        console.log(`Pitch ${pitchId} marked as Funded`);
      }

      // Send notification to entrepreneur
      const entrepreneurResult = await pool.query(
        'SELECT u.email, u.full_name FROM users u JOIN pitches p ON u.id = p.user_id WHERE p.id = $1',
        [pitchId]
      );

      if (entrepreneurResult.rows.length > 0) {
        const entrepreneur = entrepreneurResult.rows[0];
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'sherazkhan48477@gmail.com',
          to: entrepreneur.email,
          subject: 'New Investment in Your Pitch - InvestHub Idea Platform',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #D0140F; margin: 0;">InvestHub Idea Platform</h2>
                <p style="color: #666; margin: 5px 0;">New Investment Notification</p>
              </div>
              <p>Hello ${entrepreneur.full_name},</p>
              <p>An investor has made an investment of $${parsedAmount.toLocaleString()} in your pitch, which has been accepted.</p>
              <p>Please review the investment details in your dashboard.</p>
              ${message ? `<p><strong>Investor Message:</strong> ${message}</p>` : ''}
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                This is an automated message. Do not reply.<br>
                © 2025 InvestHub Idea Platform. All rights reserved.
              </p>
            </div>
          `
        };

        try {
          await emailTransporter.sendMail(mailOptions);
          console.log(`✅ Investment notification sent to: ${entrepreneur.email}`);
        } catch (emailError) {
          console.error('❌ Failed to send investment notification:', emailError.message);
        }
      }

      console.log(`Investment created: $${parsedAmount} in pitch ${pitchId} by investor ${req.user.id}`);
      res.status(201).json({
        message: 'Investment submitted successfully',
        investment: result.rows[0]
      });
    } catch (dbError) {
      console.error('Database insertion error:', dbError.message);
      if (dbError.message.includes('violates check constraint')) {
        return res.status(400).json({ error: 'Invalid investment status' });
      }
      return res.status(500).json({ error: `Database error: ${dbError.message}` });
    }
  } catch (err) {
    console.error('Invest error:', err.message, err.stack);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

// Investor rejects a pitch
app.post('/api/investor/pitches/:id/reject', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ error: 'Unauthorized: Only investors can reject pitches' });
    }

    const { id } = req.params;
    const { message } = req.body;

    // Verify pitch exists and is live
    const pitchResult = await pool.query(
      'SELECT id, user_id, name, status FROM pitches WHERE id = $1 AND status = \'Live\'',
      [id]
    );

    if (pitchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pitch not found or not live' });
    }

    const pitch = pitchResult.rows[0];

    // Check if investor has already interacted with this pitch
    const existingInvestment = await pool.query(
      'SELECT id, status FROM investments WHERE pitch_id = $1 AND investor_id = $2',
      [id, req.user.id]
    );

    if (existingInvestment.rows.length > 0) {
      return res.status(400).json({ error: `You have already ${existingInvestment.rows[0].status.toLowerCase()} this pitch` });
    }

    // Update pitch status to Rejected
    await pool.query(
      'UPDATE pitches SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['Rejected', id]
    );

    // Insert rejection record into investments table
    const result = await pool.query(
      `INSERT INTO investments (pitch_id, investor_id, amount, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, pitch_id AS "pitchId", investor_id AS "investorId", amount, status, created_at AS "dateInvested"`,
      [id, req.user.id, 0, 'Rejected']
    );

    // Send notification to entrepreneur
    const entrepreneurResult = await pool.query(
      'SELECT u.email, u.full_name FROM users u WHERE u.id = $1',
      [pitch.user_id]
    );

    if (entrepreneurResult.rows.length > 0) {
      const entrepreneur = entrepreneurResult.rows[0];
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'sherazkhan48477@gmail.com',
        to: entrepreneur.email,
        subject: 'Pitch Rejected - InvestHub Idea Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #D0140F; margin: 0;">InvestHub Idea Platform</h2>
              <p style="color: #666; margin: 5px 0;">Pitch Rejection Notification</p>
            </div>
            <p>Hello ${entrepreneur.full_name},</p>
            <p>Your pitch "${pitch.name}" has been rejected by an investor.</p>
            <p>Please review the updated pitch details in your dashboard.</p>
            ${message ? `<p><strong>Investor Message:</strong> ${message}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message. Do not reply.<br>
              © 2025 InvestHub Idea Platform. All rights reserved.
            </p>
          </div>
        `
      };

      try {
        await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Pitch rejection notification sent to: ${entrepreneur.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send rejection notification:', emailError.message);
      }
    }

    console.log(`Pitch ${id} rejected by investor ${req.user.id}`);
    res.status(200).json({
      message: 'Pitch rejected successfully',
      investment: result.rows[0]
    });
  } catch (err) {
    console.error('Reject pitch error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Investor rejects their own investment
app.put('/api/investor/investments/:id/reject', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify investment exists and belongs to the investor
    const investmentResult = await pool.query(
      'SELECT i.id, i.pitch_id, i.amount, i.status, p.user_id, p.funding_goal FROM investments i JOIN pitches p ON i.pitch_id = p.id WHERE i.id = $1 AND i.investor_id = $2',
      [id, req.user.id]
    );

    if (investmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Investment not found or unauthorized' });
    }

    const investment = investmentResult.rows[0];
    if (investment.status === 'Rejected') {
      return res.status(400).json({ error: 'Investment is already rejected' });
    }

    // Update investment status to Rejected
    await pool.query(
      'UPDATE investments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['Rejected', id]
    );

    // Check if pitch should revert to Live
    const totalInvestedResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0)::NUMERIC AS total_invested 
       FROM investments 
       WHERE pitch_id = $1 AND status = 'Accepted'`,
      [investment.pitch_id]
    );

    const totalInvested = parseFloat(totalInvestedResult.rows[0].total_invested);
    const fundingGoal = parseFloat(investment.funding_goal);

    if (totalInvested < fundingGoal && investment.status === 'Funded') {
      await pool.query(
        'UPDATE pitches SET status = \'Live\' WHERE id = $1',
        [investment.pitch_id]
      );
      console.log(`Pitch ${investment.pitch_id} status reverted to Live due to insufficient total investment after rejection`);
    }

    // Send notification to entrepreneur
    const entrepreneurResult = await pool.query(
      'SELECT u.email, u.full_name FROM users u WHERE u.id = $1',
      [investment.user_id]
    );

    if (entrepreneurResult.rows.length > 0) {
      const entrepreneur = entrepreneurResult.rows[0];
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'sherazkhan48477@gmail.com',
        to: entrepreneur.email,
        subject: 'Investment Rejected - InvestHub Idea Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #D0140F; margin: 0;">InvestHub Idea Platform</h2>
              <p style="color: #666; margin: 5px 0;">Investment Rejection Notification</p>
            </div>
            <p>Hello ${entrepreneur.full_name},</p>
            <p>An investor has rejected their investment of $${investment.amount.toLocaleString()} in your pitch.</p>
            <p>Please review the updated investment details in your dashboard.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message. Do not reply.<br>
              © 2025 InvestHub Idea Platform. All rights reserved.
            </p>
          </div>
        `
      };

      try {
        await emailTransporter.sendMail(mailOptions);
        console.log(`✅ Investment rejection notification sent to: ${entrepreneur.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send rejection notification:', emailError.message);
      }
    }

    console.log(`Investment ${id} rejected by investor ${req.user.id}`);
    res.json({ message: 'Investment rejected successfully' });
  } catch (err) {
    console.error('Reject investment error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get investor's investments
app.get('/api/investor/investments', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        i.id, i.amount, i.status, i.created_at AS "dateInvested",
        p.name AS startup,
        p.equity_offered AS "equity"
      FROM investments i
      JOIN pitches p ON i.pitch_id = p.id
      WHERE i.investor_id = $1
      ORDER BY i.created_at DESC`,
      [req.user.id]
    );

    res.json({ investments: result.rows });
  } catch (err) {
    console.error('Get investor investments error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('JWT_SECRET:', JWT_SECRET ? 'Set' : 'Not set');
  console.log('Frontend URL:', process.env.FRONTEND_URL);
  console.log('API URL:', API_BASE_URL);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await pool.end();
  console.log('Database connection closed');
  process.exit(0);
});
