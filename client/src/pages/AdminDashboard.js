import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [utilityBills, setUtilityBills] = useState([]);
  const [serviceBills, setServiceBills] = useState([]);
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerTaxDetails, setCustomerTaxDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({});
  const [showTaxReport, setShowTaxReport] = useState(false);

  // Fetch data functions
  const fetchUtilityBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/data/list');
      setUtilityBills(response.data.data);
    } catch (error) {
      setError('Failed to fetch utility bills');
      console.error('Fetch utility bills error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/data/service/admin/all');
      setServiceBills(response.data.data);
    } catch (error) {
      setError('Failed to fetch service bills');
      console.error('Fetch service bills error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/data/service/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/data/admin/customers');
      setCustomers(response.data.data);
    } catch (error) {
      setError('Failed to fetch customers');
      console.error('Fetch customers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async () => {
    if (!searchQuery.trim()) {
      fetchCustomers();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get('/api/data/admin/customers/search', {
        params: { query: searchQuery }
      });
      setCustomers(response.data.data);
    } catch (error) {
      setError('Failed to search customers');
      console.error('Search customers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerTaxDetails = async (customerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/data/admin/customers/${customerId}/tax-details`);
      console.log('Customer tax details response:', response.data.data);
      setCustomerTaxDetails(response.data.data);
      setShowTaxReport(true);
    } catch (error) {
      setError('Failed to fetch customer tax details');
      console.error('Fetch customer tax details error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'utility') {
      fetchUtilityBills();
    } else if (activeTab === 'service') {
      fetchServiceBills();
    } else if (activeTab === 'overview') {
      fetchStats();
    } else if (activeTab === 'tax') {
      fetchCustomers();
    }
  }, [activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('utility')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'utility'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Utility Bills
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'service'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Service Bills
            </button>
            <button
              onClick={() => setActiveTab('tax')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tax'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tax Information
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Utility Bills</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalUtilityBills || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Service Bills</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalServiceBills || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.totalUsers || 0}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    System Overview
                  </h3>
                  <div className="text-sm text-gray-500">
                    <p>Welcome to the Admin Dashboard. Here you can view and manage all system data including utility bills and service bills created by users across all dashboards.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Utility Bills Tab */}
          {activeTab === 'utility' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Utility Bills
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Search bills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={fetchUtilityBills}
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Refresh'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Month</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {utilityBills.map((bill) => (
                          <tr key={bill._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{bill.customerId}</div>
                              <div className="text-sm text-gray-500">{bill.nameAndAddress}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.billMonth}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(bill.totalCost)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.createdBy?.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(bill.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-900">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Bills Tab */}
          {activeTab === 'service' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Service Bills
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Search bills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={fetchServiceBills}
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Refresh'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bill</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {serviceBills.map((bill) => (
                          <tr key={bill._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{bill.billTitle}</div>
                              <div className="text-sm text-gray-500">{bill.billMonth}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{bill.customerName}</div>
                              <div className="text-sm text-gray-500">{bill.customerId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {bill.billType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(bill.totalCurrentBill)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.createdBy?.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(bill.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-900">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tax Information Tab */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Tax Information - Customer List
                    </h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Search by Customer ID or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={searchCustomers}
                        disabled={loading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Searching...' : 'Search'}
                      </button>
                      <button
                        onClick={fetchCustomers}
                        disabled={loading}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Refresh'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FPA</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retail Tax</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income Tax</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bills Count</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => (
                          <tr key={customer._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {customer._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {customer.customerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(customer.totalCost)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(customer.totalFPA)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(customer.totalGST)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(customer.totalRetailTax)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(customer.totalIncomeTax)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {customer.billCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => fetchCustomerTaxDetails(customer._id)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Tax Report Modal */}
      {showTaxReport && customerTaxDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Tax Report - {customerTaxDetails.customerName}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Print Report
                  </button>
                  <button
                    onClick={() => {
                      setShowTaxReport(false);
                      setCustomerTaxDetails(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              {/* Report Content */}
              <div className="bg-white border-2 border-gray-300 p-8 print:border-0 print:shadow-none" id="tax-report-content">
                {/* Company Header */}
                <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">PAK UTILITIES & SERVICES</h1>
                  <p className="text-lg text-gray-700 mb-1">Tax Information Report</p>
                  <p className="text-sm text-gray-600">Customer ID: {customerTaxDetails.customerId}</p>
                  <p className="text-sm text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Customer Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p><span className="font-semibold">Customer ID:</span> {customerTaxDetails.customerId}</p>
                      <p><span className="font-semibold">Customer Name:</span> {customerTaxDetails.customerName}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Total Bills:</span> {customerTaxDetails.totals.billCount}</p>
                      <p><span className="font-semibold">Report Period:</span> All Time</p>
                    </div>
                  </div>
                </div>

                {/* Tax Summary */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Tax Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Tax Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Total Amount ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">Total Cost</td>
                          <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(customerTaxDetails.totals.totalCost)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">FPA (Fuel Price Adjustment)</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalFPA)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">GST (Goods & Services Tax)</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalGST)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Retail Tax</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalRetailTax)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Income Tax</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalIncomeTax)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Individual Bills */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Individual Bills ({customerTaxDetails.bills.length} bills found)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Bill Month</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Total Cost</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">FPA</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">GST</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Retail Tax</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Income Tax</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Paypro ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Created By</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerTaxDetails.bills.map((bill, index) => (
                          <tr key={bill._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2 font-medium">{bill.billMonth}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{formatCurrency(bill.totalCost)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(bill.fpa)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(bill.gst)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(bill.retailTax)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(bill.incomeTax)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{bill.payproId}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{bill.createdBy?.username}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{formatDate(bill.createdAt)}</td>
                          </tr>
                        ))}
                        {/* Total Row */}
                        <tr className="bg-blue-50 font-bold border-t-2 border-gray-400">
                          <td className="border border-gray-300 px-4 py-2">TOTAL</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalCost)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalFPA)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalGST)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalRetailTax)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(customerTaxDetails.totals.totalIncomeTax)}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center" colSpan="3">
                            {customerTaxDetails.totals.billCount} bills
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
                  <p>This is a computer-generated tax report. No signature required.</p>
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

export default AdminDashboard;
