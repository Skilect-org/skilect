import { type HTMLAttributes } from "react";

interface RoadmapCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
}

export function RoadmapCard({
  title,
  description,
  progress,
  totalSteps,
  completedSteps,
  className = "",
  ...props
}: RoadmapCardProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-6 transition-shadow hover:shadow-md ${className}`}
      {...props}
    >
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-foreground/60">{description}</p>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground/50">
            {completedSteps}/{totalSteps} steps
          </span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
