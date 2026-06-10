interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
}

interface RoadmapTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

const statusStyles = {
  completed: {
    dot: "bg-emerald-500",
    line: "bg-emerald-500",
    text: "text-foreground",
  },
  "in-progress": {
    dot: "bg-indigo-500 ring-4 ring-indigo-500/20",
    line: "bg-foreground/10",
    text: "text-foreground",
  },
  upcoming: {
    dot: "bg-foreground/20",
    line: "bg-foreground/10",
    text: "text-foreground/50",
  },
};

export function RoadmapTimeline({ steps, className = "" }: RoadmapTimelineProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {steps.map((step, index) => {
        const styles = statusStyles[step.status];
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`h-3 w-3 shrink-0 rounded-full ${styles.dot}`}
              />
              {!isLast && (
                <div className={`w-0.5 flex-1 ${styles.line}`} />
              )}
            </div>

            {/* Content */}
            <div className="-mt-0.5 flex-1">
              <p className={`text-sm font-medium ${styles.text}`}>
                {step.title}
              </p>
              <p className="mt-0.5 text-xs text-foreground/50">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
