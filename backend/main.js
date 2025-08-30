// main.js - BAHUT TOP PE YE LINE ADD KAREIN
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const con = require('./db'); 

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration with improved error handling
let emailTransporter;
try {
  // Remove any spaces from the password
  const emailPassword = process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/\s/g, '') : '';
  
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPassword
    }
  });

  // Test email connection
  emailTransporter.verify(function(error, success) {
    if (error) {
      console.log('❌ Email connection error:', error.message);
      console.log('ℹ️  Please check your Gmail settings:');
      console.log('1. Ensure 2-Step Verification is enabled');
      console.log('2. Generate an App Password from Google Account settings');
      console.log('3. Make sure EMAIL_PASSWORD in .env is the 16-character App Password (no spaces)');
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
} catch (error) {
  console.log('❌ Email transporter creation failed:', error.message);
  // Create a dummy transporter to prevent crashes
  emailTransporter = {
    sendMail: async () => {
      console.log('ℹ️  Email functionality disabled due to configuration error');
      throw new Error('Email not configured properly');
    }
  };
}

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await con.query(
      'SELECT id, full_name, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Routes

// User registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    if (!['entrepreneur', 'investor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const userExists = await con.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await con.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
      [fullName, email, hashedPassword, role]
    );

    // Generate token
    const token = generateToken(result.rows[0].id, role);

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await con.query(
      'SELECT id, full_name, email, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('Get profile error:', err);
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
    console.error('Update profile error:', err);
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

    // Get current password
    const result = await con.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    const validPassword = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await con.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password - generate reset token and send email
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const result = await con.query(
      'SELECT id, email, full_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // For security, don't reveal if email exists
      return res.json({ 
        success: true, 
        message: 'If the email exists, a password reset link has been sent' 
      });
    }

    const user = result.rows[0];
    
    // Generate reset token (using JWT for simplicity)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password_reset' }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Store reset token in database with expiry (1 hour)
    await con.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL \'1 hour\' WHERE id = $2',
      [resetToken, user.id]
    );

    // Create reset link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    // Email content
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
          
          <p>You recently requested to reset your password for your Shark Tank Idea Platform account. Click the button below to reset it:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #D0140F; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; 
                      display: inline-block; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this URL into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px;">
            ${resetLink}
          </p>
          
          <p>This password reset link will expire in <strong>1 hour</strong> for security reasons.</p>
          
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply to this email.<br>
            © 2024 Shark Tank Idea Platform. All rights reserved.
          </p>
        </div>
      `
    };

    // Send email
    try {
      await emailTransporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to: ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError.message);
      // Even if email fails, we still return success to the user
      // but log the error for debugging
    }

    res.json({ 
      success: true, 
      message: 'If the email exists, a password reset link has been sent' 
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password - validate token and set new password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is for password reset
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check if token exists in database and hasn't expired
    const result = await con.query(
      'SELECT id, reset_token_expiry FROM users WHERE id = $1 AND reset_token = $2',
      [decoded.userId, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const user = result.rows[0];

    // Check if token has expired
    if (new Date() > new Date(user.reset_token_expiry)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await con.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, decoded.userId]
    );

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully' 
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await con.end();
  process.exit(0);
});