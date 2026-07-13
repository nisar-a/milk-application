import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { billingApi, milkApi, paymentApi } from '../../api/services';
import StatCard from '../../components/common/StatCard';

const CustomerDashboardPage = () => {
  const [bill, setBill] = useState(null);
  const [entries, setEntries] = useState([]);
  const [payments, setPayments] = useState([]);
  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const load = async () => {
      try {
        const [billRes, entryRes, paymentRes] = await Promise.all([
          billingApi.monthly({ month }),
          milkApi.list(),
          paymentApi.list({ month })
        ]);

        setBill(billRes.data.data);
        setEntries(entryRes.data.data);
        setPayments(paymentRes.data.data);
      } catch (_error) {
        toast.error('Unable to load customer dashboard.');
      }
    };

    load();
  }, [month]);

  if (!bill) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="This Month Milk" value={`${bill.totalLitres.toFixed(2)} L`} />
        <StatCard title="This Month Bill" value={`Rs. ${bill.totalAmount.toFixed(2)}`} accent="from-indigo-500 to-cyan-500" />
        <StatCard title="Paid" value={`Rs. ${bill.paidAmount.toFixed(2)}`} accent="from-emerald-500 to-lime-500" />
        <StatCard title="Due" value={`Rs. ${bill.dueAmount.toFixed(2)}`} accent="from-rose-500 to-orange-500" />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-2 text-sm font-semibold">Recent Milk Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Date</th><th>Morning</th><th>Evening</th><th>Total</th><th>Amount</th></tr></thead>
            <tbody>
              {entries.slice(0, 15).map((item) => (
                <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.morningMilk}</td>
                  <td>{item.eveningMilk}</td>
                  <td>{item.totalLitres}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-2 text-sm font-semibold">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Date</th><th>Month</th><th>Amount</th><th>Status</th><th>Method</th></tr></thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td className="py-2">{new Date(item.paymentDate).toLocaleDateString()}</td>
                  <td>{item.month}</td>
                  <td>{item.paidAmount}</td>
                  <td className="capitalize">{item.status}</td>
                  <td className="capitalize">{item.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
