import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { billingApi, customerApi } from '../../api/services';

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

const CustomerBillPage = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await customerApi.list({ page: 1, limit: 200 });
        setCustomers(data.data);
      } catch (_error) {
        toast.error('Unable to load customers.');
      }
    };

    load();
  }, []);

  const generateBill = async () => {
    if (!customerId) {
      toast.error('Select customer first.');
      return;
    }

    try {
      const { data } = await billingApi.monthly({ customerId, month });
      setBill(data.data);
      toast.success('Bill generated.');
    } catch (_error) {
      toast.error('Unable to generate bill.');
    }
  };

  const exportPdf = async () => {
    const { data } = await billingApi.exportPdf({ customerId, month });
    downloadBlob(data, `invoice-${month}.pdf`);
  };

  const exportExcel = async () => {
    const { data } = await billingApi.exportExcel({ customerId, month });
    downloadBlob(data, `invoice-${month}.xlsx`);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">Customer Bill & Invoice</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select className="rounded-xl border px-3 py-2 dark:bg-slate-800" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Select customer</option>
            {customers.map((item) => <option key={item._id} value={item._id}>{item.name} ({item.customerId})</option>)}
          </select>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border px-3 py-2 dark:bg-slate-800" />
          <button onClick={generateBill} className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white">Generate Bill</button>
          <div className="flex gap-2">
            <button onClick={exportPdf} className="rounded-xl bg-slate-700 px-4 py-2 text-white">PDF</button>
            <button onClick={exportExcel} className="rounded-xl bg-emerald-700 px-4 py-2 text-white">Excel</button>
          </div>
        </div>
      </div>

      {bill ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-base font-semibold">Invoice Summary</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            <div><p className="text-xs text-slate-500">Customer</p><p className="font-medium">{bill.customer.name}</p></div>
            <div><p className="text-xs text-slate-500">Total Litres</p><p className="font-medium">{bill.totalLitres.toFixed(2)} L</p></div>
            <div><p className="text-xs text-slate-500">Total Amount</p><p className="font-medium">Rs. {bill.totalAmount.toFixed(2)}</p></div>
            <div><p className="text-xs text-slate-500">Due</p><p className="font-medium">Rs. {bill.dueAmount.toFixed(2)}</p></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomerBillPage;
