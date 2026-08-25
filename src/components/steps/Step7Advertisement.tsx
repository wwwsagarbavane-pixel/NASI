import React from 'react';
import { BookOpen, CheckCircle2, Sparkles, AlertCircle, Check } from 'lucide-react';
import { AdvertisementDetails, SouvenirPlacement, SponsorshipDetails } from '../../types';
import { SOUVENIR_OPTIONS, SPONSORSHIP_OPTIONS } from '../../data/eventData';

interface Step7Props {
  advertisement: AdvertisementDetails;
  sponsorship: SponsorshipDetails;
  onChange: (updated: Partial<AdvertisementDetails>) => void;
}

export const Step7Advertisement: React.FC<Step7Props> = ({
  advertisement,
  sponsorship,
  onChange,
}) => {
  const selectedSponsor = sponsorship.enabled
    ? SPONSORSHIP_OPTIONS.find((s) => s.id === sponsorship.tier)
    : null;

  const sponsorHasAd = selectedSponsor && selectedSponsor.includesAd !== 'none';

  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Congress Souvenir Advertisement
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Would you like to publish a full-color corporate advertisement in the prestigious 14th ISC 2026 Souvenir?
        </p>
      </div>

      {/* Yes / No Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* No Option */}
        <div
          onClick={() => onChange({ enabled: false })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            !advertisement.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              !advertisement.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {!advertisement.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No, Skip Advertisement</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              I do not want to place a souvenir advertisement.
            </p>
          </div>
        </div>

        {/* Yes Option */}
        <div
          onClick={() => onChange({ 
            enabled: true, 
            placement: advertisement.placement || 'regular_full',
            useIncludedWithSponsor: sponsorHasAd ? true : false 
          })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            advertisement.enabled
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
              advertisement.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {advertisement.enabled && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Yes, Choose Advertisement</h3>
              <span className="text-[11px] font-bold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded-full">
                Starting ₹20,000
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High visibility print circulation distributed to all delegates and dignitaries.
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Ad Placement Options if YES */}
      {advertisement.enabled ? (
        <div className="space-y-4 step-enter">
          {/* Sponsorship Ad Inclusion Notice */}
          {sponsorHasAd && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Included with Your Sponsorship</span>
              </div>
              <p>
                Your <strong>{selectedSponsor?.name}</strong> package includes an advertisement in the Congress Souvenir.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onChange({ useIncludedWithSponsor: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    advertisement.useIncludedWithSponsor
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  ✓ Use Included Advertisement (₹0 Extra)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ useIncludedWithSponsor: false })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !advertisement.useIncludedWithSponsor
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-white border border-purple-300 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  Choose Specific Placement Below
                </button>
              </div>
            </div>
          )}

          {/* Placements List */}
          <div className="space-y-2.5">
            {SOUVENIR_OPTIONS.map((option) => {
              const isSelected = advertisement.placement === option.id;
              const isCoveredBySponsor = advertisement.useIncludedWithSponsor && sponsorHasAd;

              return (
                <div
                  key={option.id}
                  onClick={() => onChange({ placement: option.id as SouvenirPlacement, useIncludedWithSponsor: false })}
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    isSelected && !isCoveredBySponsor
                      ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        isSelected && !isCoveredBySponsor
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && !isCoveredBySponsor && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${isSelected ? 'text-brand-950' : 'text-slate-900'}`}>
                        {option.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {option.dimensions} • {option.highlight}
                      </p>
                    </div>
                  </div>

                  <div className="text-right pl-3">
                    <span className="text-base sm:text-lg font-display font-extrabold text-slate-900">
                      {option.formattedPrice}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
          No advertisement selected. Click "Continue" to review your complete registration package.
        </div>
      )}
    </div>
  );
};
