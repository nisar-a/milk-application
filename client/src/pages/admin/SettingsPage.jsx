import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { priceApi } from '../../api/services';

const SettingsPage = () => {
  const [price, setPrice] = useState(40);
  const [history, setHistory] = useState([]);

  const load = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([priceApi.current(), priceApi.history()]);
      setPrice(currentRes.data.data.pricePerLitre);
      setHistory(historyRes.data.data);
    } catch (_error) {
      toast.error('Unable to load price settings.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updatePrice = async () => {
    try {
      await priceApi.update({ pricePerLitre: Number(price) });
      toast.success('Milk price updated for future entries.');
      load();
    } catch (_error) {
      toast.error('Unable to update price.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">Milk Price Management</h2>
        <p className="text-sm text-slate-500">Updated prices only affect new milk entries.</p>
        <div className="mt-3 flex max-w-md gap-3">
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border px-3 py-2 dark:bg-slate-800" />
          <button onClick={updatePrice} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Update Price</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-2 text-sm font-semibold">Price History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Effective From</th><th>Price/Litre</th></tr></thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td className="py-2">{new Date(item.effectiveFrom).toLocaleDateString()}</td>
                  <td>Rs. {item.pricePerLitre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
