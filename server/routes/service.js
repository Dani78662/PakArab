const express = require('express');
const { body, validationResult } = require('express-validator');
const ServiceBill = require('../models/ServiceBill');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Test route to verify mounting
router.get('/test', (req, res) => {
  res.json({ message: 'Service routes are working!' });
});

// Lookup by Customer ID (Editor2 and Admin)
router.get('/lookup/customer', [auth, authorize('editor2', 'admin')], async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ message: 'customerId query parameter is required' });
    }

    const bill = await ServiceBill.findOne({ customerId: customerId })
      .sort({ createdAt: -1 });

    if (!bill) {
      return res.status(404).json({ message: 'No records found for the provided customer ID' });
    }

    res.json({
      message: 'Record found',
      data: bill
    });
  } catch (error) {
    console.error('Lookup by customer ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service bill (Editor2 only)
router.post('/', [
  auth,
  authorize('editor2'),
  body('billTitle').notEmpty().withMessage('Bill title is required'),
  body('billType').isIn(['General Maintenance', 'Sewerage', 'Road Building', 'Other']).withMessage('Valid bill type is required'),
  body('billMonth').notEmpty().withMessage('Bill month is required'),
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('housePlotShopNo').notEmpty().withMessage('House/Plot/Shop number is required'),
  body('category').isIn(['Residential', 'Commercial', 'Industrial', 'Other']).withMessage('Valid category is required'),
  body('subtotal').isNumeric().withMessage('Subtotal must be a number'),
  body('totalCurrentBill').isNumeric().withMessage('Total current bill must be a number'),
  body('payableWithinDueDate').isNumeric().withMessage('Payable within due date must be a number'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required')
], async (req, res) => {
  try {
    console.log('Service bill creation request received:', req.body);
    console.log('User making request:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      billTitle,
      billType,
      billMonth,
      customerId,
      customerName,
      address,
      contactNumber,
      housePlotShopNo,
      category,
      subtotal,
      previousBalance,
      adjustments,
      totalCurrentBill,
      payableWithinDueDate,
      latePaymentSurcharge,
      payableAfterDueDate,
      issueDate,
      paymentDate
    } = req.body;

    const newServiceBill = new ServiceBill({
      billTitle,
      billType,
      billMonth,
      customerId,
      customerName,
      address,
      contactNumber,
      housePlotShopNo,
      category,
      subtotal,
      previousBalance: previousBalance || 0,
      adjustments: adjustments || 0,
      totalCurrentBill,
      payableWithinDueDate,
      latePaymentSurcharge: latePaymentSurcharge || 0,
      payableAfterDueDate: payableAfterDueDate || 0,
      issueDate,
      paymentDate: paymentDate || null,
      createdBy: req.user._id
    });

    const savedServiceBill = await newServiceBill.save();
    await savedServiceBill.populate('createdBy', 'username role');

    console.log('Service bill saved successfully:', savedServiceBill);
    res.status(201).json({
      message: 'Service bill created successfully',
      data: savedServiceBill
    });
  } catch (error) {
    console.error('Create service bill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all service bills (Admin only)
router.get('/admin/all', [auth, authorize('admin')], async (req, res) => {
  try {
    const serviceBills = await ServiceBill.find()
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Service bills retrieved successfully',
      data: serviceBills
    });
  } catch (error) {
    console.error('Get all service bills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search service bills (Admin only)
router.get('/admin/search', [auth, authorize('admin')], async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');
    const serviceBills = await ServiceBill.find({
      $or: [
        { billTitle: searchRegex },
        { billType: searchRegex },
        { billMonth: searchRegex },
        { customerId: searchRegex },
        { customerName: searchRegex },
        { contactNumber: searchRegex },
        { housePlotShopNo: searchRegex },
        { category: searchRegex }
      ]
    })
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Search completed successfully',
      data: serviceBills,
      query
    });
  } catch (error) {
    console.error('Search service bills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service bill by ID (Admin only)
router.get('/admin/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const serviceBill = await ServiceBill.findById(req.params.id)
      .populate('createdBy', 'username role');

    if (!serviceBill) {
      return res.status(404).json({ message: 'Service bill not found' });
    }

    res.json({
      message: 'Service bill retrieved successfully',
      data: serviceBill
    });
  } catch (error) {
    console.error('Get service bill by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service bills by user (Admin only)
router.get('/admin/user/:userId', [auth, authorize('admin')], async (req, res) => {
  try {
    const serviceBills = await ServiceBill.find({ createdBy: req.params.userId })
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    res.json({
      message: 'User service bills retrieved successfully',
      data: serviceBills
    });
  } catch (error) {
    console.error('Get user service bills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service bills statistics (Admin only)
router.get('/admin/stats', [auth, authorize('admin')], async (req, res) => {
  try {
    const totalServiceBills = await ServiceBill.countDocuments();
    const totalByType = await ServiceBill.aggregate([
      { $group: { _id: '$billType', count: { $sum: 1 } } }
    ]);
    const totalByCategory = await ServiceBill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const recentBills = await ServiceBill.find()
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      message: 'Service bills statistics retrieved successfully',
      data: {
        totalServiceBills,
        totalByType,
        totalByCategory,
        recentBills
      }
    });
  } catch (error) {
    console.error('Get service bills statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
