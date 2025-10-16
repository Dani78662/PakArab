const mongoose = require('mongoose');

// Flexible schema to match uploaded salesdata collection
const SalesDataSchema = new mongoose.Schema({}, { strict: false, collection: 'salesdata' });

// Helpful index for Sr__No lookups if present
SalesDataSchema.index({ 'Sr__No': 1 });

module.exports = mongoose.model('SalesData', SalesDataSchema);


