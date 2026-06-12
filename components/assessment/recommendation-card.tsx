interface RecommendationCardProps {
  title: string;
  match: number;
  description: string;
  nextSteps: string[];
}

export function RecommendationCard({
  title,
  match,
  description,
  nextSteps,
}: RecommendationCardProps) {
  return (
    <div className="relative rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/60 p-6 sm:p-8 shadow-sm overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-bl-full -z-0" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
            <svg
              className="w-4.5 h-4.5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            Recommended Career Path
          </h3>
        </div>

        {/* Title + Match */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <h4 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h4>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            {match}% Match
          </span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mb-8">
          {description}
        </p>

        {/* Next Steps */}
        <div>
          <h5 className="text-sm font-semibold text-gray-700 mb-4">
            Recommended Next Steps
          </h5>
          <div className="grid gap-3 sm:grid-cols-2">
            {nextSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-white/70 border border-blue-100/60 p-3.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
