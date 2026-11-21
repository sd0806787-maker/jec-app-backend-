const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  reportedBy: { type: String, default: 'Anonymous' },
  imageBase64: { type: String },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// 👇 CRITICAL: Export the Model, not the Schema
module.exports = mongoose.model('Issue', issueSchema);