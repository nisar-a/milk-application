import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import DailyMilkEntryPage from './pages/admin/DailyMilkEntryPage';
import PaymentManagementPage from './pages/admin/PaymentManagementPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProfilePage from './pages/admin/ProfilePage';
import CustomerBillPage from './pages/admin/CustomerBillPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import CustomerInvoicePage from './pages/customer/CustomerInvoicePage';

const RequireAuth = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={user?.role === 'customer' ? '/customer' : '/'} replace />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/' : '/customer'} /> : <LoginPage />
        }
      />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route
          path="/"
          element={
            <RequireAuth roles={['admin']}>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/customers"
          element={
            <RequireAuth roles={['admin']}>
              <CustomerManagementPage />
            </RequireAuth>
          }
        />
        <Route
          path="/milk-entry"
          element={
            <RequireAuth roles={['admin']}>
              <DailyMilkEntryPage />
            </RequireAuth>
          }
        />
        <Route
          path="/payments"
          element={
            <RequireAuth roles={['admin']}>
              <PaymentManagementPage />
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth roles={['admin']}>
              <ReportsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/billing"
          element={
            <RequireAuth roles={['admin']}>
              <CustomerBillPage />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth roles={['admin']}>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route
          path="/customer"
          element={
            <RequireAuth roles={['customer']}>
              <CustomerDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/customer/bill"
          element={
            <RequireAuth roles={['customer']}>
              <CustomerInvoicePage />
            </RequireAuth>
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/' : '/customer') : '/login'} replace />}
      />
    </Routes>
  );
};

export default App;
