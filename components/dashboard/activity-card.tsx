import { type HTMLAttributes } from "react";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "assessment" | "roadmap" | "task" | "interview" | "resume";
}

interface ActivityCardProps extends HTMLAttributes<HTMLDivElement> {
  activities: Activity[];
}

const typeIcons: Record<Activity["type"], string> = {
  assessment: "📝",
  roadmap: "🗺️",
  task: "✅",
  interview: "🎙️",
  resume: "📄",
};

export function ActivityCard({
  activities,
  className = "",
  ...props
}: ActivityCardProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-6 ${className}`}
      {...props}
    >
      <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
      <div className="mt-4 flex flex-col gap-3">
        {activities.length === 0 && (
          <p className="text-sm text-foreground/50">No recent activity.</p>
        )}
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-foreground/5"
          >
            <span className="mt-0.5 text-lg">
              {typeIcons[activity.type]}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-foreground/50">
                {activity.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-foreground/40">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
