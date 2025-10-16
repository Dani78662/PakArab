const mongoose = require('mongoose');

const caretakenDetailSchema = new mongoose.Schema({
  // Customer information
  mongoId: {
    type: String,
    trim: true
  },
  block: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    trim: true
  },
  billId: {
    type: String,
    required: true,
    trim: true
  },
  houseNo: {
    type: String,
    trim: true
  },
  
  // Billing information
  billingQuarter: {
    type: String,
    trim: true
  },
  issueDate: {
    type: String,
    trim: true
  },
  dueDate: {
    type: String,
    trim: true
  },
  
  // Charges information
  ctcCharges: {
    type: Number,
    default: 0
  },
  outstanding: {
    type: Number,
    default: 0
  },
  withinDue: {
    type: Number,
    default: 0
  },
  surcharge: {
    type: Number,
    default: 0
  },
  afterDue: {
    type: Number,
    default: 0
  },
  payableWithin: {
    type: Number,
    default: 0
  },
  payableAfter: {
    type: Number,
    default: 0
  },
  
  // Metadata
  formType: {
    type: String,
    default: 'caretaken_charges'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'caretaken_charges_form'
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CaretakenDetail', caretakenDetailSchema);
