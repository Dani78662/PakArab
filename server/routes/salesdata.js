const express = require('express');
const SalesData = require('../models/SalesData');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Lookup by Serial Number (Sr__No)
router.get('/lookup', async (req, res) => {
  try {
    const { srNo } = req.query;
    if (!srNo) return res.status(400).json({ message: 'srNo query parameter is required' });

    const srString = String(srNo).trim();
    const srNumber = Number.isFinite(Number(srString)) ? Number(srString) : null;

    // Try different field names to be safe, as string and number
    const orConds = [
      { 'Sr__No': srString },
      { 'Sr__No.': srString },
      { 'SR__NO': srString },
      { 'SrNo': srString },
      { 'srNo': srString }
    ];
    if (srNumber !== null) {
      orConds.push(
        { 'Sr__No': srNumber },
        { 'Sr__No.': srNumber },
        { 'SR__NO': srNumber },
        { 'SrNo': srNumber },
        { 'srNo': srNumber }
      );
    }

    const record = await SalesData.findOne({ $or: orConds }).lean();

    if (!record) return res.status(404).json({ message: 'No record found for provided serial number' });

    res.json({ message: 'Record found', data: record });
  } catch (error) {
    console.error('Salesdata lookup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Lookup by Mongo Document _id
router.get('/by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'id parameter is required' });
    const record = await SalesData.findById(id).lean();
    if (!record) return res.status(404).json({ message: 'No record found for provided id' });
    res.json({ message: 'Record found', data: record });
  } catch (error) {
    console.error('Salesdata lookup by id error:', error);
    if (String(error?.name) === 'CastError') {
      return res.status(400).json({ message: 'Invalid Mongo id format' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list SalesData with pagination and simple search
router.get('/admin/all', [auth, authorize('admin')], async (req, res) => {
  try {
    const { page = 1, limit = 50, query = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const search = String(query || '').trim();
    const filterForSales = search
      ? {
          $or: [
            { customerId: new RegExp(search, 'i') },
            { nameAndAddress: new RegExp(search, 'i') },
            { billMonth: new RegExp(search, 'i') },
            { payproId: new RegExp(search, 'i') },
          ]
        }
      : {};

    // If CLIENT_DATA_COLLECTION exists, read from that collection to mirror client data
    const clientCollectionName = process.env.CLIENT_DATA_COLLECTION || 'client_data';
    const clientCollection = require('mongoose').connection.collection(clientCollectionName);

    // Build filter for client_data format
    const filterForClient = search
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

    // Prefer client_data if it has documents; otherwise fallback to SalesData model
    const clientTotal = await clientCollection.countDocuments({});
    if (clientTotal > 0) {
      const cursor = clientCollection
        .find(filterForClient)
        .sort({ SaleDateISO: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
      const [items, total] = await Promise.all([
        cursor.toArray(),
        clientCollection.countDocuments(filterForClient),
      ]);
      return res.json({
        message: 'Client data (via salesdata endpoint) retrieved successfully',
        data: items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        }
      });
    }

    // Fallback to SalesData model
    const [items, total] = await Promise.all([
      SalesData.find(filterForSales)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      SalesData.countDocuments(filterForSales),
    ]);

    res.json({
      message: 'Sales data retrieved successfully',
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      }
    });
  } catch (error) {
    console.error('Admin list salesdata error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: basic stats for overview
router.get('/admin/stats', [auth, authorize('admin')], async (req, res) => {
  try {
    const totalSalesData = await SalesData.countDocuments();
    const recent = await SalesData.find().sort({ createdAt: -1 }).limit(5).lean();
    res.json({ message: 'Salesdata stats retrieved', data: { totalSalesData, recent } });
  } catch (error) {
    console.error('Admin salesdata stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


