import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await axios.get(`/api/data/${id}`);
        setBillData(response.data.data);
      } catch (error) {
        setError('Failed to fetch bill details');
        console.error('Fetch bill details error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBillDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !billData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bill Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested bill could not be found.'}</p>
          <button
            onClick={() => navigate('/ramzin-dashboard')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-container {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6">
        {/* Print Button */}
        <div className="max-w-5xl mx-auto mb-4 flex justify-end no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 rounded-md flex items-center space-x-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">Print Report</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      
      <div className="max-w-5xl mx-auto bg-white shadow-lg border border-gray-400 print-container overflow-x-auto">
        
        {/* Header with QR Code and Company Info */}
        <div className="border-b-2 border-gray-400 p-2 sm:p-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 space-y-4 lg:space-y-0">
            {/* Left Side - QR Code and Contact Info */}
            <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="bg-black p-2 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center self-center sm:self-start">
                <div className="text-white text-xs text-center">
                  QR<br/>CODE
                </div>
              </div>
              <div className="text-xs sm:text-sm text-center sm:text-left">
                <p className="font-semibold">Electricity Help Line: 042-35924211</p>
                <p className="font-semibold">Security Help Line: 0300-4558077</p>
                <p className="font-semibold">Fire Brigade: 0317-0174727</p>
              </div>
            </div>
            
            {/* Center - Company Name */}
            <div className="text-center flex-1">
              <h1 className="text-lg sm:text-xl font-bold">Ramzin Power Co. (Pvt.) Ltd.</h1>
              <p className="text-xs sm:text-sm font-semibold">(Electricity Consumer Bill)</p>
            </div>
            
            {/* Right Side - Tax Numbers */}
            <div className="text-center lg:text-right text-xs sm:text-sm">
              <p className="font-semibold">STRN: 0300376479112</p>
              <p className="font-semibold">NTN: 3764791-1</p>
            </div>
          </div>
        </div>

        {/* Key Identifiers */}
        <div className="border-b border-gray-400 p-2 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 text-center">
            <div className="border-r border-gray-400 pr-2">
              <p className="text-xs font-semibold text-gray-600">Customer ID</p>
              <p className="text-xs sm:text-sm font-bold break-all">{billData.customerId}</p>
            </div>
            <div className="border-r border-gray-400 pr-2">
              <p className="text-xs font-semibold text-gray-600">PayPro ID</p>
              <p className="text-xs sm:text-sm font-bold break-all">{billData.payproId}</p>
            </div>
            <div className="border-r border-gray-400 pr-2">
              <p className="text-xs font-semibold text-gray-600">Bill Month</p>
              <p className="text-xs sm:text-sm font-bold">{billData.billMonth}</p>
            </div>
            <div className="border-r border-gray-400 pr-2">
              <p className="text-xs font-semibold text-gray-600">Reading Date</p>
              <p className="text-xs sm:text-sm font-bold">{new Date(billData.readingDate).toLocaleDateString()}</p>
            </div>
            <div className="border-r border-gray-400 pr-2">
              <p className="text-xs font-semibold text-gray-600">Issue Date</p>
              <p className="text-xs sm:text-sm font-bold">{new Date(billData.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600">Due Date</p>
              <p className="text-xs sm:text-sm font-bold text-red-600">{new Date(billData.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b border-gray-400 p-2 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-600">Name & Address</p>
              <p className="text-xs sm:text-sm font-bold break-words">{billData.nameAndAddress}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600">Mobile</p>
              <p className="text-xs sm:text-sm font-bold">{billData.mobile}</p>
            </div>
          </div>
        </div>

        {/* Current Billing Details Table */}
        <div className="border-b border-gray-400 p-2 sm:p-4">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400 text-xs sm:text-sm text-center min-w-max">
              <thead className="bg-gray-100 font-semibold">
                <tr>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Adjusted Units</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Previous Reading</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Present Reading</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Unit Consumed</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Total Cost</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">FPA</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">GST</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Further Tax</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Extra Tax</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Retail Tax</th>
                  <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.adjustedUnits || 0}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.previousReading}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.presentReading}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.unitConsumed}</td>
                  <td className="border border-gray-400 p-1 sm:p-2 font-bold">{billData.totalCost}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.fpa}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.gst}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">0</td>
                  <td className="border border-gray-400 p-1 sm:p-2">0</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.retailTax}</td>
                  <td className="border border-gray-400 p-1 sm:p-2">{billData.incomeTax}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing History & Current Charges Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2 sm:p-4">
          
          {/* Billing History (Left) */}
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-400 text-xs sm:text-sm text-center min-w-max">
                <thead className="bg-gray-100 font-semibold">
                  <tr>
                    <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Billing Month</th>
                    <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Units</th>
                    <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Bill</th>
                    <th className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.billingHistory?.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">{row.month}</td>
                      <td className="border border-gray-400 p-1 sm:p-2">{row.units}</td>
                      <td className="border border-gray-400 p-1 sm:p-2">{row.bill}</td>
                      <td className="border border-gray-400 p-1 sm:p-2">{row.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Current Charges + Image (Right) */}
          <div className="flex flex-col space-y-4">
            {/* Payment Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-400 text-xs sm:text-sm min-w-max">
                <tbody>
                  <tr>
                    <td className="border border-gray-400 p-1 sm:p-2">Previous Balance</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right">0</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 sm:p-2">TV Fee</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right">100</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 sm:p-2">Current Bill</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right">{billData.totalCost}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 sm:p-2">Subsidy/Adjustment</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right">0</td>
                  </tr>
                  <tr className="bg-red-50 font-bold">
                    <td className="border border-gray-400 p-1 sm:p-2">Payable within due date</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right text-red-600">{billData.totalCost}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-1 sm:p-2">LP Surcharge</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right">{Math.round(billData.totalCost*0.1)}</td>
                  </tr>
                  <tr className="bg-red-50 font-bold">
                    <td className="border border-gray-400 p-1 sm:p-2">Payable after due date</td>
                    <td className="border border-gray-400 p-1 sm:p-2 text-right text-red-600">
                      {billData.totalCost + Math.round(billData.totalCost*0.1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Meter Image */}
            {billData.image && billData.image.data && (
              <div className="flex justify-center">
                <img
                  src={`/api/data/${id}/image`}
                  alt="Electricity Meter"
                  className="max-w-full h-auto border border-gray-400 shadow-md"
                  style={{ maxHeight: '250px' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>

        

        {/* Office Copy */}
        <div className="mt-4">
          <h3 className="font-semibold text-center py-2 bg-gray-400 text-sm sm:text-base">OFFICE COPY</h3>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-400 text-xs sm:text-sm text-center min-w-max">
              <tbody>
                {/* Top Row - IDs & Dates */}
                <tr>
                  <td className="border border-gray-400 p-1 sm:p-2 text-blue-600 font-semibold whitespace-nowrap">
                    Customer ID <br />
                    {billData.customerId}
                  </td>
                  <td className="border border-gray-400 p-1 sm:p-2 text-blue-600 font-semibold whitespace-nowrap">
                    Bill Month <br />
                    {billData.billMonth}
                  </td>
                  <td className="border border-gray-400 p-1 sm:p-2 text-blue-600 font-semibold whitespace-nowrap">
                    Reading Date <br />
                    {new Date(billData.readingDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-400 p-1 sm:p-2 text-blue-600 font-semibold whitespace-nowrap">
                    Issue Date <br />
                    {new Date(billData.issueDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-400 p-1 sm:p-2 text-blue-600 font-semibold whitespace-nowrap">
                    Due Date <br />
                    {new Date(billData.dueDate).toLocaleDateString()}
                  </td>
                </tr>

                {/* Second Row - Name & Address and Mobile */}
                <tr>
                  <td className="border border-gray-400 p-1 sm:p-2 font-semibold text-blue-600 whitespace-nowrap">
                    Name & Address
                  </td>
                  <td colSpan="3" className="border border-gray-400 p-1 sm:p-2 text-left">
                    <span className="break-words">{billData.nameAndAddress}</span>
                  </td>
                  <td className="border border-gray-400 p-1 sm:p-2 whitespace-nowrap">{billData.mobile}</td>
                </tr>

                {/* Third Row - Balance & Payment Details */}
                <tr>
                  {/* Left Column - Previous + Current Bill */}
                  <td className="border border-gray-400 p-0 w-1/4 align-top">
                    <div className="border-b border-gray-400 p-1 sm:p-2">
                      <p className="font-semibold text-xs sm:text-sm">Previous Balance</p>
                      <p className="text-xs sm:text-sm">0</p>
                    </div>
                    <div className="p-1 sm:p-2">
                      <p className="font-semibold text-xs sm:text-sm">Current Bill</p>
                      <p className="font-bold text-xs sm:text-sm">{billData.totalCost}</p>
                    </div>
                  </td>

                  {/* Center Column - Payable within due date */}
                  <td
                    colSpan="3"
                    className="border border-gray-400 p-2 sm:p-4 font-semibold text-red-600 w-2/4 align-middle"
                  >
                    <span className="text-xs sm:text-sm">Payable within due date</span> <br />
                    <span className="font-bold text-lg sm:text-xl">{billData.totalCost}</span>
                  </td>

                  {/* Right Column - L.P Surcharge + Payable after due date */}
                  <td className="border border-gray-400 p-0 w-1/4 align-top">
                    <div className="border-b border-gray-400 p-1 sm:p-2">
                      <p className="font-semibold text-xs sm:text-sm">L.P Surcharge</p>
                      <p className="text-xs sm:text-sm">{Math.round(billData.totalCost * 0.1)}</p>
                    </div>
                    <div className="p-1 sm:p-2">
                      <p className="font-semibold text-red-600 text-xs sm:text-sm">Payable after due date</p>
                      <p className="font-bold text-red-600 text-xs sm:text-sm">
                        {billData.totalCost + Math.round(billData.totalCost * 0.1)}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>



      </div>
      </div>
    </>
  );
};

export default BillDetails;
