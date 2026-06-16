import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-4 lg:px-6 lg:py-5">
      {/* ── Page Header Skeleton ─────────────────────────────────── */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* ── Stats / Top Row Skeleton ─────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex flex-col justify-between h-[120px]">
            <Skeleton className="h-4 w-24" />
            <div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Skeleton ────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
