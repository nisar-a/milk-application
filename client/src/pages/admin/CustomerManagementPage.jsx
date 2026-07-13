import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { authApi, customerApi } from '../../api/services';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const initialFilters = { page: 1, limit: 10, search: '', status: '' };

const CustomerManagementPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await customerApi.list(filters);
      setCustomers(data.data);
      setPagination(data.pagination);
    } catch (_error) {
      toast.error('Unable to fetch customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters.page, filters.search, filters.status]);

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await customerApi.update(editing._id, values);
        toast.success('Customer updated.');
      } else {
        await customerApi.create(values);
        toast.success('Customer added.');
      }

      reset();
      setEditing(null);
      fetchCustomers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save customer.');
    }
  };

  const onEdit = (item) => {
    setEditing(item);
    reset(item);
  };

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this customer?');

    if (!ok) {
      return;
    }

    try {
      await customerApi.remove(id);
      toast.success('Customer deleted.');
      fetchCustomers();
    } catch (_error) {
      toast.error('Unable to delete customer.');
    }
  };

  const onCreateCustomerLogin = async (customer) => {
    const password = window.prompt(`Set login password for ${customer.name} (${customer.customerId})`);

    if (!password) {
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      await authApi.createCustomerLogin({
        customerId: customer.customerId,
        password
      });
      toast.success('Customer login created successfully.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create customer login.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Customer Management</h2>
          <p className="text-sm text-slate-500">Add, edit, delete, search and filter customers.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, search: e.target.value }))}
              placeholder="Search name, phone, customer ID"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, page: 1, status: e.target.value }))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <form className="grid gap-2 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Customer ID" className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('customerId', { required: true })} />
          <input placeholder="Name" className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('name', { required: true })} />
          <input placeholder="Mobile Number" className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('mobileNumber', { required: true })} />
          <input placeholder="Address" className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('address', { required: true })} />
          <select className="rounded-xl border px-3 py-2 dark:bg-slate-800" {...register('status')}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">{editing ? 'Update' : 'Add'} Customer</button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/60">
        {loading ? (
          <LoadingSkeleton rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2">Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((item) => (
                  <tr key={item._id} className="border-t border-slate-200/60 dark:border-slate-700">
                    <td className="py-2">{item.customerId}</td>
                    <td>{item.name}</td>
                    <td>{item.mobileNumber}</td>
                    <td className="capitalize">{item.status}</td>
                    <td className="space-x-2">
                      <button type="button" onClick={() => onEdit(item)} className="rounded bg-sky-600 px-2 py-1 text-xs text-white">Edit</button>
                      <button type="button" onClick={() => onDelete(item._id)} className="rounded bg-rose-600 px-2 py-1 text-xs text-white">Delete</button>
                      <button type="button" onClick={() => onCreateCustomerLogin(item)} className="rounded bg-violet-700 px-2 py-1 text-xs text-white">Create Login</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            disabled={filters.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Prev
          </button>
          <span className="px-2 py-1 text-sm">{pagination.page} / {pagination.totalPages}</span>
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementPage;
