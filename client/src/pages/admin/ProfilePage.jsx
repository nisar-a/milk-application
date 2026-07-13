import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-900/60">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">Name</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Phone</p>
          <p className="font-medium">{user?.phone}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Role</p>
          <p className="font-medium capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
