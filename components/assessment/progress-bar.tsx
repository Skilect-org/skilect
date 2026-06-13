"use client";

import { Fragment } from "react";

interface ProgressBarProps {
  currentStep: number;
  steps: { label: string }[];
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="mb-10">
      {/* Progress label */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">Assessment Progress</p>
        <p className="text-sm font-bold text-blue-600">{progressPercent}%</p>
      </div>

      {/* Thin gradient bar */}
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <Fragment key={index}>
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2.5 min-w-0">
                <div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-blue-600 text-white shadow-sm"
                        : isCurrent
                          ? "border-2 border-blue-600 bg-white text-blue-600 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                          : "border-2 border-gray-200 bg-white text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium text-center leading-tight hidden sm:block ${
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-gray-600"
                        : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center px-1.5 sm:px-3 pt-[18px]">
                  <div
                    className={`h-0.5 w-full rounded-full transition-all duration-500 ${
                      index < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
