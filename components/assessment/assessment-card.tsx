import { type HTMLAttributes } from "react";

interface AssessmentCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status?: "available" | "completed" | "locked";
  score?: number;
}

const difficultyBadge = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

export function AssessmentCard({
  title,
  description,
  questionCount,
  duration,
  difficulty,
  status = "available",
  score,
  className = "",
  ...props
}: AssessmentCardProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-5 transition-shadow hover:shadow-md ${
        status === "locked" ? "opacity-50" : ""
      } ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyBadge[difficulty]}`}
        >
          {difficulty}
        </span>
        {status === "completed" && score !== undefined && (
          <span className="text-sm font-semibold text-indigo-600">
            {score}%
          </span>
        )}
      </div>

      <h4 className="mt-3 text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs text-foreground/50">{description}</p>

      <div className="mt-3 flex items-center gap-3 text-xs text-foreground/40">
        <span>{questionCount} questions</span>
        <span>•</span>
        <span>{duration}</span>
      </div>

      {status === "available" && (
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Start Assessment
        </button>
      )}
      {status === "completed" && (
        <p className="mt-4 text-center text-xs font-medium text-emerald-600">
          ✓ Completed
        </p>
      )}
      {status === "locked" && (
        <p className="mt-4 text-center text-xs text-foreground/40">
          🔒 Complete prerequisites first
        </p>
      )}
    </div>
  );
}
