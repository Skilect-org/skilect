import { type ReactNode } from "react";

interface TaskListProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TaskList({ title, children, className = "" }: TaskListProps) {
  return (
    <div className={className}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold tracking-tight">{title}</h3>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
