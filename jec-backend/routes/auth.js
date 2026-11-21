const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jec_key_2026';

// Helper function to fetch live data from JEC API
async function fetchJECData(rollNumber) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(
      `https://attendance.jecassam.ac.in/api/action?action=studentReport&roll=${rollNumber}`,
      { signal: controller.signal },
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('JEC API Error:', error.message || error);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Enrollment numbers can mix letters and digits (e.g. CS2021001), so match
// them case-insensitively and always store them in upper case.
const findStudentByRoll = (roll) =>
  Student.findOne({ 'student.roll': roll }).collation({ locale: 'en', strength: 2 });

function getBranchKey(branchName = '') {  if (branchName.includes('Computer')) return 'CSE';
  if (branchName.includes('Electronics')) return 'ETC';
  if (branchName.includes('Mechanical')) return 'ME';
  if (branchName.includes('Civil')) return 'CE';
  if (branchName.includes('Instrumentation')) return 'IN';
  return 'OTHER';
}

function applyLiveData(student, liveData) {
  const branchName = liveData.student.branch || 'N/A';
  const liveRoll = String(liveData.student.roll || '')
    .toUpperCase()
    .replace(/\s+/g, '')
    .trim();

  student.student = {
    roll: liveRoll,
    name: liveData.student.name,
    branch: branchName,
    semester: liveData.student.semester,
    section: liveData.student.section || 'N/A',
    academicYear: liveData.student.academicYear || 'N/A',
    branchKey: getBranchKey(branchName),
    subjectsCount: liveData.subjects.length,
  };

  student.overall = liveData.overall;

  student.subjects = liveData.subjects.map((sub, index) => ({
    id: sub.code || index.toString(),
    name: sub.subject,
    code: sub.code,
    subject: sub.subject,
    attended: sub.attended || 0,
    recorded: sub.recorded || 0,
    percentage: sub.percentage || 0,
    status: sub.status || '',
    cie: sub.cie || [null, null, null],
  }));

  return student;
}

// ==========================================
// 1. CREATE ACCOUNT (REGISTER)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { email, roll, name, branch, semester, password } = req.body;

    // Validation
    if (!email || !roll || !name || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    // Check if Email is already taken
    const emailExists = await Student.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    // Check if Enrollment Number is already taken
    const rollExists = await findStudentByRoll(roll.toUpperCase().trim());
    if (rollExists) {
      return res.status(400).json({ error: 'This enrollment number is already registered.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new student
    const newStudent = new Student({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      student: {
        roll: roll.toUpperCase().trim(),
        name: name.trim(),
        branch: branch || 'CSE',
        semester: semester || 1
      },
      overall: { attended: 0, recorded: 0, status: 'Regular', percentage: 0 },
      subjects: [] 
    });

    await newStudent.save();
    res.status(201).json({ success: true, message: 'Account created successfully. Please login.' });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ==========================================
// 2. LOGIN (Fetches Live Data & Returns Token)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find the student by Email OR Roll Number
    const student = await Student.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { 'student.roll': identifier.toUpperCase().trim() }
      ]
    });

    if (!student) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // 👇 FETCH LIVE DATA FROM JEC API
    const liveData = await fetchJECData(student.student.roll);

    if (liveData && liveData.student && liveData.overall && liveData.subjects) {
      // Map Branch Key
      const branchName = liveData.student.branch || 'N/A';
      let branchKey = 'OTHER';
      if (branchName.includes('Computer')) branchKey = 'CSE';
      else if (branchName.includes('Electronics')) branchKey = 'ETC';
      else if (branchName.includes('Mechanical')) branchKey = 'ME';
      else if (branchName.includes('Civil')) branchKey = 'CE';
      else if (branchName.includes('Instrumentation')) branchKey = 'IN'; 

      // Update student record with live data
      student.student = {
        roll: liveData.student.roll,
        name: liveData.student.name,
        branch: branchName,
        semester: liveData.student.semester,
        section: liveData.student.section || 'N/A',
        academicYear: liveData.student.academicYear || 'N/A',
        branchKey: branchKey,
        subjectsCount: liveData.subjects.length
      };

      student.overall = liveData.overall;
      
      student.subjects = liveData.subjects.map((sub, index) => ({
        id: sub.code || index.toString(),
        name: sub.subject,
        code: sub.code,
        subject: sub.subject,
        attended: sub.attended || 0,
        recorded: sub.recorded || 0,
        percentage: sub.percentage || 0,
        status: sub.status || '',
        cie: sub.cie || [null, null, null],
      }));

      await student.save(); // Save fresh data to MongoDB
    } else {
      console.log(`Could not fetch live data for ${student.student.roll}. Using cached data.`);
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: student._id, roll: student.student.roll }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      success: true, 
      token, 
      student 
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ==========================================
// 2B. LOGIN WITH ENROLLMENT NUMBER ONLY
// Fetches live college data and auto-creates
// the account on first login if needed.
// ==========================================
router.post('/login-roll', async (req, res) => {
  try {
    const rawRoll = (req.body.roll || req.body.identifier || '').toString();
    const roll = rawRoll.toUpperCase().replace(/\s+/g, '').trim();

    if (!roll) {
      return res.status(400).json({ error: 'Please enter your enrollment number.' });
    }

    // Fetch live data first — this also validates the roll.
    const liveData = await fetchJECData(roll);
    const liveDataValid =
      liveData && liveData.student && liveData.overall && liveData.subjects;

    // If the college portal is slow or down, sign a previously verified
    // student in with the last saved record instead of blocking the app.
    if (!liveDataValid) {
      const cachedStudent = await findStudentByRoll(roll);
      if (cachedStudent) {
        const token = jwt.sign(
          { id: cachedStudent._id, roll: cachedStudent.student.roll },
          JWT_SECRET,
          { expiresIn: '30d' }
        );
        return res.status(200).json({
          success: true,
          isNewUser: false,
          cached: true,
          token,
          student: cachedStudent,
        });
      }
      return res.status(404).json({
        error:
          (liveData && liveData.error) ||
          'No student report found for this enrollment number.',
      });
    }

    // Find an existing account, otherwise auto-create one.
    let student = await findStudentByRoll(roll);
    let isNewUser = false;

    if (!student) {
      const randomPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

      student = new Student({
        email: `${roll.toLowerCase()}@student.jec.local`,
        password: randomPassword,
        student: {
          roll,
          name: liveData.student.name || 'Student',
          branch: liveData.student.branch || 'N/A',
          semester: liveData.student.semester || 1,
        },
        overall: { attended: 0, recorded: 0, status: 'Regular', percentage: 0 },
        subjects: [],
      });
      isNewUser = true;
    }

    // Refresh the record with the latest live college data.
    applyLiveData(student, liveData);
    await student.save();

    // Create JWT Token
    const token = jwt.sign(
      { id: student._id, roll: student.student.roll },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      isNewUser,
      token,
      student,
    });
  } catch (error) {
    console.error('Roll Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ==========================================
// 3. FORGOT PASSWORD (Simulated)
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    
    if (!student) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    res.status(200).json({ success: true, message: 'Password reset link sent to your email (simulated).' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ==========================================
// 4. UPDATE PUSH TOKEN
// ==========================================
router.post('/update-push-token', async (req, res) => {
  try {
    const { roll, pushToken } = req.body;
    if (!roll || !pushToken) return res.status(400).json({ error: 'Missing fields' });

    await Student.findOneAndUpdate(
      { 'student.roll': roll },
      { pushToken: pushToken }
    );

    res.status(200).json({ message: 'Push token updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;