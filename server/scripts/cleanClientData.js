const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_project';
const COLLECTION = process.env.CLIENT_DATA_COLLECTION || 'client_data';

function isBlank(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '' || value.trim().toLowerCase() === 'nan';
  if (typeof value === 'number' && Number.isNaN(value)) return true;
  return false;
}

function excelSerialToDate(serial) {
  const n = Number(serial);
  if (!Number.isFinite(n) || n <= 0) return null;
  const ms = Math.round((n - 25569) * 86400 * 1000); // Excel serial to Unix epoch ms (UTC)
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection;
  const collection = db.collection(COLLECTION);

  const cursor = collection.find({}, { projection: { _id: 1, SaleDate: 1 } });
  const bulk = [];
  let processed = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const unset = {};
    const set = {};

    // Load full doc to inspect all keys
    const full = await collection.findOne({ _id: doc._id });
    for (const [key, value] of Object.entries(full)) {
      if (key === '_id') continue;
      if (key.startsWith('__EMPTY')) {
        unset[key] = '';
        continue;
      }
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '' || trimmed.toLowerCase() === 'nan') {
          unset[key] = '';
        } else if (trimmed !== value) {
          set[key] = trimmed;
        }
      } else if (isBlank(value)) {
        unset[key] = '';
      }
    }

    // Add normalized sale date
    if (full.SaleDate !== undefined && full.SaleDate !== null && full.SaleDate !== '') {
      const date = excelSerialToDate(full.SaleDate);
      if (date) set.SaleDateISO = date.toISOString();
    }

    if (Object.keys(unset).length || Object.keys(set).length) {
      bulk.push({ updateOne: { filter: { _id: doc._id }, update: { ...(Object.keys(set).length ? { $set: set } : {}), ...(Object.keys(unset).length ? { $unset: unset } : {}) } } });
    }

    if (bulk.length >= 500) {
      await collection.bulkWrite(bulk, { ordered: false });
      processed += bulk.length;
      console.log('Processed', processed, 'updates');
      bulk.length = 0;
    }
  }

  if (bulk.length) {
    await collection.bulkWrite(bulk, { ordered: false });
    processed += bulk.length;
  }

  console.log('Cleanup complete. Updated docs:', processed);
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch(async (err) => {
    console.error('Cleanup error:', err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  });
}


