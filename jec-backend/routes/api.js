const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const nodemailer = require('nodemailer');

// Setup Nodemailer (Uses the EMAIL_USER and EMAIL_PASS from your .env file)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'jec.companion@gmail.com', // Fallback for testing
    pass: process.env.EMAIL_PASS || 'your_app_password'        // Fallback for testing
  }
});

// 1. Fetch Student Data
router.get('/action', async (req, res) => {
  try {
    const { action, roll } = req.query;
    if (action !== 'studentReport' || !roll) {
      return res.status(400).json({ error: 'Invalid action or missing roll number' });
    }
    const student = await Student.findOne({ 'student.roll': roll });
    if (!student) {
      const response = await fetch(`https://attendance.jecassam.ac.in/api/action?action=studentReport&roll=${roll}`);
      const data = await response.json();
      return res.json(data);
    }
    res.json(student);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Send Medical Email DIRECTLY
router.post('/send-medical-email', async (req, res) => {
  const { professorEmail, subject, body } = req.body;
  
  if (!professorEmail || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'jec.companion@gmail.com',
      to: professorEmail,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
