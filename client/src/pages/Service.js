import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Service = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    // Header Section
    billTitle: '',
    billType: '',
    billMonth: '',
    
    // Customer Information
    customerId: '',
    customerName: '',
    address: '',
    contactNumber: '',
    housePlotShopNo: '',
    category: '',
    
    // Billing Information
    subtotal: '',
    previousBalance: '',
    adjustments: '',
    totalCurrentBill: '',
    payableWithinDueDate: '',
    latePaymentSurcharge: '',
    payableAfterDueDate: '',
    issueDate: '',
    paymentDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear messages when user starts typing
    if (success || error) {
      setSuccess('');
      setError('');
    }
  };

  const handleCustomerLookup = async () => {
    const customerId = (formData.customerId || '').trim();
    if (!customerId) return;
    try {
      setLookupLoading(true);
      setError('');
      const res = await axios.get('/api/data/service/lookup/customer', {
        params: { customerId }
      });
      const d = res.data?.data || {};
      setFormData(prev => ({
        ...prev,
        customerName: d.customerName || prev.customerName,
        address: d.address || prev.address,
        contactNumber: d.contactNumber || prev.contactNumber,
        housePlotShopNo: d.housePlotShopNo || prev.housePlotShopNo,
        category: d.category || prev.category
      }));
      setSuccess('Details autofilled from previous record.');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No existing record found for this customer ID.');
      } else {
        setError(err.response?.data?.message || 'Failed to lookup customer ID');
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      billTitle: '',
      billType: '',
      billMonth: '',
      customerId: '',
      customerName: '',
      address: '',
      contactNumber: '',
      housePlotShopNo: '',
      category: '',
      subtotal: '',
      previousBalance: '',
      adjustments: '',
      totalCurrentBill: '',
      payableWithinDueDate: '',
      latePaymentSurcharge: '',
      payableAfterDueDate: '',
      issueDate: '',
      paymentDate: ''
    });
    setSuccess('');
    setError('');
    setShowReview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = [
      'billTitle', 'billType', 'billMonth', 'customerId', 'customerName', 
      'address', 'contactNumber', 'housePlotShopNo', 'category', 'subtotal',
      'totalCurrentBill', 'payableWithinDueDate', 'issueDate'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    // Numeric validation
    const numericFields = ['subtotal', 'previousBalance', 'adjustments', 'totalCurrentBill', 
                          'payableWithinDueDate', 'latePaymentSurcharge', 'payableAfterDueDate'];
    for (const field of numericFields) {
      if (formData[field] && (isNaN(formData[field]) || formData[field] < 0)) {
        setError(`${field} must be a valid positive number`);
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting service bill data:', formData);
      const response = await axios.post('/api/data/service', formData);
      console.log('Service bill created successfully:', response.data);
      setSuccess('Service bill created successfully!');
      setShowBillPreview(true); // Show bill preview after successful submission
      // Don't reset form immediately, let user see the bill first
    } catch (error) {
      console.error('Create service bill error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || 'Failed to create service bill';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Service Bill Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create Service Bill Entry
                </h2>
                <p className="text-gray-600">
                  Fill out the form below to add new service bill data to the system.
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Quick Lookup by Customer ID */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lookup by Customer ID</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label htmlFor="customerId_lookup" className="block text-sm font-medium text-gray-700 mb-1">
                        Customer ID / Account No.
                      </label>
                      <input
                        type="text"
                        id="customerId_lookup"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
                        onBlur={handleCustomerLookup}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter customer ID to autofill"
                        disabled={loading || lookupLoading}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleCustomerLookup}
                        disabled={loading || lookupLoading || !formData.customerId}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {lookupLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Looking up...
                          </>
                        ) : (
                          'Autofill'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Header Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Header Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Bill Title */}
                    <div>
                      <label htmlFor="billTitle" className="block text-sm font-medium text-gray-700 mb-1">
                        Bill Title *
                      </label>
                      <input
                        type="text"
                        id="billTitle"
                        name="billTitle"
                        value={formData.billTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Service Bill"
                        disabled={loading}
                      />
                    </div>

                    {/* Bill Type */}
                    <div>
                      <label htmlFor="billType" className="block text-sm font-medium text-gray-700 mb-1">
                        Bill Type *
                      </label>
                      <select
                        id="billType"
                        name="billType"
                        value={formData.billType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="">Select Bill Type</option>
                        <option value="General Maintenance">General Maintenance</option>
                        <option value="Sewerage">Sewerage</option>
                        <option value="Road Building">Road Building</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Bill Month */}
                    <div>
                      <label htmlFor="billMonth" className="block text-sm font-medium text-gray-700 mb-1">
                        Bill Month / Period *
                      </label>
                      <input
                        type="text"
                        id="billMonth"
                        name="billMonth"
                        value={formData.billMonth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., January 2024"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Customer Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer ID */}
                    <div>
                      <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                        Customer ID / Account No. *
                      </label>
                      <input
                        type="text"
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter customer ID"
                        disabled={loading}
                      />
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter customer name"
                        disabled={loading}
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number / Mobile No. *
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter contact number"
                        disabled={loading}
                      />
                    </div>

                    {/* House/Plot/Shop No */}
                    <div>
                      <label htmlFor="housePlotShopNo" className="block text-sm font-medium text-gray-700 mb-1">
                        House / Plot / Shop No. *
                      </label>
                      <input
                        type="text"
                        id="housePlotShopNo"
                        name="housePlotShopNo"
                        value={formData.housePlotShopNo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter house/plot/shop number"
                        disabled={loading}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category / Type *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter customer full address"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Billing Information Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Subtotal */}
                    <div>
                      <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 mb-1">
                        Subtotal *
                      </label>
                      <input
                        type="number"
                        id="subtotal"
                        name="subtotal"
                        value={formData.subtotal}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter subtotal amount"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Previous Balance */}
                    <div>
                      <label htmlFor="previousBalance" className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Balance
                      </label>
                      <input
                        type="number"
                        id="previousBalance"
                        name="previousBalance"
                        value={formData.previousBalance}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter previous balance"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Adjustments */}
                    <div>
                      <label htmlFor="adjustments" className="block text-sm font-medium text-gray-700 mb-1">
                        Adjustments (if any)
                      </label>
                      <input
                        type="number"
                        id="adjustments"
                        name="adjustments"
                        value={formData.adjustments}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter adjustments"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Total Current Bill */}
                    <div>
                      <label htmlFor="totalCurrentBill" className="block text-sm font-medium text-gray-700 mb-1">
                        Total Current Bill *
                      </label>
                      <input
                        type="number"
                        id="totalCurrentBill"
                        name="totalCurrentBill"
                        value={formData.totalCurrentBill}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter total current bill"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Payable Within Due Date */}
                    <div>
                      <label htmlFor="payableWithinDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Payable Within Due Date *
                      </label>
                      <input
                        type="number"
                        id="payableWithinDueDate"
                        name="payableWithinDueDate"
                        value={formData.payableWithinDueDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter amount payable within due date"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Late Payment Surcharge */}
                    <div>
                      <label htmlFor="latePaymentSurcharge" className="block text-sm font-medium text-gray-700 mb-1">
                        Late Payment Surcharge (L.P. Surcharge)
                      </label>
                      <input
                        type="number"
                        id="latePaymentSurcharge"
                        name="latePaymentSurcharge"
                        value={formData.latePaymentSurcharge}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter late payment surcharge"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Payable After Due Date */}
                    <div>
                      <label htmlFor="payableAfterDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Payable After Due Date
                      </label>
                      <input
                        type="number"
                        id="payableAfterDueDate"
                        name="payableAfterDueDate"
                        value={formData.payableAfterDueDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter amount payable after due date"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Issue Date */}
                    <div>
                      <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        id="issueDate"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    {/* Payment Date */}
                    <div>
                      <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Date (for office copy)
                      </label>
                      <input
                        type="date"
                        id="paymentDate"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-800">{success}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReview(true)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Review Form
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Service Entry'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Service Bill Visibility
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Once you create a service bill entry, it will be immediately visible to authorized users 
                    in their dashboard. They can search and view all the service bills you create.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Review Service Bill Information</h3>
                <button
                  onClick={() => setShowReview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Header Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Bill Header Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Bill Title:</span> {formData.billTitle || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Bill Type:</span> {formData.billType || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Bill Month:</span> {formData.billMonth || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Customer ID:</span> {formData.customerId || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Customer Name:</span> {formData.customerName || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Contact Number:</span> {formData.contactNumber || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">House/Plot/Shop No:</span> {formData.housePlotShopNo || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {formData.category || 'Not provided'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Address:</span>
                      <p className="mt-1 text-gray-700 whitespace-pre-line">{formData.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Billing Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Billing Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Subtotal:</span> ${formData.subtotal || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Previous Balance:</span> ${formData.previousBalance || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Adjustments:</span> ${formData.adjustments || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Total Current Bill:</span> ${formData.totalCurrentBill || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Payable Within Due Date:</span> ${formData.payableWithinDueDate || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Late Payment Surcharge:</span> ${formData.latePaymentSurcharge || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Payable After Due Date:</span> ${formData.payableAfterDueDate || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Issue Date:</span> {formData.issueDate || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Payment Date:</span> {formData.paymentDate || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReview(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowReview(false);
                    // You can add logic here to auto-fill or validate the form
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Looks Good
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Service Bill Preview</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Print Bill
                  </button>
                  <button
                    onClick={() => {
                      setShowBillPreview(false);
                      resetForm(); // Reset form after closing bill preview
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              {/* Bill Content */}
              <div className="bg-white border-2 border-gray-300 p-8 print:border-0 print:shadow-none" id="bill-content">
                {/* Company Header */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">PAK UTILITIES & SERVICES</h1>
                  <p className="text-lg text-gray-700 mb-1">Service Bill Management System</p>
                  <p className="text-sm text-gray-600">123 Main Street, City, State 12345 | Phone: (555) 123-4567</p>
                  <p className="text-sm text-gray-600">Email: info@pakutilities.com | Website: www.pakutilities.com</p>
                </div>

                {/* Bill Information */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.billTitle || 'Service Bill'}</h2>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Bill Type:</span> {formData.billType}</p>
                      <p><span className="font-semibold">Bill Period:</span> {formData.billMonth}</p>
                      <p><span className="font-semibold">Issue Date:</span> {formData.issueDate ? new Date(formData.issueDate).toLocaleDateString() : 'N/A'}</p>
                      {formData.paymentDate && (
                        <p><span className="font-semibold">Payment Date:</span> {new Date(formData.paymentDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Bill Number</p>
                      <p className="text-lg font-bold text-gray-900">SB-{Date.now().toString().slice(-6)}</p>
                      <p className="text-sm text-gray-600 mt-2">Generated: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p><span className="font-semibold">Customer ID:</span> {formData.customerId}</p>
                      <p><span className="font-semibold">Name:</span> {formData.customerName}</p>
                      <p><span className="font-semibold">Contact:</span> {formData.contactNumber}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Property:</span> {formData.housePlotShopNo}</p>
                      <p><span className="font-semibold">Category:</span> {formData.category}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p><span className="font-semibold">Address:</span></p>
                    <p className="text-gray-700 whitespace-pre-line">{formData.address}</p>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Billing Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Amount ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Subtotal</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.subtotal || 0).toFixed(2)}</td>
                        </tr>
                        {formData.previousBalance && parseFloat(formData.previousBalance) > 0 && (
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Previous Balance</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.previousBalance).toFixed(2)}</td>
                          </tr>
                        )}
                        {formData.adjustments && parseFloat(formData.adjustments) !== 0 && (
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Adjustments</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.adjustments).toFixed(2)}</td>
                          </tr>
                        )}
                        <tr className="bg-gray-50 font-semibold">
                          <td className="border border-gray-300 px-4 py-2">Total Current Bill</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.totalCurrentBill || 0).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Payable Within Due Date</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.payableWithinDueDate || 0).toFixed(2)}</td>
                        </tr>
                        {formData.latePaymentSurcharge && parseFloat(formData.latePaymentSurcharge) > 0 && (
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Late Payment Surcharge</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.latePaymentSurcharge).toFixed(2)}</td>
                          </tr>
                        )}
                        {formData.payableAfterDueDate && parseFloat(formData.payableAfterDueDate) > 0 && (
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">Payable After Due Date</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{parseFloat(formData.payableAfterDueDate).toFixed(2)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Payment Information</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Payment Methods:</span> Cash, Check, Credit Card, Online Transfer
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Office Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Contact:</span> For payment inquiries, call (555) 123-4567
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
                  <p>Thank you for choosing PAK Utilities & Services</p>
                  <p>This is a computer-generated bill. No signature required.</p>
                  <p>Generated on: {new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;


