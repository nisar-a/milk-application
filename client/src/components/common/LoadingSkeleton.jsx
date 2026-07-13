const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 rounded-lg bg-slate-200/80 dark:bg-slate-700/60" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
