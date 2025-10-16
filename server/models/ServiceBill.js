const mongoose = require('mongoose');

const serviceBillSchema = new mongoose.Schema({
  // Header Section
  billTitle: {
    type: String,
    required: true,
    trim: true
  },
  billType: {
    type: String,
    required: true,
    enum: ['General Maintenance', 'Sewerage', 'Road Building', 'Other'],
    trim: true
  },
  billMonth: {
    type: String,
    required: true,
    trim: true
  },
  
  // Customer Information
  customerId: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  housePlotShopNo: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Residential', 'Commercial', 'Industrial', 'Other'],
    trim: true
  },
  
  // Billing Information
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  previousBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  adjustments: {
    type: Number,
    default: 0
  },
  totalCurrentBill: {
    type: Number,
    required: true,
    min: 0
  },
  payableWithinDueDate: {
    type: Number,
    required: true,
    min: 0
  },
  latePaymentSurcharge: {
    type: Number,
    default: 0,
    min: 0
  },
  payableAfterDueDate: {
    type: Number,
    default: 0,
    min: 0
  },
  issueDate: {
    type: Date,
    required: true
  },
  paymentDate: {
    type: Date
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceBill', serviceBillSchema);
