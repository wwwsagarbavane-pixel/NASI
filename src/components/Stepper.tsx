import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  number: string;
  name: string;
  shortName: string;
}

interface StepperProps {
  currentStep: number;
  steps: StepItem[];
  onStepClick?: (stepId: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick }) => {
  const currentStepObj = steps.find((s) => s.id === currentStep) || steps[0];
  const progressPercent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-3.5 sm:py-4 shadow-xs sticky top-16 z-20 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop / Tablet Horizontal Stepper (01 to 08) */}
        <div className="hidden lg:block overflow-x-auto pb-1">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between min-w-[800px] relative">
              {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isClickable = step.id < currentStep && onStepClick;

                return (
                  <li key={step.id} className="relative flex-1 flex flex-col items-center">
                    
                    {/* Connecting line */}
                    {index !== steps.length - 1 && (
                      <div
                        className="absolute top-4 left-1/2 w-full h-[2px] -translate-y-1/2 z-0"
                        aria-hidden="true"
                      >
                        <div
                          className={`h-full transition-all duration-300 ${
                            step.id < currentStep ? 'bg-brand-600' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                    )}

                    {/* Step circle */}
                    <button
                      type="button"
                      disabled={!isClickable}
                      onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                      className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all duration-200 ${
                        isCompleted
                          ? 'bg-brand-600 text-white shadow-xs ring-2 ring-brand-100 hover:bg-brand-700 cursor-pointer'
                          : isCurrent
                          ? 'bg-slate-900 text-white shadow-sm ring-4 ring-slate-100 scale-105'
                          : 'bg-white border border-slate-200 text-slate-400 cursor-default'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white stroke-[2.5]" />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </button>

                    {/* Step label */}
                    <div className="mt-1.5 text-center px-1">
                      <p
                        className={`text-[11px] tracking-tight whitespace-nowrap transition-colors duration-150 ${
                          isCurrent
                            ? 'text-slate-900 font-bold'
                            : isCompleted
                            ? 'text-brand-700 font-semibold'
                            : 'text-slate-400 font-medium'
                        }`}
                      >
                        {step.shortName}
                      </p>
                    </div>

                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Medium Screen Stepper for Tablets */}
        <div className="hidden sm:flex lg:hidden items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              {currentStepObj.number}
            </span>
            <div>
              <span className="text-xs font-bold text-slate-900">
                Step {currentStep} of {steps.length}: {currentStepObj.name}
              </span>
              <span className="text-[11px] text-slate-400 block font-medium">
                {progressPercent}% Complete
              </span>
            </div>
          </div>
          
          <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {progressPercent}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 truncate pr-2">
              {currentStepObj.name}
            </h2>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-brand-600 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
