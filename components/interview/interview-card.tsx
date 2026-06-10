import { type HTMLAttributes } from "react";

interface InterviewCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  type: "behavioral" | "technical" | "hr";
  duration: string;
  difficulty: "easy" | "medium" | "hard";
  status?: "available" | "completed" | "locked";
}

const typeLabel = {
  behavioral: "Behavioral",
  technical: "Technical",
  hr: "HR Round",
};

const difficultyBadge = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

export function InterviewCard({
  title,
  type,
  duration,
  difficulty,
  status = "available",
  className = "",
  ...props
}: InterviewCardProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-5 transition-shadow hover:shadow-md ${
        status === "locked" ? "opacity-50" : ""
      } ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-foreground/5 px-2 py-1 text-xs font-medium text-foreground/60">
          {typeLabel[type]}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyBadge[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>
      <h4 className="mt-3 text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs text-foreground/50">Duration: {duration}</p>

      {status === "available" && (
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Start Interview
        </button>
      )}
      {status === "completed" && (
        <p className="mt-4 text-center text-xs font-medium text-emerald-600">
          ✓ Completed
        </p>
      )}
      {status === "locked" && (
        <p className="mt-4 text-center text-xs text-foreground/40">
          🔒 Locked
        </p>
      )}
    </div>
  );
}
