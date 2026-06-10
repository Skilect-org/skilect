import { type HTMLAttributes } from "react";

interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const statusBadge = {
  todo: "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const statusLabel = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
};

const priorityDot = {
  low: "bg-gray-400",
  medium: "bg-amber-400",
  high: "bg-red-500",
};

export function TaskCard({
  title,
  description,
  status,
  priority,
  dueDate,
  className = "",
  ...props
}: TaskCardProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-4 transition-shadow hover:shadow-md ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${priorityDot[priority]}`}
            title={`${priority} priority`}
          />
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>
      <p className="mt-2 text-xs text-foreground/50">{description}</p>
      {dueDate && (
        <p className="mt-3 text-xs text-foreground/40">Due: {dueDate}</p>
      )}
    </div>
  );
}
