const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    trim: true
  },
  payproId: {
    type: String,
    required: true,
    trim: true
  },
  billMonth: {
    type: String,
    required: true,
    trim: true
  },
  readingDate: {
    type: Date,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  nameAndAddress: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  previousReading: {
    type: Number,
    required: true
  },
  presentReading: {
    type: Number,
    required: true
  },
  unitConsumed: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  fpa: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  },
  retailTax: {
    type: Number,
    required: true
  },
  incomeTax: {
    type: Number,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Data', dataSchema);
