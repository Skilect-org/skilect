import { type HTMLAttributes } from "react";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: { value: number; positive: boolean };
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className = "",
  ...props
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-foreground/10 bg-background p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground/60">{title}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {(description || trend) && (
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.positive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-foreground/50">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
