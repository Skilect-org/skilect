const steps = [
  {
    number: "01",
    title: "Take Assessment",
    description:
      "Complete a comprehensive benchmark test to identify your current technical and behavioral baseline.",
  },
  {
    number: "02",
    title: "Get AI Analysis",
    description:
      "Our engine pinpoints exact skill gaps and compares your profile against target role requirements.",
  },
  {
    number: "03",
    title: "Follow Roadmap",
    description:
      "Execute a dynamically generated, day-by-day learning and practice plan tailored to you.",
  },
  {
    number: "04",
    title: "Crack Placements",
    description:
      "Walk into interviews with quantified confidence and secure offers from top-tier tech companies.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Path to Placement
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500">
            A systematic, data-driven approach to mastering the skills top employers demand.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200"
            >
              {/* Number Badge */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 transition-colors group-hover:bg-blue-100">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="mt-8 text-lg font-bold text-gray-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}