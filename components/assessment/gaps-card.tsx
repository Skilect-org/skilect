interface Gap {
  skill: string;
  priority: "high" | "medium" | "low";
  description: string;
}

interface GapsCardProps {
  gaps: Gap[];
}

const priorityStyles = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-gray-50 text-gray-500 border-gray-100",
} as const;

export function GapsCard({ gaps }: GapsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
          <svg
            className="w-4.5 h-4.5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Skill Gaps</h3>
          <p className="text-[11px] text-gray-400">
            Areas to improve for your goal
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {gaps.map((g) => (
          <div
            key={g.skill}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 transition-colors hover:bg-gray-50"
          >
            {/* X icon */}
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500 mt-0.5">
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gray-900">{g.skill}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[g.priority]}`}
                >
                  {g.priority}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {g.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
