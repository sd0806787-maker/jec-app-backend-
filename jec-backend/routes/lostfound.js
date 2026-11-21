const express = require('express');
const mongoose = require('mongoose');
const LostItem = require('../models/LostItem');
const { isAdminRoll } = require('../utils/admin');

const router = express.Router();

// GET ALL ITEMS
router.get('/all', async (_req, res) => {
  try {
    const items = await LostItem.find()
      .sort({ createdAt: -1 })
      .select('-imageBase64') // 👈 STRICTLY exclude the massive image string to prevent crashes
      .lean();
      
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('❌ Error fetching items:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET SINGLE ITEM
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    const item = await LostItem.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE ITEM
// Students may delete their own post; admin rolls may delete any post.
// The acting roll is passed as `?roll=<rollNo>` (legacy: `?reportedBy=`).
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const { roll, reportedBy } = req.query;
    const actor = String(roll || reportedBy || '').trim();
    if (!actor) {
      return res.status(400).json({ success: false, message: 'Missing roll number' });
    }

    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (!isAdminRoll(actor) && item.reportedBy !== actor) {
      return res.status(403).json({ success: false, message: 'You can only delete your own posts.' });
    }

    await LostItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete item', error: err.message });
  }
});

// POST NEW ITEM (With Base64 support)
router.post('/report', async (req, res) => {
  try {
    const { type, itemName, description, location, contact, reportedBy, imageBase64 } = req.body;
    
    if (!['Lost', 'Found'].includes(type)) {
      return res.status(400).json({ success: false, message: "Type must be 'Lost' or 'Found'" });
    }

    const item = await LostItem.create({
      type, itemName, description, location, contact, 
      reportedBy: reportedBy || 'Anonymous',
      imageBase64: imageBase64 || undefined,
    });

    res.status(201).json({ success: true, message: 'Posted successfully', data: item });
  } catch (error) {
    console.error('❌ LostFound Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save item', error: error.message });
  }
});

module.exports = router;