export function TicketSkeleton() {
  return (
    <>
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-[32px]" />
      ))}
    </>
  );
}
