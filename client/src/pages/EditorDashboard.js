import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditorDashboard = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    customerId: '',
    payproId: '',
    billMonth: '',
    readingDate: '',
    issueDate: '',
    dueDate: '',
    nameAndAddress: '',
    mobile: '',
    previousReading: '',
    presentReading: '',
    unitConsumed: '',
    totalCost: '',
    fpa: '',
    gst: '',
    retailTax: '',
    incomeTax: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setError('');
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      payproId: '',
      billMonth: '',
      readingDate: '',
      issueDate: '',
      dueDate: '',
      nameAndAddress: '',
      mobile: '',
      previousReading: '',
      presentReading: '',
      unitConsumed: '',
      totalCost: '',
      fpa: '',
      gst: '',
      retailTax: '',
      incomeTax: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setSuccess('');
    setError('');
    setShowReview(false);
    
    // Clear the file input field
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = [
      'customerId', 'payproId', 'billMonth', 'readingDate', 'issueDate', 'dueDate',
      'nameAndAddress', 'mobile', 'previousReading', 'presentReading', 'unitConsumed',
      'totalCost', 'fpa', 'gst', 'retailTax', 'incomeTax'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    // Numeric validation
    const numericFields = ['previousReading', 'presentReading', 'unitConsumed', 'totalCost', 'fpa', 'gst', 'retailTax', 'incomeTax'];
    for (const field of numericFields) {
      if (isNaN(formData[field]) || formData[field] < 0) {
        setError(`${field} must be a valid positive number`);
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append image if selected
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      const response = await axios.post('/api/data/create', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Bill data created successfully!');
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create bill data';
      setError(errorMessage);
      console.error('Create data error:', error);
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
                Editor Dashboard
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
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Create New Bill Entry
                </h2>
                <p className="text-gray-600">
                  Fill out the form below to add new utility bill data to the system.
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer ID */}
                    <div>
                      <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                        Customer ID *
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

                    {/* Paypro ID */}
                    <div>
                      <label htmlFor="payproId" className="block text-sm font-medium text-gray-700 mb-1">
                        Paypro ID *
                      </label>
                      <input
                        type="text"
                        id="payproId"
                        name="payproId"
                        value={formData.payproId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter Paypro ID"
                        disabled={loading}
                      />
                    </div>

                    {/* Bill Month */}
                    <div>
                      <label htmlFor="billMonth" className="block text-sm font-medium text-gray-700 mb-1">
                        Bill Month *
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

                    {/* Mobile */}
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile *
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter mobile number"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Name and Address */}
                  <div className="mt-4">
                    <label htmlFor="nameAndAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Name and Address *
                    </label>
                    <textarea
                      id="nameAndAddress"
                      name="nameAndAddress"
                      rows={3}
                      value={formData.nameAndAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter customer name and full address"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Date Information Section */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Reading Date */}
                    <div>
                      <label htmlFor="readingDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Reading Date *
                      </label>
                      <input
                        type="date"
                        id="readingDate"
                        name="readingDate"
                        value={formData.readingDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

                    {/* Due Date */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Reading Information Section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reading Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Previous Reading */}
                    <div>
                      <label htmlFor="previousReading" className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Reading *
                      </label>
                      <input
                        type="number"
                        id="previousReading"
                        name="previousReading"
                        value={formData.previousReading}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter previous reading"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Present Reading */}
                    <div>
                      <label htmlFor="presentReading" className="block text-sm font-medium text-gray-700 mb-1">
                        Present Reading *
                      </label>
                      <input
                        type="number"
                        id="presentReading"
                        name="presentReading"
                        value={formData.presentReading}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter present reading"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Unit Consumed */}
                    <div>
                      <label htmlFor="unitConsumed" className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Consumed *
                      </label>
                      <input
                        type="number"
                        id="unitConsumed"
                        name="unitConsumed"
                        value={formData.unitConsumed}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter units consumed"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Information Section */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Total Cost */}
                    <div>
                      <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-1">
                        Total Cost *
                      </label>
                      <input
                        type="number"
                        id="totalCost"
                        name="totalCost"
                        value={formData.totalCost}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter total cost"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* FPA */}
                    <div>
                      <label htmlFor="fpa" className="block text-sm font-medium text-gray-700 mb-1">
                        FPA *
                      </label>
                      <input
                        type="number"
                        id="fpa"
                        name="fpa"
                        value={formData.fpa}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter FPA amount"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* GST */}
                    <div>
                      <label htmlFor="gst" className="block text-sm font-medium text-gray-700 mb-1">
                        GST *
                      </label>
                      <input
                        type="number"
                        id="gst"
                        name="gst"
                        value={formData.gst}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter GST amount"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Retail Tax */}
                    <div>
                      <label htmlFor="retailTax" className="block text-sm font-medium text-gray-700 mb-1">
                        Retail Tax *
                      </label>
                      <input
                        type="number"
                        id="retailTax"
                        name="retailTax"
                        value={formData.retailTax}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter retail tax amount"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    {/* Income Tax */}
                    <div>
                      <label htmlFor="incomeTax" className="block text-sm font-medium text-gray-700 mb-1">
                        Income Tax *
                      </label>
                      <input
                        type="number"
                        id="incomeTax"
                        name="incomeTax"
                        value={formData.incomeTax}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter income tax amount"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Image (Optional)</h3>
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Bill Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload an image of the bill (JPG, PNG, GIF - Max 5MB)
                    </p>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Bill preview"
                            className="max-w-full h-32 object-contain border rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              // Reset file input
                              const fileInput = document.getElementById('image');
                              if (fileInput) fileInput.value = '';
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
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
                      'Create Bill Entry'
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
                  Data Visibility
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Once you create a data entry, it will be immediately visible to Ramzin users 
                    in their dashboard. They can search and view all the data you create.
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
                <h3 className="text-lg font-medium text-gray-900">Review Bill Information</h3>
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
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Customer ID:</span> {formData.customerId || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Paypro ID:</span> {formData.payproId || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Bill Month:</span> {formData.billMonth || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span> {formData.mobile || 'Not provided'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Name & Address:</span>
                      <p className="mt-1 text-gray-700 whitespace-pre-line">{formData.nameAndAddress || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Date Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Date Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Reading Date:</span> {formData.readingDate || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Issue Date:</span> {formData.issueDate || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span> {formData.dueDate || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Reading Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Reading Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Previous Reading:</span> {formData.previousReading || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Present Reading:</span> {formData.presentReading || 'Not provided'}
                    </div>
                    <div>
                      <span className="font-medium">Unit Consumed:</span> {formData.unitConsumed || 'Not provided'}
                    </div>
                  </div>
                </div>

                {/* Cost Information */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Cost Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Total Cost:</span> ${formData.totalCost || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">FPA:</span> ${formData.fpa || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">GST:</span> ${formData.gst || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Retail Tax:</span> ${formData.retailTax || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Income Tax:</span> ${formData.incomeTax || '0.00'}
                    </div>
                  </div>
                </div>

                {/* Image */}
                {imagePreview && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Bill Image</h4>
                    <div className="text-sm">
                      <span className="font-medium">Selected Image:</span>
                      <p className="mt-1 text-gray-600">{selectedImage?.name}</p>
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Bill preview" 
                          className="max-w-full h-32 object-contain border rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
    </div>
  );
};

export default EditorDashboard;
