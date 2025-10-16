import React, { useMemo, useState } from 'react';
import axios from 'axios';

const Field = ({ label, placeholder, className = '', right = false, type = 'text', value, onChange, name }) => (
	<div className={`flex border border-gray-300 text-[11px] leading-none ${right ? 'flex-row-reverse' : ''}`}>
		<div className="flex-1 p-1">
			<input
				type={type}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				className={`w-full outline-none placeholder-gray-400 ${className}`}
			/>
		</div>
		<div className="w-36 bg-gray-100 border-l border-gray-300 px-2 py-1 font-semibold text-gray-800 whitespace-nowrap">
			{label}
		</div>
	</div>
);

// AmountRow component removed as it's not being used

const SectionHeader = ({ copyLabel }) => (
	<div className="grid grid-cols-3">
		<div className="col-span-2 bg-emerald-700 text-white px-3 py-2 font-bold uppercase tracking-wide text-[12px]">Caretaken Charges Bills</div>
		<div className="bg-emerald-400 text-white px-3 py-2 font-bold text-right text-[12px]">{copyLabel}</div>
	</div>
);

const TopBrand = () => (
	<div className="flex items-center gap-3">
		<div className="h-8 w-8 border-2 border-emerald-700 flex items-center justify-center font-bold text-emerald-700">H</div>
		<div>
			<div className="text-[12px] font-bold text-gray-900 leading-tight">PAFB</div>
			<div className="text-[9px] uppercase tracking-wide text-gray-500">A Mark of Pride</div>
		</div>
	</div>
);

const InfoGrid = ({ data, onChange }) => (
	<div className="grid grid-cols-2 gap-1 text-[11px]">
		<Field label="Mongo ID (_id)" placeholder="Enter Mongo Document ID" name="mongoId" value={data.mongoId} onChange={onChange} />
		<Field label="Block" placeholder="Enter Block" right name="block" value={data.block} onChange={onChange} />
		<Field label="Customer Name" placeholder="Enter Customer Name" name="customerName" value={data.customerName} onChange={onChange} />
		<Field label="Size" placeholder="Enter Size" right name="size" value={data.size} onChange={onChange} />
		<Field label="Bill Id" placeholder="Enter Bill Id" name="billId" value={data.billId} onChange={onChange} />
		<Field label="House No" placeholder="Enter House No" right name="houseNo" value={data.houseNo} onChange={onChange} />
	</div>
);

const PeriodGrid = ({ data, onChange }) => (
	<div className="grid grid-cols-3 gap-1 mt-1 text-[11px]">
		<Field label="Billing Quarter" placeholder="e.g., Q4 (Oct-Dec) - 2025" name="billingQuarter" value={data.billingQuarter} onChange={onChange} />
		<Field label="Date of Issue" placeholder="DD/MM/YYYY" name="issueDate" value={data.issueDate} onChange={onChange} />
		<Field label="Due Date" placeholder="DD/MM/YYYY" name="dueDate" value={data.dueDate} onChange={onChange} />
	</div>
);

