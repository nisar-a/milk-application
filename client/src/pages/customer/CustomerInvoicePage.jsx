import { useState } from 'react';
import toast from 'react-hot-toast';

import { billingApi } from '../../api/services';

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};

const CustomerInvoicePage = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [bill, setBill] = useState(null);

  const generate = async () => {
    try {
      const { data } = await billingApi.monthly({ month });
      setBill(data.data);
      toast.success('Monthly bill loaded.');
    } catch (_error) {
      toast.error('Unable to load bill.');
    }
  };

  const exportPdf = async () => {
    const { data } = await billingApi.exportPdf({ month });
    downloadBlob(data, `my-invoice-${month}.pdf`);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">My Invoice</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border px-3 py-2 dark:bg-slate-800" />
          <button onClick={generate} className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white">View Bill</button>
          <button onClick={exportPdf} className="rounded-xl bg-slate-700 px-4 py-2 text-white">Download PDF</button>
        </div>
      </div>

      {bill ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="text-sm text-slate-500">Customer</p>
          <p className="font-semibold">{bill.customer.name}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div><p className="text-xs text-slate-500">Total Litres</p><p>{bill.totalLitres.toFixed(2)} L</p></div>
            <div><p className="text-xs text-slate-500">Total Amount</p><p>Rs. {bill.totalAmount.toFixed(2)}</p></div>
            <div><p className="text-xs text-slate-500">Due Amount</p><p>Rs. {bill.dueAmount.toFixed(2)}</p></div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomerInvoicePage;
