#!/usr/bin/env node
/**
 * Seed student records used by the roll-only login fallback.
 *
 * When the college attendance portal has no report for the current academic
 * year (or is slow/down), /api/auth/login-roll signs a student in with their
 * last saved record — but only if that record already exists. This script
 * pre-populates those records so first-time logins work during that window.
 *
 * Usage:
 *   cp data/students.sample.json data/students.json   # then edit it
 *   npm run seed
 *   npm run seed -- /path/to/other-students.json      # custom input path
 *
 * The data file is gitignored because it contains real student information.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Student = require('../models/Student');

dotenv.config();

const DATA_FILE = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'data', 'students.json');

function branchKeyFor(branch = '') {
  if (branch.includes('Computer')) return 'CSE';
  if (branch.includes('Electronics')) return 'ETC';
  if (branch.includes('Mechanical')) return 'ME';
  if (branch.includes('Civil')) return 'CE';
  if (branch.includes('Instrumentation')) return 'IN';
  return 'OTHER';
}

function normalizeSubjects(subjects) {
  if (!Array.isArray(subjects)) return [];
  return subjects.map((subject, index) => ({
    id: subject.code || String(index),
    name: subject.name || subject.subject || 'Subject',
    code: subject.code || '',
    subject: subject.subject || subject.name || 'Subject',
    attended: Number(subject.attended) || 0,
    recorded: Number(subject.recorded) || 0,
    percentage: Number(subject.percentage) || 0,
    status: subject.status || '',
    cie: Array.isArray(subject.cie) ? subject.cie : [null, null, null],
  }));
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set. Copy jec-backend/.env.example to .env first.');
  }
  if (!fs.existsSync(DATA_FILE)) {
    throw new Error(
      `Seed data file not found: ${DATA_FILE}\n` +
        'Copy data/students.sample.json to data/students.json and fill it in.',
    );
  }

  const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const records = Array.isArray(parsed) ? parsed : parsed.students;
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('Seed data must be an array (or an object with a "students" array).');
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

  // Roll-only login never uses a password, but the schema requires one. Use a
  // random value so these accounts cannot be guessed through /api/auth/login.
  const password = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const record of records) {
    const roll = String(record.roll || '')
      .toUpperCase()
      .replace(/\s+/g, '')
      .trim();
    if (!roll) {
      console.warn('⚠️  Skipping record without a roll number:', record);
      skipped += 1;
      continue;
    }

    const branch = record.branch || 'N/A';
    const subjects = normalizeSubjects(record.subjects);
    const existing = await Student.findOne({ 'student.roll': roll }).collation({
      locale: 'en',
      strength: 2,
    });

    const update = {
      $set: {
        email: record.email
          ? String(record.email).toLowerCase().trim()
          : `${roll.toLowerCase()}@student.jec.local`,
        student: {
          roll,
          name: record.name || 'Student',
          branch,
          semester: Number(record.semester) || 1,
          section: record.section || 'N/A',
          academicYear: record.academicYear || 'N/A',
          branchKey: record.branchKey || branchKeyFor(branch),
          subjectsCount: Number(record.subjectsCount ?? subjects.length),
        },
        overall: {
          attended: 0,
          recorded: 0,
          status: 'Regular',
          percentage: 0,
          ...(record.overall || {}),
        },
        subjects,
        ...(existing ? {} : { password }),
      },
    };

    await Student.findOneAndUpdate({ 'student.roll': roll }, update, {
      upsert: true,
      returnDocument: 'after',
      runValidators: true,
      collation: { locale: 'en', strength: 2 },
    });

    if (existing) updated += 1;
    else created += 1;
    console.log(`   ${existing ? 'updated ' : 'created '} ${roll}`);
  }

  console.log(`\n✅ Seed complete: ${created} created, ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close().catch(() => {});
  });
