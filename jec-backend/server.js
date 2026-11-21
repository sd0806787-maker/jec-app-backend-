/* ==========================================================================
 *  server.js
 *  Express 5 + Mongoose 9 backend
 * ========================================================================== */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const os = require('os');

/* -------------------------------------------------------------------------- */
/*  ENV                                                                       */
/* -------------------------------------------------------------------------- */
dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jec_student_db';
const BODY_LIMIT = process.env.BODY_LIMIT || '25mb';

/* -------------------------------------------------------------------------- */
/*  APP                                                                       */
/* -------------------------------------------------------------------------- */
const app = express();

/* ------------------------------ CORS ------------------------------------- */
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  }),
);

/* ---------------------------- BODY PARSERS ------------------------------- */
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ limit: BODY_LIMIT, extended: true }));

/* ---------------------------- STATIC FILES ------------------------------- */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

/* ---------------------------- REQUEST LOG -------------------------------- */
app.use((req, _res, next) => {
  const size = req.headers['content-length']
    ? `${Math.round(Number(req.headers['content-length']) / 1024)} KB`
    : 'no-body';
  console.log(`→ ${req.method} ${req.originalUrl} (${size})`);
  next();
});

/* -------------------------------------------------------------------------- */
/*  ROUTES — load defensively so a broken file doesn't crash startup          */
/* -------------------------------------------------------------------------- */
function safeRequire(label, modulePath) {
  try {
    const mod = require(modulePath);
    if (!mod || typeof mod !== 'function') {
      throw new Error('Module did not export a valid Express Router (is it undefined?)');
    }
    console.log(`✅ Loaded ${label}`);
    return mod;
  } catch (err) {
    console.error(`❌ Failed to load ${label} (${modulePath}):`, err.message);
    return null;
  }
}

const authRoutes = safeRequire('routes/auth', './routes/auth');
const issueRoutes = safeRequire('routes/issues', './routes/issues');
const lostFoundRoutes = safeRequire('routes/lostfound', './routes/lostfound');
const medicalRoutes = safeRequire('routes/medical', './routes/medical');
const apiRoutes = safeRequire('routes/api', './routes/api');

/* ---------------------------- HEALTH CHECK ------------------------------- */
app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'jec-backend',
    express: require('express/package.json').version,
    mongoose: require('mongoose/package.json').version,
    routes: {
      auth: '/api/auth',
      issues: '/api/issues',
      lostfound: '/api/lostfound',
      medical: '/api/medical',
      api: '/api',
    },
  });
});

/* ---------------------------- MOUNT ROUTERS ------------------------------ */
if (authRoutes) app.use('/api/auth', authRoutes);
if (issueRoutes) app.use('/api/issues', issueRoutes);
if (lostFoundRoutes) app.use('/api/lostfound', lostFoundRoutes);
if (medicalRoutes) app.use('/api/medical', medicalRoutes);
if (apiRoutes) app.use('/api', apiRoutes);

/* -------------------------------------------------------------------------- */
/*  404 + ERROR HANDLERS                                                      */
/* -------------------------------------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, _next) => {
  console.error('💥 Unhandled error:', err.message);

  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      message: `Payload too large. Max ${BODY_LIMIT}. Compress the image and retry.`,
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body.',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.fromEntries(
        Object.entries(err.errors || {}).map(([k, v]) => [k, v.message]),
      ),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}: ${err.value}`,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

/* -------------------------------------------------------------------------- */
/*  STARTUP                                                                   */
/* -------------------------------------------------------------------------- */
async function start() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ MongoDB connected:', mongoose.connection.name);

    const server = app.listen(PORT, '0.0.0.0', () => {
      const lan = Object.values(os.networkInterfaces())
        .flat()
        .find((n) => n && n.family === 'IPv4' && !n.internal)?.address;

      console.log('====================================');
      console.log(`✅ Backend running on port ${PORT}`);
      console.log(`   Local:      http://localhost:${PORT}`);
      if (lan) console.log(`   LAN:        http://${lan}:${PORT}`);
      console.log(`   Body limit: ${BODY_LIMIT}`);
      console.log('====================================');
    });

    const shutdown = (sig) => {
      console.log(`\n${sig} received — shutting down...`);
      server.close(async () => {
        try {
          await mongoose.connection.close();
        } catch {}
        process.exit(0);
      });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('❌ Startup failed:', err.message);
    process.exit(1);
  }
}

start();