const mongoose = require('mongoose');

const medicalLeaveSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  professorName: { type: String, required: true },
  professorEmail: { type: String, required: true },
  dateOfAbsence: { type: String, required: true },
  reason: { type: String, required: true },
  pdfUrl: { type: String }, // Path to the uploaded PDF
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MedicalLeave', medicalLeaveSchema);