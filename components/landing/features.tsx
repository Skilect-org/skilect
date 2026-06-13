
export default function Features() {
  return (
    <section id="features" className="bg-[#f8f9fc] py-24 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Enterprise-Grade Preparation Tools
          </h2>
          <p className="mx-auto mt-4 text-base leading-7 text-gray-500">
            Everything you need to level up, built into one cohesive, distraction-free environment.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Row: Two wide/tall cards */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col relative group hover:border-blue-200 transition-colors">
            <div className="p-8 pb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Dynamic AI Roadmaps</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md">
                Stop guessing what to study. Skilect generates adaptive curriculum paths that evolve as you improve, ensuring every concept is solid before you move on.
              </p>
            </div>
            {/* Mockup Image Area */}
            <div className="mt-8 relative h-[300px] w-full bg-[#1c222b] rounded-tr-xl ml-8 border-t border-l border-gray-800 flex justify-end items-end overflow-hidden">
              {/* Pseudo-dashboard UI */}
              <div className="absolute right-0 bottom-0 w-[90%] h-[90%] rounded-tl-xl bg-[#232b36] border-t border-l border-gray-700 p-4 opacity-80 transform rotate-[-2deg] origin-bottom-right">
                <div className="w-full h-8 flex gap-2 mb-4">
                   <div className="h-2 w-16 bg-gray-600 rounded-full" />
                   <div className="h-2 w-12 bg-gray-600 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-[#1c222b] rounded-lg border border-gray-700" />
                  <div className="h-24 bg-[#1c222b] rounded-lg border border-gray-700" />
                  <div className="h-24 bg-[#1c222b] rounded-lg border border-gray-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col group hover:border-blue-200 transition-colors">
            <div className="p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Task Management</h3>
              <p className="mt-2 text-sm text-gray-500">
                Break down monumental goals into actionable daily tasks integrated directly with your IDE.
              </p>
            </div>
            <div className="mt-auto px-8 pb-0 h-[250px]">
              <div className="w-full h-full bg-[#1c222b] rounded-t-xl border-x border-t border-gray-800 p-4">
                 <div className="flex flex-col gap-3">
                   <div className="h-3 w-1/3 bg-gray-700 rounded-full" />
                   <div className="h-8 w-full bg-blue-600/20 border border-blue-500/30 rounded-md" />
                   <div className="h-8 w-full bg-gray-800 rounded-md" />
                   <div className="h-8 w-full bg-gray-800 rounded-md" />
                 </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Three equal cards */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col group hover:border-blue-200 transition-colors">
            <div className="p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Resume ATS Parsing</h3>
              <p className="mt-2 text-sm text-gray-500">
                Instantly score your resume against target job descriptions to ensure you pass the initial screen.
              </p>
            </div>
            {/* Mobile Mockup */}
            <div className="mt-auto h-[200px] w-full bg-gray-50 flex justify-center items-end overflow-hidden pt-8">
              <div className="relative w-[140px] h-[220px] bg-gray-900 rounded-t-3xl border-x-4 border-t-4 border-gray-900 overflow-hidden shadow-xl">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-gray-900 rounded-b-xl z-10" />
                 <div className="w-full h-full bg-white p-2">
                   <div className="w-full h-24 bg-blue-50 rounded-lg mb-2 flex items-center justify-center text-blue-200 text-xs font-bold">Resume</div>
                   <div className="w-3/4 h-2 bg-gray-200 rounded-full mb-2" />
                   <div className="w-full h-1 bg-gray-100 rounded-full mb-1" />
                   <div className="w-5/6 h-1 bg-gray-100 rounded-full mb-1" />
                 </div>
                 <div className="absolute inset-0 bg-blue-500 mix-blend-color opacity-20" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 group hover:border-blue-200 transition-colors">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI Mock Interviews</h3>
              <p className="mt-2 text-sm text-gray-500">
                Practice behavioral and technical rounds with our specialized AI persona, complete with instant feedback.
              </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 group hover:border-blue-200 transition-colors">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Granular Analytics</h3>
              <p className="mt-2 text-sm text-gray-500">
                Track your proficiency across hundreds of micro-skills. Know exactly where you stand before applying.
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}
