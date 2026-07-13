import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      phone: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await authApi.login(values);
      login(data.data.token, data.data.user);
      toast.success('Login successful.');
      navigate(data.data.user.role === 'admin' ? '/' : '/customer');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-app-pattern p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <h1 className="text-2xl font-extrabold">Smart Dairy Login</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Admin and customer access portal</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">
          Use credentials configured in server environment.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-400 focus:ring dark:border-slate-600 dark:bg-slate-800"
              {...register('phone', { required: 'Phone is required' })}
            />
            {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-emerald-400 focus:ring dark:border-slate-600 dark:bg-slate-800"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
