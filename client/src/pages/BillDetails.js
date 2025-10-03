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
      
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Print Button */}
        <div className="max-w-5xl mx-auto mb-4 flex justify-end no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Report</span>
          </button>
        </div>
      
      <div className="max-w-5xl mx-auto bg-white shadow-lg border border-gray-400 print-container">
        
        {/* Header with QR Code and Company Info */}
        <div className="border-b-2 border-gray-400 p-4">
          <div className="flex items-start justify-between mb-4">
            {/* Left Side - QR Code and Contact Info */}
            <div className="flex items-start space-x-4">
              <div className="bg-black p-2 w-20 h-20 flex items-center justify-center">
                <div className="text-white text-xs text-center">
                  QR<br/>CODE
                </div>
              </div>
              <div className="text-sm">
                <p className="font-semibold">Electricity Help Line: 042-35924211</p>
                <p className="font-semibold">Security Help Line: 0300-4558077</p>
                <p className="font-semibold">Fire Brigade: 0317-0174727</p>
              </div>
            </div>
            
            {/* Center - Company Name */}
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold">Ramzin Power Co. (Pvt.) Ltd.</h1>
              <p className="text-sm font-semibold">(Electricity Consumer Bill)</p>
            </div>
            
            {/* Right Side - Tax Numbers */}
            <div className="text-right text-sm">
              <p className="font-semibold">STRN: 0300376479112</p>
              <p className="font-semibold">NTN: 3764791-1</p>
            </div>
          </div>
        </div>

        {/* Key Identifiers */}
        <div className="border-b border-gray-400 p-4">
          <div className="grid grid-cols-6 gap-4 text-center">
            <div className="border-r border-gray-400">
              <p className="text-xs font-semibold text-gray-600">Customer ID</p>
              <p className="text-sm font-bold">{billData.customerId}</p>
            </div>
            <div className="border-r border-gray-400">
              <p className="text-xs font-semibold text-gray-600">PayPro ID</p>
              <p className="text-sm font-bold">{billData.payproId}</p>
            </div>
            <div className="border-r border-gray-400">
              <p className="text-xs font-semibold text-gray-600">Bill Month</p>
              <p className="text-sm font-bold">{billData.billMonth}</p>
            </div>
            <div className="border-r border-gray-400">
              <p className="text-xs font-semibold text-gray-600">Reading Date</p>
              <p className="text-sm font-bold">{new Date(billData.readingDate).toLocaleDateString()}</p>
            </div>
            <div className="border-r border-gray-400">
              <p className="text-xs font-semibold text-gray-600">Issue Date</p>
              <p className="text-sm font-bold">{new Date(billData.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600">Due Date</p>
              <p className="text-sm font-bold text-red-600">{new Date(billData.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="border-b border-gray-400 p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <p className="text-xs font-semibold text-gray-600">Name & Address</p>
              <p className="text-sm font-bold">{billData.nameAndAddress}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600">Mobile</p>
              <p className="text-sm font-bold">{billData.mobile}</p>
            </div>
          </div>
        </div>

        {/* Current Billing Details Table */}
        <div className="border-b border-gray-400 p-4">
          <table className="w-full border border-gray-400 text-sm text-center">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="border border-gray-400 p-2">Adjusted Units</th>
                <th className="border border-gray-400 p-2">Previous Reading</th>
                <th className="border border-gray-400 p-2">Present Reading</th>
                <th className="border border-gray-400 p-2">Unit Consumed</th>
                <th className="border border-gray-400 p-2">Total Cost</th>
                <th className="border border-gray-400 p-2">FPA</th>
                <th className="border border-gray-400 p-2">GST</th>
                <th className="border border-gray-400 p-2">Further Tax</th>
                <th className="border border-gray-400 p-2">Extra Tax</th>
                <th className="border border-gray-400 p-2">Retail Tax</th>
                <th className="border border-gray-400 p-2">Income Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2">{billData.adjustedUnits || 0}</td>
                <td className="border border-gray-400 p-2">{billData.previousReading}</td>
                <td className="border border-gray-400 p-2">{billData.presentReading}</td>
                <td className="border border-gray-400 p-2">{billData.unitConsumed}</td>
                <td className="border border-gray-400 p-2 font-bold">{billData.totalCost}</td>
                <td className="border border-gray-400 p-2">{billData.fpa}</td>
                <td className="border border-gray-400 p-2">{billData.gst}</td>
                <td className="border border-gray-400 p-2">0</td>
                <td className="border border-gray-400 p-2">0</td>
                <td className="border border-gray-400 p-2">{billData.retailTax}</td>
                <td className="border border-gray-400 p-2">{billData.incomeTax}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Billing History & Current Charges Side by Side */}
<div className="grid grid-cols-2 gap-4 p-4 ">
  
  {/* Billing History (Left) */}
  <div>
    <table className="w-full border border-gray-400 text-sm text-center">
      <thead className="bg-gray-100 font-semibold">
        <tr>
          <th className="border border-gray-400 p-2">Billing Month</th>
          <th className="border border-gray-400 p-2">Units</th>
          <th className="border border-gray-400 p-2">Bill</th>
          <th className="border border-gray-400 p-2">Payment</th>
        </tr>
      </thead>
      <tbody>
        {billData.billingHistory?.map((row, i) => (
          <tr key={i}>
            <td className="border border-gray-400 p-2">{row.month}</td>
            <td className="border border-gray-400 p-2">{row.units}</td>
            <td className="border border-gray-400 p-2">{row.bill}</td>
            <td className="border border-gray-400 p-2">{row.payment}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Current Charges + Image (Right) */}
  <div className="flex flex-col space-y-4">
    {/* Payment Summary Table */}
    <table className="w-full border border-gray-400 text-sm">
      <tbody>
        <tr>
          <td className="border border-gray-400 p-2">Previous Balance</td>
          <td className="border border-gray-400 p-2 text-right">0</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">TV Fee</td>
          <td className="border border-gray-400 p-2 text-right">100</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">Current Bill</td>
          <td className="border border-gray-400 p-2 text-right">{billData.totalCost}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">Subsidy/Adjustment</td>
          <td className="border border-gray-400 p-2 text-right">0</td>
        </tr>
        <tr className="bg-red-50 font-bold">
          <td className="border border-gray-400 p-2">Payable within due date</td>
          <td className="border border-gray-400 p-2 text-right text-red-600">{billData.totalCost}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">LP Surcharge</td>
          <td className="border border-gray-400 p-2 text-right">{Math.round(billData.totalCost*0.1)}</td>
        </tr>
        <tr className="bg-red-50 font-bold">
          <td className="border border-gray-400 p-2">Payable after due date</td>
          <td className="border border-gray-400 p-2 text-right text-red-600">
            {billData.totalCost + Math.round(billData.totalCost*0.1)}
          </td>
        </tr>
      </tbody>
    </table>

    {/* Meter Image */}
    {billData.image && billData.image.data && (
      <div className="flex justify-center">
        <img
          src={`/api/data/${id}/image`}
          alt="Electricity Meter"
          className="max-w-full h-auto border border-gray-400 shadow-md"
          // style={{ maxHeight: '400px' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    )}
  </div>

</div>

        

{/* Office Copy */}
<div className="mt-4">
  <h3 className="font-semibold text-center py-2 bg-gray-400">OFFICE COPY</h3>

  {/* Table */}
  <table className="w-full border border-gray-400 text-sm text-center">
    <tbody>
      {/* Top Row - IDs & Dates */}
      <tr>
        <td className="border border-gray-400 p-2 text-blue-600 font-semibold">
          Customer ID <br />
          {billData.customerId}
        </td>
        <td className="border border-gray-400 p-2 text-blue-600 font-semibold">
          Bill Month <br />
          {billData.billMonth}
        </td>
        <td className="border border-gray-400 p-2 text-blue-600 font-semibold">
          Reading Date <br />
          {new Date(billData.readingDate).toLocaleDateString()}
        </td>
        <td className="border border-gray-400 p-2 text-blue-600 font-semibold">
          Issue Date <br />
          {new Date(billData.issueDate).toLocaleDateString()}
        </td>
        <td className="border border-gray-400 p-2 text-blue-600 font-semibold">
          Due Date <br />
          {new Date(billData.dueDate).toLocaleDateString()}
        </td>
      </tr>

      {/* Second Row - Name & Address and Mobile */}
      <tr>
        <td className="border border-gray-400 p-2 font-semibold text-blue-600">
          Name & Address
        </td>
        <td colSpan="3" className="border border-gray-400 p-2 text-left">
          {billData.nameAndAddress}
        </td>
        <td className="border border-gray-400 p-2">{billData.mobile}</td>
      </tr>

      {/* Third Row - Balance & Payment Details */}
      <tr>
        {/* Left Column - Previous + Current Bill */}
        <td className="border border-gray-400 p-0 w-1/4 align-top">
          <div className="border-b border-gray-400 p-2">
            <p className="font-semibold">Previous Balance</p>
            <p>0</p>
          </div>
          <div className="p-2">
            <p className="font-semibold">Current Bill</p>
            <p className="font-bold">{billData.totalCost}</p>
          </div>
        </td>

        {/* Center Column - Payable within due date */}
        <td
          colSpan="3"
          className="border border-gray-400 p-4 font-semibold text-red-600 w-2/4 align-middle"
        >
          Payable within due date <br />
          <span className="font-bold text-xl">{billData.totalCost}</span>
        </td>

        {/* Right Column - L.P Surcharge + Payable after due date */}
        <td className="border border-gray-400 p-0 w-1/4 align-top">
          <div className="border-b border-gray-400 p-2">
            <p className="font-semibold">L.P Surcharge</p>
            <p>{Math.round(billData.totalCost * 0.1)}</p>
          </div>
          <div className="p-2">
            <p className="font-semibold text-red-600">Payable after due date</p>
            <p className="font-bold text-red-600">
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
    </>
  );
};

export default BillDetails;
