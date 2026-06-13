import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

export function AIInsights() {
  const insights = [
    {
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      title: "Strong Improvement",
      desc: "You improved React by 15% this month.",
    },
    {
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      title: "Needs Attention",
      desc: "System Design remains your weakest area in interviews.",
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm min-h-[350px]">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
          <Sparkles size={16} className="text-blue-600" />
        </div>
        <h3 className="text-[15px] font-semibold text-gray-900">AI Insights</h3>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className="flex gap-4 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50/50">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${insight.bg}`}>
                <Icon size={18} className={insight.color} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[13px] font-semibold text-gray-900">{insight.title}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                  {insight.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <h4 className="text-[12px] font-bold uppercase tracking-wider text-blue-800 mb-1">
          Recommended Action
        </h4>
        <p className="text-[13px] font-medium text-blue-900 mb-3">
          Complete a mock System Design Interview focusing on scalability.
        </p>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[13px] font-semibold text-blue-600 shadow-sm transition-all hover:bg-blue-50">
          Start Interview <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
