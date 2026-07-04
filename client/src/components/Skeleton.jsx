function Block({ className }) {
  return <div className={`animate-pulse rounded-lg bg-surface-high ${className}`} />;
}

export default function Skeleton({ compare = false }) {
  if (compare) {
    return (
      <div className="mt-10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Block className="h-44" />
          <Block className="h-44" />
        </div>
        <Block className="h-72" />
        <Block className="h-56" />
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-5">
      <Block className="h-32" />
      <Block className="h-44" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Block className="h-80" />
        <Block className="h-80" />
      </div>
      <Block className="h-64" />
    </div>
  );
}
