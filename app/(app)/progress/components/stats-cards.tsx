import { CheckSquare, Mic, Map, Flame } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      label: "Tasks Completed",
      value: "142",
      trend: "+12 this week",
      icon: CheckSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Interviews",
      value: "12",
      trend: "+2 this week",
      icon: Mic,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Roadmap",
      value: "68%",
      trend: "On track",
      icon: Map,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Current Streak",
      value: "7 Days",
      trend: "Personal best!",
      icon: Flame,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon size={18} className={stat.color} />
              </div>
            </div>
            <h3 className="text-[13px] font-medium text-gray-500">{stat.label}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-gray-400">{stat.trend}</p>
          </div>
        );
      })}
    </div>
  );
}
