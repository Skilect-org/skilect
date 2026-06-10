interface HistoryEntry {
  id: string;
  title: string;
  type: "behavioral" | "technical" | "hr";
  score: number;
  date: string;
}

interface InterviewHistoryProps {
  entries: HistoryEntry[];
  className?: string;
}

const typeIcons = {
  behavioral: "💬",
  technical: "💻",
  hr: "🤝",
};

export function InterviewHistory({
  entries,
  className = "",
}: InterviewHistoryProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold tracking-tight">
        Interview History
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {entries.length === 0 && (
          <p className="text-sm text-foreground/50">
            No interview sessions yet.
          </p>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-foreground/5"
          >
            <span className="text-lg">{typeIcons[entry.type]}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{entry.title}</p>
              <p className="text-xs text-foreground/50">{entry.date}</p>
            </div>
            <span className="text-sm font-semibold text-indigo-600">
              {entry.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
