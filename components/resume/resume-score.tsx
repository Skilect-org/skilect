interface ResumeScoreProps {
  score: number;
  maxScore?: number;
  suggestions?: string[];
  className?: string;
}

export function ResumeScore({
  score,
  maxScore = 100,
  suggestions = [],
  className = "",
}: ResumeScoreProps) {
  const percentage = Math.round((score / maxScore) * 100);
  const scoreColor =
    percentage >= 80
      ? "text-emerald-600"
      : percentage >= 50
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold tracking-tight">Resume Score</h3>

      <div className="mt-4 flex items-center gap-6">
        {/* Score circle */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-foreground/10">
          <span className={`text-2xl font-bold ${scoreColor}`}>
            {score}
          </span>
        </div>

        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-foreground/50">
            {score} / {maxScore} points
          </p>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 border-t border-foreground/10 pt-4">
          <p className="text-sm font-medium">Suggestions</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-foreground/60"
              >
                <span className="mt-0.5 text-amber-500">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
