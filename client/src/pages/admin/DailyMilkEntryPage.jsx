import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { customerApi, milkApi, priceApi } from '../../api/services';

const DailyMilkEntryPage = () => {
  const [customers, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(40);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      morningMilk: 0,
      eveningMilk: 0
    }
  });

  const load = async () => {
    try {
      const [customerRes, entryRes, priceRes] = await Promise.all([
        customerApi.list({ page: 1, limit: 200 }),
        milkApi.list(),
        priceApi.current()
      ]);

      setCustomers(customerRes.data.data);
      setEntries(entryRes.data.data);
      setCurrentPrice(priceRes.data.data.pricePerLitre);
    } catch (_error) {
      toast.error('Failed to load milk entry data.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    try {
      await milkApi.upsert(values);
      toast.success('Milk entry saved.');
      reset({ customerId: values.customerId, morningMilk: 0, eveningMilk: 0 });
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save entry.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">Daily Milk Entry</h2>
        <p className="text-sm text-slate-500">Current price: Rs. {currentPrice}/L</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 md:grid-cols-5">
          <select className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('customerId', { required: true })}>
            <option value="">Select customer</option>
            {customers.map((item) => <option key={item._id} value={item._id}>{item.name} ({item.customerId})</option>)}
          </select>
          <input type="number" step="0.01" className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Morning" {...register('morningMilk', { valueAsNumber: true })} />
          <input type="number" step="0.01" className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Evening" {...register('eveningMilk', { valueAsNumber: true })} />
          <input type="date" className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('date')} />
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Save Entry</button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-2 text-sm font-semibold">Recent Entries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Date</th>
                <th>Customer</th>
                <th>Morning</th>
                <th>Evening</th>
                <th>Total</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 30).map((item) => (
                <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.customer?.name}</td>
                  <td>{item.morningMilk}</td>
                  <td>{item.eveningMilk}</td>
                  <td>{item.totalLitres}</td>
                  <td>{item.ratePerLitre}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyMilkEntryPage;
