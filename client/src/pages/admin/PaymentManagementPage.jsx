import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { customerApi, paymentApi } from '../../api/services';

const PaymentManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      paymentMethod: 'cash'
    }
  });

  const load = async () => {
    try {
      const [customerRes, paymentRes] = await Promise.all([
        customerApi.list({ page: 1, limit: 200 }),
        paymentApi.list()
      ]);
      setCustomers(customerRes.data.data);
      setPayments(paymentRes.data.data);
    } catch (_error) {
      toast.error('Unable to load payment data.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    try {
      await paymentApi.create({
        ...values,
        paidAmount: Number(values.paidAmount)
      });
      toast.success('Payment recorded.');
      reset({ month: values.month, paymentMethod: values.paymentMethod });
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save payment.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h2 className="text-lg font-semibold">Payment Management</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 md:grid-cols-5">
          <select className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('customerId', { required: true })}>
            <option value="">Select customer</option>
            {customers.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
          <input type="month" className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('month', { required: true })} />
          <input type="number" step="0.01" className="rounded-xl border px-3 py-2 dark:bg-slate-800" placeholder="Paid Amount" {...register('paidAmount', { required: true })} />
          <select className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('paymentMethod')}>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Add Payment</button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="mb-2 text-sm font-semibold">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Date</th>
                <th>Customer</th>
                <th>Month</th>
                <th>Billed</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td className="py-2">{new Date(item.paymentDate).toLocaleDateString()}</td>
                  <td>{item.customer?.name}</td>
                  <td>{item.month}</td>
                  <td>{item.billedAmount}</td>
                  <td>{item.paidAmount}</td>
                  <td className="capitalize">{item.status}</td>
                  <td className="capitalize">{item.paymentMethod.replace('-', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagementPage;
