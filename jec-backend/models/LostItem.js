const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true }, // Roll number or phone
  imageBase64: { type: String },
  reportedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LostItem', lostItemSchema);