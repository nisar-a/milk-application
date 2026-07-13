import { useState } from 'react';
import toast from 'react-hot-toast';

import { reportApi } from '../../api/services';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('daily');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [report, setReport] = useState(null);

  const loadReport = async () => {
    try {
      let response;

      if (reportType === 'daily') {
        response = await reportApi.daily({ date: new Date().toISOString().slice(0, 10) });
      } else if (reportType === 'weekly') {
        response = await reportApi.weekly();
      } else if (reportType === 'monthly') {
        response = await reportApi.monthly({ month });
      } else {
        response = await reportApi.yearly({ year });
      }

      setReport(response.data.data);
      toast.success(`${reportType} report generated.`);
    } catch (_error) {
      toast.error('Unable to generate report.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">Reports</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="rounded-xl border px-3 py-2 dark:bg-slate-800">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border px-3 py-2 dark:bg-slate-800" />
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="rounded-xl border px-3 py-2 dark:bg-slate-800" />
          <button onClick={loadReport} className="rounded-xl bg-cyan-600 px-4 py-2 font-semibold text-white">Generate</button>
        </div>
      </div>

      {report ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-sm text-slate-500">Total Milk</p>
              <p className="text-2xl font-bold">{report.totals.totalLitres.toFixed(2)} L</p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-sm text-slate-500">Total Income</p>
              <p className="text-2xl font-bold">Rs. {report.totals.totalIncome.toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="mb-2 text-sm font-semibold">Customer-wise Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2">Customer ID</th>
                    <th>Name</th>
                    <th>Total Litres</th>
                    <th>Total Income</th>
                  </tr>
                </thead>
                <tbody>
                  {report.customerWise.map((item) => (
                    <tr key={item.customerId} className="border-t border-slate-200/60 dark:border-slate-700">
                      <td className="py-2">{item.customerId}</td>
                      <td>{item.name}</td>
                      <td>{item.totalLitres.toFixed(2)}</td>
                      <td>{item.totalIncome.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReportsPage;
