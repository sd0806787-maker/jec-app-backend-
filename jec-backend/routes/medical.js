const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const MedicalLeave = require('../models/MedicalLeave');

const router = express.Router();

// 📁 Multer setup using Memory Storage (we don't save to local disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📧 Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/apply', upload.single('document'), async (req, res) => {
  try {
    const { studentName, rollNo, professorName, professorEmail, dateOfAbsence, reason } = req.body;
    
    let pdfId = null;
    let pdfBuffer = null;

    // 1. If a file was uploaded, save it to MongoDB GridFS
    if (req.file) {
      pdfBuffer = req.file.buffer;
      
      // Access the underlying MongoDB connection
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: 'medical_uploads', // This creates a collection called medical_uploads.files
      });

      // Create a unique filename
      const filename = `medical_${rollNo}_${Date.now()}${path.extname(req.file.originalname)}`;
      
      // Open a stream to upload the file
      const uploadStream = bucket.openUploadStream(filename);
      
      // End the stream with the file buffer
      uploadStream.end(pdfBuffer);

      // We can set pdfId to the filename or the GridFS ObjectId
      pdfId = filename;
    }

    // 2. Save application details to Database
    const application = await MedicalLeave.create({
      studentName, 
      rollNo, 
      professorName, 
      professorEmail, 
      dateOfAbsence, 
      reason, 
      pdfUrl: pdfId // Storing the filename or GridFS ID
    });

    // 3. Send Email to Professor
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: professorEmail,
      subject: `Medical Leave Application - ${studentName} (${rollNo})`,
      text: `Dear Prof. ${professorName},\n\nI am writing to inform you that I was absent on ${dateOfAbsence}.\n\nReason: ${reason}\n\nPlease find my medical certificate attached to this email.\n\nRegards,\n${studentName}\nRoll No: ${rollNo}`,
      // Since we used memory storage, we pass the buffer directly to Nodemailer
      attachments: req.file ? [
        {
          filename: req.file.originalname,
          content: pdfBuffer,
        }
      ] : [],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Medical leave applied by ${rollNo}, saved to GridFS, and email sent.`);

    res.status(201).json({ 
      success: true, 
      message: 'Application submitted and email sent!',
      applicationId: application._id
    });

  } catch (error) {
    console.error('❌ Medical Leave Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
  }
});

module.exports = router;