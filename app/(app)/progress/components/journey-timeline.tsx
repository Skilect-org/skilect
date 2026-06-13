import { Check, CheckCircle2, Circle, Target, Rocket } from "lucide-react";

export function JourneyTimeline() {
  const milestones = [
    {
      title: "Assessment Completed",
      desc: "Initial skills diagnostic",
      date: "Oct 1",
      status: "completed",
    },
    {
      title: "Resume Analyzed",
      desc: "Scored 85/100",
      date: "Oct 3",
      status: "completed",
    },
    {
      title: "Roadmap Generated",
      desc: "Custom SDE path",
      date: "Oct 5",
      status: "completed",
    },
    {
      title: "Roadmap Progress",
      desc: "68% Complete",
      date: "Ongoing",
      status: "current",
    },
    {
      title: "Interview Completed",
      desc: "12 Mock sessions",
      date: "Ongoing",
      status: "current",
    },
    {
      title: "Placement Ready",
      desc: "Target readiness 95%",
      date: "Pending",
      status: "pending",
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[16px] font-bold text-gray-900">Placement Journey</h3>
        <Rocket size={18} className="text-gray-400" />
      </div>

      <div className="relative pl-3">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-2 bottom-6 w-0.5 bg-gray-100"></div>

        <div className="flex flex-col gap-6">
          {milestones.map((m, i) => (
            <div key={i} className="relative flex gap-5">
              <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                {m.status === "completed" ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : m.status === "current" ? (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                  </div>
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                    <Circle size={8} className="text-gray-300" fill="currentColor" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col pt-1.5 pb-2">
                <div className="flex items-center gap-3">
                  <h4 className={`text-[14px] font-semibold ${
                    m.status === "pending" ? "text-gray-400" : "text-gray-900"
                  }`}>
                    {m.title}
                  </h4>
                  <span className="text-[11px] font-medium text-gray-400">{m.date}</span>
                </div>
                <p className={`mt-1 text-[13px] ${
                  m.status === "pending" ? "text-gray-400" : "text-gray-500"
                }`}>
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg shadow-blue-500/25">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <Target size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[14px] font-bold">Goal: Offer</h4>
            <p className="mt-1 text-[13px] text-blue-100 font-medium leading-relaxed">
              You are 85% of the way to becoming interview-ready for an SDE role. Keep pushing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
