const express = require('express');
const mongoose = require('mongoose');
const { auth, authorize } = require('../middleware/auth');
const CaretakerDetails = require('../models/CaretakerDetails');
const CaretakenDetail = require('../models/CaretakenDetail');

const router = express.Router();

// Simple public test route to verify mounting
router.get('/test', (req, res) => {
  res.json({ ok: true, route: '/api/data/clientdata', message: 'clientdata routes are mounted' });
});

// Admin: list client_data with pagination and simple search
router.get('/admin/all', [auth, authorize('admin')], async (req, res) => {
  try {
    const { page = 1, limit = 50, query = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const collectionName = process.env.CLIENT_DATA_COLLECTION || 'client_data';
    const collection = mongoose.connection.collection(collectionName);

    const search = String(query || '').trim();
    const filter = search
      ? {
          $or: [
            { CustName: { $regex: search, $options: 'i' } },
            { AutoUnitNo: { $regex: search, $options: 'i' } },
            { Block: { $regex: search, $options: 'i' } },
            { Type: { $regex: search, $options: 'i' } },
            { Phase: { $regex: search, $options: 'i' } },
            { SaleNo: { $regex: search, $options: 'i' } },
          ]
        }
      : {};

    const cursor = collection
      .find(filter)
      .project({})
      .sort({ SaleDateISO: -1, _id: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const [items, total] = await Promise.all([
      cursor.toArray(),
      collection.countDocuments(filter)
    ]);

    res.json({
      message: 'Client data retrieved successfully',
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    console.error('Admin list client_data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save caretaker charges data to caretaken detail collection (care_service role)
router.post('/caretaker-charges', [auth, authorize('care_service')], async (req, res) => {
  try {
    const {
      mongoId, block, customerName, size, billId, houseNo,
      billingQuarter, issueDate, dueDate,
      ctcCharges, outstanding, withinDue, surcharge, afterDue,
      payableWithin, payableAfter, submittedAt, formType
    } = req.body;

    // Basic validation
    if (!customerName || !billId || !block) {
      return res.status(400).json({ 
        message: 'Required fields missing: Customer Name, Bill ID, and Block are required' 
      });
    }

    // Create new caretaken detail record
    const caretakenDetail = new CaretakenDetail({
      mongoId,
      block,
      customerName,
      size,
      billId,
      houseNo,
      billingQuarter,
      issueDate,
      dueDate,
      ctcCharges: parseFloat(ctcCharges) || 0,
      outstanding: parseFloat(outstanding) || 0,
      withinDue: parseFloat(withinDue) || 0,
      surcharge: parseFloat(surcharge) || 0,
      afterDue: parseFloat(afterDue) || 0,
      payableWithin: parseFloat(payableWithin) || 0,
      payableAfter: parseFloat(payableAfter) || 0,
      submittedAt: submittedAt || new Date(),
      formType: formType || 'caretaken_charges',
      submittedBy: req.user._id
    });

    const savedDetails = await caretakenDetail.save();

    res.json({
      message: 'Caretaker charges data saved successfully',
      data: {
        _id: savedDetails._id,
        customerName: savedDetails.customerName,
        billId: savedDetails.billId,
        block: savedDetails.block
      }
    });
  } catch (error) {
    console.error('Save caretaker charges error:', error);
    res.status(500).json({ 
      message: 'Server error while saving caretaker charges data',
      error: error.message 
    });
  }
});

// Get caretaken details for care_service user
router.get('/caretaken-details/my', [auth, authorize('care_service')], async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const searchFilter = {
      submittedBy: req.user._id,
      ...(search ? {
        $or: [
          { customerName: { $regex: search, $options: 'i' } },
          { billId: { $regex: search, $options: 'i' } },
          { block: { $regex: search, $options: 'i' } },
          { houseNo: { $regex: search, $options: 'i' } }
        ]
      } : {})
    };

    const [caretakenDetails, total] = await Promise.all([
      CaretakenDetail.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      CaretakenDetail.countDocuments(searchFilter)
    ]);

    res.json({
      message: 'Your caretaken details retrieved successfully',
      data: caretakenDetails,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get caretaken details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all caretaker details (Admin only)
router.get('/caretaker-details', [auth, authorize('admin')], async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const searchFilter = search
      ? {
          $or: [
            { customerName: { $regex: search, $options: 'i' } },
            { billId: { $regex: search, $options: 'i' } },
            { block: { $regex: search, $options: 'i' } },
            { houseNo: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [caretakerDetails, total] = await Promise.all([
      CaretakerDetails.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      CaretakerDetails.countDocuments(searchFilter)
    ]);

    res.json({
      message: 'Caretaker details retrieved successfully',
      data: caretakerDetails,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get caretaker details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public listing endpoint (temporary): returns first page without auth
router.get('/public/all', async (req, res) => {
  try {
    const { page = 1, limit = 50, query = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const collectionName = process.env.CLIENT_DATA_COLLECTION || 'client_data';
    const collection = mongoose.connection.collection(collectionName);

    const search = String(query || '').trim();
    const filter = search
      ? {
          $or: [
            { CustName: { $regex: search, $options: 'i' } },
            { AutoUnitNo: { $regex: search, $options: 'i' } },
            { Block: { $regex: search, $options: 'i' } },
            { Type: { $regex: search, $options: 'i' } },
            { Phase: { $regex: search, $options: 'i' } },
            { SaleNo: { $regex: search, $options: 'i' } },
          ]
        }
      : {};

    const cursor = collection
      .find(filter)
      .sort({ SaleDateISO: -1, _id: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const [items, total] = await Promise.all([
      cursor.toArray(),
      collection.countDocuments(filter)
    ]);

    res.json({
      message: 'Client data (public) retrieved successfully',
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    console.error('Public list client_data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
