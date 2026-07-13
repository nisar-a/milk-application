const StatCard = ({ title, value, accent = 'from-emerald-500 to-cyan-500', helper }) => {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className={`mt-3 bg-gradient-to-r ${accent} bg-clip-text text-2xl font-bold text-transparent`}>
        {value}
      </p>
      {helper ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
};

export default StatCard;
