const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  student: {
    roll: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String },
    academicYear: { type: String },
    branchKey: { type: String }, // 👈 Added for frontend
    subjectsCount: { type: Number } // 👈 Added for frontend
  },
  
  pushToken: { type: String },
  
  overall: {
    attended: { type: Number, default: 0 },
    recorded: { type: Number, default: 0 },
    status: { type: String, default: 'Regular' },
    percentage: { type: Number, default: 0 }
  },
  
  subjects: [{
    id: { type: String },
    name: { type: String },
    code: { type: String },
    subject: { type: String },
    attended: { type: Number, default: 0 },
    recorded: { type: Number, default: 0 },
    status: { type: String },
    percentage: { type: Number },
    cie: { type: [mongoose.Schema.Types.Mixed], default: [] }
  }]
});

module.exports = mongoose.model('Student', studentSchema);