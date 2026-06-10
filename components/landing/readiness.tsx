export default function Readiness() {
  return (
    <section id="readiness" className="bg-[#f8f9fc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          
          {/* Left: Circular Progress */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-3xl bg-white shadow-xl shadow-blue-900/5 flex items-center justify-center">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-3xl bg-blue-100 opacity-50 blur-2xl" />
              
              {/* SVG Ring */}
              <div className="relative h-40 w-40 md:h-48 md:w-48">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle
                    className="text-gray-100 stroke-current"
                    strokeWidth="8"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  {/* Progress arc (85%) */}
                  <circle
                    className="text-blue-600 stroke-current drop-shadow-md"
                    strokeWidth="8"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="37.68" /* 15% of 251.2 */
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl md:text-4xl font-extrabold text-blue-600">85%</span>
                </div>
              </div>
              
              {/* Fake shadow at bottom */}
              <div className="absolute -bottom-4 w-3/4 h-8 bg-blue-900/10 blur-xl rounded-[100%]" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 mb-4">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                The Skilect Standard
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Know Exactly When You're Ready to Apply.
              </h2>
            </div>
            
            <p className="text-base leading-7 text-gray-600">
              The Skilect Readiness Score aggregates data from your assessments, task completion, and mock interviews to provide a single, actionable metric. Stop relying on feeling ready, and start relying on hard data.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Benchmarked against thousands of successful candidates.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Role-specific scoring (SDE, Data Analyst, Product Manager).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Predicts likelihood of interview success accurately.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
