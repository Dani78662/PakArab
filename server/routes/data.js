const express = require('express');
const { body, validationResult } = require('express-validator');
const Data = require('../models/Data');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create data (Editor only)
router.post('/create', [
  auth,
  authorize('editor'),
  upload.single('image'), // Handle single image upload
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('payproId').notEmpty().withMessage('Paypro ID is required'),
  body('billMonth').notEmpty().withMessage('Bill month is required'),
  body('readingDate').isISO8601().withMessage('Valid reading date is required'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('nameAndAddress').notEmpty().withMessage('Name and Address is required'),
  body('mobile').notEmpty().withMessage('Mobile is required'),
  body('previousReading').isNumeric().withMessage('Previous reading must be a number'),
  body('presentReading').isNumeric().withMessage('Present reading must be a number'),
  body('unitConsumed').isNumeric().withMessage('Unit consumed must be a number'),
  body('totalCost').isNumeric().withMessage('Total cost must be a number'),
  body('fpa').isNumeric().withMessage('FPA must be a number'),
  body('gst').isNumeric().withMessage('GST must be a number'),
  body('retailTax').isNumeric().withMessage('Retail tax must be a number'),
  body('incomeTax').isNumeric().withMessage('Income tax must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerId,
      payproId,
      billMonth,
      readingDate,
      issueDate,
      dueDate,
      nameAndAddress,
      mobile,
      previousReading,
      presentReading,
      unitConsumed,
      totalCost,
      fpa,
      gst,
      retailTax,
      incomeTax
    } = req.body;

    // Handle image upload
    let imageData = null;
    if (req.file) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const newData = new Data({
      customerId,
      payproId,
      billMonth,
      readingDate,
      issueDate,
      dueDate,
      nameAndAddress,
      mobile,
      previousReading,
      presentReading,
      unitConsumed,
      totalCost,
      fpa,
      gst,
      retailTax,
      incomeTax,
      image: imageData,
      createdBy: req.user._id
    });

    const savedData = await newData.save();
    await savedData.populate('createdBy', 'username role');

    res.status(201).json({
      message: 'Data created successfully',
      data: savedData
    });
  } catch (error) {
    console.error('Create data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all data (Ramzin only)
router.get('/list', [auth, authorize('ramzin')], async (req, res) => {
  try {
    const data = await Data.find()
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    // Add image indicator to each item
    const dataWithImageInfo = data.map(item => ({
      ...item.toObject(),
      hasImage: !!(item.image && item.image.data)
    }));

    res.json({
      message: 'Data retrieved successfully',
      data: dataWithImageInfo
    });
  } catch (error) {
    console.error('Get data list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search data (Ramzin only)
router.get('/search', [auth, authorize('ramzin')], async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');
    const data = await Data.find({
      $or: [
        { customerId: searchRegex },
        { payproId: searchRegex },
        { billMonth: searchRegex },
        { nameAndAddress: searchRegex },
        { mobile: searchRegex }
      ]
    })
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });

    // Add image indicator to each item
    const dataWithImageInfo = data.map(item => ({
      ...item.toObject(),
      hasImage: !!(item.image && item.image.data)
    }));

    res.json({
      message: 'Search completed successfully',
      data: dataWithImageInfo,
      query
    });
  } catch (error) {
    console.error('Search data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get data by ID (Ramzin only)
router.get('/:id', [auth, authorize('ramzin')], async (req, res) => {
  try {
    const data = await Data.findById(req.params.id)
      .populate('createdBy', 'username role');

    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    res.json({
      message: 'Data retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Get data by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get image by data ID (Public route for image display)
router.get('/:id/image', async (req, res) => {
  try {
    console.log('Image request for ID:', req.params.id);
    const data = await Data.findById(req.params.id);

    if (!data) {
      console.log('Data not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Data not found' });
    }

    if (!data.image || !data.image.data) {
      console.log('Image not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Image not found' });
    }

    console.log('Serving image for ID:', req.params.id, 'Content-Type:', data.image.contentType);
    res.set('Content-Type', data.image.contentType);
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(data.image.data);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
