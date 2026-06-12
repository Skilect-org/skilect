interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed?: boolean;
}

export function NavigationButtons({
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
  canProceed = true,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
      {/* Previous */}
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 active:bg-gray-100"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Previous
        </button>
      ) : (
        <div />
      )}

      {/* Next / Submit */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className={`
          inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium shadow-sm transition-all
          ${
            isLastStep
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-md active:from-blue-800 active:to-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
          }
        `}
      >
        {isLastStep ? (
          <>
            Submit Assessment
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </>
        ) : (
          <>
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
