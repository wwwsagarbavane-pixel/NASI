import React, { useState } from 'react';
import { Award, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Shield, AlertCircle, Check } from 'lucide-react';
import { SponsorshipDetails, SponsorshipTier, TradingTableDetails } from '../../types';
import { SPONSORSHIP_OPTIONS } from '../../data/eventData';
import { formatCurrency } from '../../utils/pricing';

interface Step6Props {
  sponsorship: SponsorshipDetails;
  tradingTable: TradingTableDetails;
  onChange: (updated: Partial<SponsorshipDetails>) => void;
}

export const Step6Sponsorship: React.FC<Step6Props> = ({
  sponsorship,
  tradingTable,
  onChange,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(sponsorship.tier);

  const selectedSponsor = SPONSORSHIP_OPTIONS.find((s) => s.id === sponsorship.tier) || SPONSORSHIP_OPTIONS[0];
  const hasIncludedTable = selectedSponsor.includesTable && tradingTable.enabled;

  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sponsorship
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Would you like to elevate your global presence as an official sponsor of Indian Seed Congress 2026?
        </p>
      </div>

      {/* Yes / No Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* No Option */}
        <div
          onClick={() => onChange({ enabled: false })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            !sponsorship.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              !sponsorship.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {!sponsorship.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No, Continue Without Sponsorship</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              I do not wish to sponsor the event at this time.
            </p>
          </div>
        </div>

        {/* Yes Option */}
        <div
          onClick={() => onChange({ enabled: true, tier: sponsorship.tier || 'event' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            sponsorship.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              sponsorship.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {sponsorship.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Yes, Explore Sponsorship</h3>
              <span className="text-[11px] font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-full">
                Starting ₹2,00,000
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Includes delegate passes, stalls, presentation slots, and prominent branding.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Sponsorship Tier List if YES */}
      {sponsorship.enabled ? (
        <div className="space-y-4 step-enter">
          {/* Smart Included Benefits Reconciliation Alert */}
          {hasIncludedTable && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Included Benefit Reconciliation</span>
              </div>
              <p>
                Your selected <strong>{selectedSponsor.name}</strong> package already includes <strong>1 Complimentary Trading Table</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onChange({ useIncludedTradingTable: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sponsorship.useIncludedTradingTable
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  ✓ Use Included Table (Deduct ₹30,000 from Table Fee)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ useIncludedTradingTable: false })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !sponsorship.useIncludedTradingTable
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Keep as Additional Paid Table
                </button>
              </div>
            </div>
          )}

          {/* List of Sponsorship Categories */}
          <div className="space-y-2.5">
            {SPONSORSHIP_OPTIONS.map((sponsor) => {
              const isSelected = sponsorship.tier === sponsor.id;
              const isExpanded = expandedId === sponsor.id;

              return (
                <div
                  key={sponsor.id}
                  className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/30 shadow-card ring-2 ring-brand-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Selector Bar */}
                  <div
                    onClick={() => {
                      onChange({ tier: sponsor.id as SponsorshipTier });
                      setExpandedId(sponsor.id);
                    }}
                    className="flex items-center justify-between p-4 sm:p-5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-base font-bold ${isSelected ? 'text-brand-950' : 'text-slate-900'}`}>
                            {sponsor.name}
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {sponsor.tag}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-base sm:text-lg font-display font-extrabold ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                        {sponsor.formattedPrice}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : sponsor.id);
                        }}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Benefits' : 'View Benefits'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Benefits Grid */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/70">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                        Official Benefits & Deliverables:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sponsor.benefits.map((b, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
          No sponsorship package selected. Click "Continue" to proceed to Souvenir Advertisement.
        </div>
      )}
    </div>
  );
};
