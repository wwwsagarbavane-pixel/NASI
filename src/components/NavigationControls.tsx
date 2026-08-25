import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  isOptionalStep?: boolean;
  onBack: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  isSubmitting?: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  totalSteps,
  isOptionalStep = false,
  onBack,
  onContinue,
  onSkip,
  isSubmitting = false,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="pt-6 sm:pt-8 border-t border-slate-200/80">
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Back Button */}
        <div>
          {!isFirstStep ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back</span>
            </button>
          ) : (
            <div className="hidden sm:block text-xs text-slate-400 font-medium">
              Step 1 of {totalSteps} • Delegate Registration
            </div>
          )}
        </div>

        {/* Right Actions: Skip (if optional) + Continue / Submit */}
        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
          {isOptionalStep && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={isSubmitting}
              className="px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Skip for now
            </button>
          )}

          <button
            type="button"
            onClick={onContinue}
            disabled={isSubmitting}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-md active:scale-98 cursor-pointer ${
              isLastStep
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
            }`}
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