const ChargesTable = ({ data, onChange }) => (
	<div className="mt-2 grid grid-cols-4 gap-0">
		{/* Left: Charges + Amount (3/4) */}
		<div className="col-span-3 border border-gray-300">
			<div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300">
				<div className="px-2 py-1 font-semibold text-[11px]">Charges</div>
				<div className="px-2 py-1 font-semibold text-[11px] border-l border-gray-300">Amount</div>
			</div>
			<table className="w-full table-fixed">
				<tbody>
					<tr>
						<td className="border border-gray-300 px-2 py-1 text-[11px]">Current Quarter CTC Charges:</td>
						<td className="border border-gray-300 px-2 py-1 text-right">
							<input name="ctcCharges" value={data.ctcCharges} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full text-right outline-none placeholder-gray-400 text-[11px]" />
						</td>
					</tr>
					<tr>
						<td className="border border-gray-300 px-2 py-1 text-[11px]">Outstanding/Dues:</td>
						<td className="border border-gray-300 px-2 py-1 text-right">
							<input name="outstanding" value={data.outstanding} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full text-right outline-none placeholder-gray-400 text-[11px]" />
						</td>
					</tr>
					<tr>
						<td className="border border-gray-300 px-2 py-1 text-[11px]">Total Payable Amount (Within in Due Date):</td>
						<td className="border border-gray-300 px-2 py-1 text-right">
							<input name="withinDue" value={data.withinDue} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full text-right outline-none placeholder-gray-400 text-[11px]" />
						</td>
					</tr>
					<tr>
						<td className="border border-gray-300 px-2 py-1 text-[11px]">Late Payment Surcharge:</td>
						<td className="border border-gray-300 px-2 py-1 text-right">
							<input name="surcharge" value={data.surcharge} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full text-right outline-none placeholder-gray-400 text-[11px]" />
						</td>
					</tr>
					<tr>
						<td className="border border-gray-300 px-2 py-1 text-[11px]">Gross Amount Payment (After Due Date):</td>
						<td className="border border-gray-300 px-2 py-1 text-right">
							<input name="afterDue" value={data.afterDue} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full text-right outline-none placeholder-gray-400 text-[11px]" />
						</td>
					</tr>
				</tbody>
			</table>
			<div className="grid grid-cols-2 text-[11px] bg-emerald-100 border-t border-gray-300">
				<div className="px-2 py-1 font-semibold">Payable within in Due Date</div>
				<div className="px-2 py-1 font-semibold text-right">Payable After Due Date</div>
			</div>
			<div className="grid grid-cols-2 text-[11px]">
				<div className="px-2 py-1 text-emerald-700 font-bold border-t border-gray-300">
					<input name="payableWithin" value={data.payableWithin} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full outline-none text-right" />
				</div>
				<div className="px-2 py-1 text-emerald-700 font-bold border-t border-gray-300 text-right">
					<input name="payableAfter" value={data.payableAfter} onChange={onChange} type="text" placeholder="Enter Amount" className="w-full outline-none text-right" />
				</div>
			</div>
		</div>
		{/* Right: NOTICE (1/4) */}
		<div className="border border-gray-300 border-l-0">
			<div className="bg-red-600 text-white text-center font-bold text-[12px] py-1">NOTICE</div>
			<div className="p-2 text-[10px] leading-4 text-gray-700">
				<textarea placeholder="Type notice text here..." className="w-full h-40 outline-none" />
			</div>
		</div>
	</div>
);

const CopyCard = ({ label, data, onChange }) => (
	<div className="border border-gray-400">
		<SectionHeader copyLabel={label} />
		<div className="p-3">
			<div className="flex justify-between items-start">
				<TopBrand />
			</div>
			<div className="mt-2">
				<InfoGrid data={data} onChange={onChange} />
				<PeriodGrid data={data} onChange={onChange} />
				<ChargesTable data={data} onChange={onChange} />
			</div>
		</div>
	</div>
);

const Page = ({ withDashed = false, data, onChange }) => (
    <div className="bg-white p-4">
		<CopyCard label="CUSTOMER COPY" data={data} onChange={onChange} />
		{withDashed && (
			<div className="my-3 border-t-2 border-dashed border-gray-400" />
		)}
		<CopyCard label="BANK COPY" data={data} onChange={onChange} />
	</div>
);

