const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_project';

function normalizeValue(value) {
  // Convert undefined, null, empty string, and 'NaN'/'nan' to null
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed.toLowerCase() === 'nan') return null;
    return trimmed;
  }
  if (typeof value === 'number' && Number.isNaN(value)) return null;
  return value;
}

function normalizeRow(row) {
  const normalized = {};
  Object.keys(row).forEach((key) => {
    const cleanKey = String(key).trim();
    const rawVal = row[key];
    normalized[cleanKey] = normalizeValue(rawVal);
  });
  return normalized;
}

async function main() {
  try {
    const excelPathArg = process.argv[2] || path.join(__dirname, '..', 'client_data.xlsx');
    const excelPath = path.isAbsolute(excelPathArg)
      ? excelPathArg
      : path.join(process.cwd(), excelPathArg);

    if (!fs.existsSync(excelPath)) {
      console.error('Excel file not found at:', excelPath);
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection;
    const collectionName = process.env.CLIENT_DATA_COLLECTION || 'client_data';
    const collection = db.collection(collectionName);

    const workbook = XLSX.readFile(excelPath);
    const firstSheet = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheet];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null, blankrows: false });

    if (!rawRows.length) {
      console.error('No rows found in the Excel sheet.');
      process.exit(1);
    }

    const docs = rawRows.map(normalizeRow);

    // Remove completely empty objects (all values null)
    const filtered = docs.filter((doc) => Object.values(doc).some((v) => v !== null && v !== ''));

    if (!filtered.length) {
      console.error('All rows are empty after normalization.');
      process.exit(1);
    }

    const result = await collection.insertMany(filtered, { ordered: false });
    console.log(`Inserted ${result.insertedCount || filtered.length} documents into '${collectionName}'.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Import error:', err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}


