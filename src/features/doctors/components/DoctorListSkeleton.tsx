// Grey placeholder cards shown while doctors load.
export default function DoctorListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-2xl bg-surface" />
      ))}
    </div>
  );
}
