import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { dashboardApi } from '../../api/services';
import StatCard from '../../components/common/StatCard';
import SalesChart from '../../components/charts/SalesChart';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await dashboardApi.summary();
        setData(response.data.data);
      } catch (_error) {
        toast.error('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <LoadingSkeleton rows={8} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Customers" value={data.totalCustomers} />
        <StatCard title="Today Milk" value={`${data.todayMilk?.toFixed(2)} L`} accent="from-sky-500 to-blue-500" />
        <StatCard title="Morning Milk" value={`${data.morningMilk?.toFixed(2)} L`} accent="from-amber-500 to-orange-500" />
        <StatCard title="Evening Milk" value={`${data.eveningMilk?.toFixed(2)} L`} accent="from-fuchsia-500 to-rose-500" />
        <StatCard title="Today Income" value={`Rs. ${data.todayIncome?.toFixed(2)}`} accent="from-emerald-500 to-lime-500" />
        <StatCard title="Monthly Income" value={`Rs. ${data.monthIncome?.toFixed(2)}`} accent="from-indigo-500 to-cyan-500" />
        <StatCard title="Paid Customers" value={data.paidCustomers} accent="from-teal-500 to-emerald-500" />
        <StatCard title="Pending Payments" value={`Rs. ${(data.pendingPayments?.pending || 0).toFixed(2)}`} accent="from-rose-500 to-orange-500" />
      </div>

      <SalesChart data={data.charts} />

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-3 text-sm font-semibold">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Customer</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions?.map((item) => (
                <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td className="py-2">{item.customer?.name}</td>
                  <td>{item.month}</td>
                  <td>Rs. {item.paidAmount?.toFixed(2)}</td>
                  <td className="capitalize">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
