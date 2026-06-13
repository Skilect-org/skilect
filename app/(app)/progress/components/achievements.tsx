import { Medal, CheckCircle2, Flame, Map, Mic, Star } from "lucide-react";

export function Achievements() {
  const achievements = [
    {
      title: "First Assessment",
      desc: "Completed diagnostic",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      unlocked: true,
    },
    {
      title: "7 Day Streak",
      desc: "Practiced consistently",
      icon: Flame,
      color: "text-amber-500",
      bg: "bg-amber-50",
      unlocked: true,
    },
    {
      title: "Resume Master",
      desc: "Scored 85+ on Resume",
      icon: Star,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      unlocked: true,
    },
    {
      title: "First Interview",
      desc: "Completed a mock session",
      icon: Mic,
      color: "text-violet-500",
      bg: "bg-violet-50",
      unlocked: true,
    },
    {
      title: "10 Tasks Completed",
      desc: "Finished 10 roadmap tasks",
      icon: Map,
      color: "text-gray-400",
      bg: "bg-gray-100",
      unlocked: false,
    },
    {
      title: "Consistency Champ",
      desc: "14 Day Streak",
      icon: Medal,
      color: "text-gray-400",
      bg: "bg-gray-100",
      unlocked: false,
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold text-gray-900">Achievements</h3>
        <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
          4 / 6 Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((item, i) => {
          const Icon = item.icon;
          return (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all ${
                item.unlocked 
                  ? "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm" 
                  : "border-gray-100 bg-gray-50/50 opacity-60 grayscale"
              }`}
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${item.bg}`}>
                <Icon size={20} className={item.color} />
              </div>
              <h4 className={`text-[13px] font-bold ${item.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                {item.title}
              </h4>
              <p className="mt-1 text-[11px] font-medium text-gray-500">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
