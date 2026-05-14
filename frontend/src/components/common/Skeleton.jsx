const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
    </div>
    <Skeleton className="h-3 w-2/3" />
    <Skeleton className="h-9 w-full rounded-xl mt-2" />
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-3" style={{ opacity: 1 - i * 0.15 }}>
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-10 flex-1 rounded-lg" />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
