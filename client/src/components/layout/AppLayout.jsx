import { NavLink, Outlet } from 'react-router-dom';
import { FaChartLine, FaCog, FaFileInvoice, FaMoneyBillWave, FaMoon, FaSun, FaTint, FaUsers } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/', label: 'Dashboard', icon: FaChartLine },
  { to: '/customers', label: 'Customers', icon: FaUsers },
  { to: '/milk-entry', label: 'Daily Milk Entry', icon: FaTint },
  { to: '/payments', label: 'Payments', icon: FaMoneyBillWave },
  { to: '/reports', label: 'Reports', icon: FaChartLine },
  { to: '/billing', label: 'Customer Bill', icon: FaFileInvoice },
  { to: '/settings', label: 'Settings', icon: FaCog }
];

const customerLinks = [
  { to: '/customer', label: 'My Dashboard', icon: FaChartLine },
  { to: '/customer/bill', label: 'My Bill', icon: FaFileInvoice }
];

const AppLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <div className="min-h-screen bg-app-pattern text-slate-800 transition-colors dark:text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200/70 bg-white/70 p-6 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-8">
            <h1 className="text-xl font-extrabold tracking-tight">Smart Dairy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">Milk Management System</p>
          </div>

          <nav className="space-y-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-700/50'
                    }`
                  }
                >
                  <Icon />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="p-4 md:p-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/70 px-5 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
              >
                {theme === 'light' ? <FaMoon className="inline" /> : <FaSun className="inline" />} Theme
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white"
              >
                Logout
              </button>
            </div>
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
