import React from 'react';
import { Store, Layers, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { ExhibitionDetails, StallType } from '../../types';
import { STALL_OPTIONS } from '../../data/eventData';

interface Step5Props {
  exhibition: ExhibitionDetails;
  onChange: (updated: Partial<ExhibitionDetails>) => void;
}

export const Step5Exhibition: React.FC<Step5Props> = ({ exhibition, onChange }) => {
  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Exhibition Stall
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Would you like to showcase your seed varieties, agricultural equipment, and technology in the exhibition hall?
        </p>
      </div>

      {/* Yes / No Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* No Option */}
        <div
          onClick={() => onChange({ enabled: false })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            !exhibition.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              !exhibition.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {!exhibition.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No, Skip Exhibition</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              I do not want to book an exhibition booth.
            </p>
          </div>
        </div>

        {/* Yes Option */}
        <div
          onClick={() => onChange({ enabled: true, stallType: exhibition.stallType || 'normal' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            exhibition.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              exhibition.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {exhibition.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Yes, Choose Stall</h3>
              <span className="text-[11px] font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-full">
                Starting ₹1,20,000
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Includes 1 complimentary delegate registration + full booth shell scheme.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Stall Type Selector if YES */}
      {exhibition.enabled ? (
        <div className="space-y-4 step-enter">
          {/* Information banner about complimentary delegate */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Complimentary Delegate Included:</strong> 1 complimentary delegate pass is included with every exhibition stall booking.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STALL_OPTIONS.map((stall) => {
              const isSelected = exhibition.stallType === stall.id;

              return (
                <div
                  key={stall.id}
                  onClick={() => onChange({ stallType: stall.id as StallType })}
                  className={`p-6 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Layers className="w-3.5 h-3.5 text-brand-600" />
                        {stall.size}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{stall.name}</h3>
                    <div className="mt-1">
                      <span className="text-2xl font-display font-extrabold text-slate-950">
                        {stall.formattedPrice}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      {stall.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
                    ✓ 1 Complimentary Delegate Pass
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
          No exhibition booth selected. Click "Continue" to proceed to Sponsorship.
        </div>
      )}
    </div>
  );
};
