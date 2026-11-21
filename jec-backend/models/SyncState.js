const mongoose = require('mongoose');

/**
 * Tiny key/value store for background-worker state. The announcement watcher
 * uses it to remember which announcement ids it has already notified about.
 */
const syncStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SyncState', syncStateSchema);