const CaretakerChargesForm = () => {
    const now = useMemo(() => new Date(), []);
    const [data, setData] = useState({
			mongoId: '', block: '', customerName: '', size: '', billId: '', houseNo: '',
        billingQuarter: '', issueDate: '', dueDate: '',
        ctcCharges: '', outstanding: '', withinDue: '', surcharge: '', afterDue: '',
        payableWithin: '', payableAfter: ''
    });
    const [lookupLoading, setLookupLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const pick = (obj, keys) => {
        for (const k of keys) {
            if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
        }
        return undefined;
    };

    const lookupById = async () => {
		const id = (data.mongoId || '').trim();
		if (!id) return;
		try {
            setLookupLoading(true);
            setError('');
            setSuccess('');
            const res = await axios.get(`/api/data/salesdata/by-id/${encodeURIComponent(id)}`);
			const raw = res.data?.data || {};
			const d = raw || {};
			setData(prev => ({
				...prev,
				block: pick(d, ['block','Block','BLOCK']) || prev.block,
				customerName: pick(d, ['CustName','customerName','CustomerName','NAME','Name','Customer']) || prev.customerName,
				size: pick(d, ['Marlas','size','Size','Type']) || prev.size,
				billId: pick(d, ['SaleNo','billId','BillId','BillID']) || prev.billId,
				houseNo: pick(d, ['AutoUnitNo','houseNo','HouseNo','House','House_No']) || prev.houseNo,
				billingQuarter: pick(d, ['billingQuarter','BillingQuarter','Quarter']) || prev.billingQuarter,
				issueDate: pick(d, ['issueDate','IssueDate','DateOfIssue']) || prev.issueDate,
				dueDate: pick(d, ['dueDate','DueDate']) || prev.dueDate,
				ctcCharges: pick(d, ['Value','ctcCharges','CTC','CurrentQuarterCharges']) || prev.ctcCharges,
				outstanding: pick(d, ['Balance','outstanding','Outstanding','Dues']) || prev.outstanding,
				withinDue: pick(d, ['ReceiveAble','withinDue','PayableWithinDueDate']) || prev.withinDue,
				surcharge: pick(d, ['surcharge','LatePaymentSurcharge','LPSurcharge']) || prev.surcharge,
				afterDue: pick(d, ['ReceiveAble','afterDue','GrossAfterDue','PayableAfterDueDate']) || prev.afterDue,
				payableWithin: pick(d, ['ReceiveAble','payableWithin','PayableWithin']) || prev.payableWithin,
				payableAfter: pick(d, ['ReceiveAble','payableAfter','PayableAfter']) || prev.payableAfter,
			}));
            setSuccess('Details autofilled from selected record.');
		} catch (e) {
            if (e.response?.status === 404) {
                setError('No record found for this Mongo ID.');
            } else if (e.response?.status === 400) {
                setError('Invalid Mongo ID format.');
            } else {
                setError(e.response?.data?.message || 'Failed to lookup Mongo ID');
            }
		}
        finally {
            setLookupLoading(false);
        }
	};

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!data.customerName || !data.billId || !data.block) {
            setError('Please fill in required fields: Customer Name, Bill ID, and Block');
            return;
        }

        try {
            setSubmitLoading(true);
            setError('');
            setSuccess('');

            const submitData = {
                ...data,
                submittedAt: new Date().toISOString(),
                formType: 'caretaker_charges'
            };

            await axios.post('/api/data/clientdata/caretaker-charges', submitData);
            
            setSuccess('Caretaker charges data saved successfully!');
            // Reset form after successful submission
            setData({
                mongoId: '', block: '', customerName: '', size: '', billId: '', houseNo: '',
                billingQuarter: '', issueDate: '', dueDate: '',
                ctcCharges: '', outstanding: '', withinDue: '', surcharge: '', afterDue: '',
                payableWithin: '', payableAfter: ''
            });
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || 'Failed to save caretaker charges data');
        } finally {
            setSubmitLoading(false);
        }
    };
    return (
		<div className="min-h-screen bg-gray-50">
			<style>{`
				@page { size: A4; margin: 12mm; }
				@media print {
					body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
					.no-print { display: none !important; }
					.shadow, .ring-1, .border { box-shadow: none !important; }
				}
			`}</style>
			<div className="max-w-[794px] mx-auto my-6 bg-white shadow ring-1 ring-gray-300 print:shadow-none print:ring-0">
				<div className="p-4 border-b border-gray-300 no-print">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold text-gray-900">Caretaker Charges Form</h2>
							<p className="text-sm text-gray-600">PAFB – A Mark of Pride</p>
						</div>
						<button onClick={() => window.print()} className="px-3 py-2 bg-emerald-600 text-white rounded">Print</button>
					</div>
					<div className="text-xs text-gray-500 mt-2">Generated: {now.toLocaleString()}</div>
				</div>
                <div className="no-print px-4 pt-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-xl">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Autofill by Mongo Document ID</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-600 mb-1">Enter Mongo ID (_id)</label>
                                <input
                                    name="mongoId"
                                    value={data.mongoId}
                                    onChange={(e) => { setSuccess(''); setError(''); handleChange(e); }}
                                    onBlur={lookupById}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lookupById(); } }}
                                    placeholder="e.g., 68ef8ec..."
                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                    disabled={lookupLoading}
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={lookupById}
                                    disabled={lookupLoading || !data.mongoId?.trim()}
                                    className="w-full px-3 py-1.5 rounded bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {lookupLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Looking up...
                                        </>
                                    ) : 'Autofill'}
                                </button>
                            </div>
                        </div>
                        {success && (
                            <div className="mt-3 bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">{success}</div>
                        )}
                        {error && (
                            <div className="mt-3 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-800">{error}</div>
                        )}
                    </div>
                </div>
                <div className="no-print px-4 py-4">
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitLoading}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Caretaker Charges
                                </>
                            )}
                        </button>
                    </div>
                </div>
				<Page withDashed data={data} onChange={handleChange} />
			</div>
		</div>
	);
};

export default CaretakerChargesForm;


