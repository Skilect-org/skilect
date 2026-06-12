interface QuestionCardProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function QuestionCard({
  stepNumber,
  totalSteps,
  title,
  description,
  children,
}: QuestionCardProps) {
  return (
    <div className="assessment-step-enter rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        {/* Step badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 mb-5">
          <span>Step {stepNumber}</span>
          <span className="text-blue-300">of</span>
          <span>{totalSteps}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-gray-500 max-w-lg">
          {description}
        </p>

        {/* Content */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
