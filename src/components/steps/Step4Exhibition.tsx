import React from 'react';
import { CheckCircle2, Store } from 'lucide-react';
import { ExhibitionDetails, StallType } from '../../types';
import { STALL_OPTIONS } from '../../data/eventData';

interface Step4Props {
  exhibition: ExhibitionDetails;
  onChange: (updated: Partial<ExhibitionDetails>) => void;
}

export const Step4Exhibition: React.FC<Step4Props> = ({ exhibition, onChange }) => {
  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Exhibition Stall
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Would you like to book an Exhibition Stall at ISC 2026?
        </p>
      </div>

      {/* Yes / No Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* No Option */}
        <div
          onClick={() => onChange({ enabled: false })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            !exhibition.enabled
              ? 'border-emerald-600 bg-emerald-50/40 shadow-card ring-2 ring-emerald-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              !exhibition.enabled ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
            }`}
          >
            {!exhibition.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No, Skip</h3>
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
              ? 'border-emerald-600 bg-emerald-50/40 shadow-card ring-2 ring-emerald-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              exhibition.enabled ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
            }`}
          >
            {exhibition.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Yes, Choose Stall</h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Starting ₹1,20,000
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Includes 1 complimentary delegate registration + booth setup.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Stall Type Selector with Visual Floor Representation if YES */}
      {exhibition.enabled && (
        <div className="space-y-4 step-enter">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Complimentary Delegate Included:</strong> 1 complimentary delegate registration is included with every stall.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STALL_OPTIONS.map((stall) => {
              const isSelected = exhibition.stallType === stall.id;
              const isPremium = stall.id === 'premium';

              return (
                <div
                  key={stall.id}
                  onClick={() => onChange({ stallType: stall.id as StallType })}
                  className={`p-6 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-card ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Visual Floor Grid Diagram for 3x3 vs 4x3 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Graphical Booth Representation */}
                        <div className={`rounded-xl border-2 flex items-center justify-center p-2 text-center ${
                          isPremium 
                            ? 'w-16 h-12 bg-amber-50 border-amber-400 text-amber-900 font-bold text-xs' 
                            : 'w-12 h-12 bg-emerald-50 border-emerald-400 text-emerald-900 font-bold text-xs'
                        }`}>
                          <span>{isPremium ? '4×3' : '3×3'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Stall Size</span>
                          <span className="font-bold text-slate-900 text-sm">{stall.size}</span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
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

                  <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-800">
                    ✓ Includes 1 Complimentary Delegate Pass
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
