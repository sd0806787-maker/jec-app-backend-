const express = require('express');
const mongoose = require('mongoose');
const Issue = require('../models/Issue');
const { isAdminRoll } = require('../utils/admin');
const router = express.Router();

router.post('/report', async (req, res) => {
  try {
    const { title, description, location, reportedBy, imageBase64 } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const issue = await Issue.create({ title, description, location, reportedBy: reportedBy || 'Anonymous', imageBase64: imageBase64 || undefined });
    res.status(201).json({ success: true, message: 'Issue reported successfully', data: issue });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

const getIssuesHandler = async (_req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).select('-imageBase64').lean();
    res.json({ success: true, count: issues.length, data: issues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

router.get('/', getIssuesHandler);
router.get('/all', getIssuesHandler);

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    const issue = await Issue.findById(req.params.id).lean();
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    res.json({ success: true, data: issue });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Delete an issue.
 * Students may delete their own report; admin rolls may delete any report.
 * The acting roll is passed as `?roll=<rollNo>`.
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const roll = String(req.query.roll || req.body?.roll || '').trim();
    if (!roll) {
      return res.status(400).json({ success: false, message: 'Missing roll number' });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    if (!isAdminRoll(roll) && issue.reportedBy !== roll) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reports.',
      });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
