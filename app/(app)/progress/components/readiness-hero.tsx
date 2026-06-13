import { Target, TrendingUp, Award, Clock } from "lucide-react";

export function ReadinessHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 blur-3xl opacity-60"></div>
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Score Section */}
        <div className="flex flex-col">
          <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Placement Readiness Score
          </h2>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              85<span className="text-4xl text-blue-400">%</span>
            </span>
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
              <TrendingUp size={12} />
              +5% this week
            </div>
          </div>
          <p className="mt-3 text-[14px] text-gray-600 max-w-sm leading-relaxed">
            You are highly competitive for <strong className="text-gray-900">Software Engineer</strong> roles. Keep focusing on System Design.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Award size={14} className="text-amber-500" />
              <span className="text-[11px] font-medium uppercase">Current Level</span>
            </div>
            <span className="text-[15px] font-bold text-gray-900">Advanced</span>
          </div>
          
          <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Target size={14} className="text-blue-500" />
              <span className="text-[11px] font-medium uppercase">Target Role</span>
            </div>
            <span className="text-[15px] font-bold text-gray-900">SDE</span>
          </div>

          <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/50 p-4 col-span-2">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock size={14} className="text-emerald-500" />
              <span className="text-[11px] font-medium uppercase">Estimated Readiness</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900">Interview Ready</span>
              <div className="flex gap-1">
                <div className="h-2 w-8 rounded-full bg-emerald-500"></div>
                <div className="h-2 w-8 rounded-full bg-emerald-500"></div>
                <div className="h-2 w-8 rounded-full bg-emerald-500"></div>
                <div className="h-2 w-8 rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
