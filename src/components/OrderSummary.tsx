import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RegistrationPackageData } from '../types';
import { calculatePricing, formatCurrency } from '../utils/pricing';
import { SPONSORSHIP_OPTIONS, STALL_OPTIONS, SOUVENIR_OPTIONS } from '../data/eventData';

interface OrderSummaryProps {
  data: RegistrationPackageData;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ data }) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const pricing = calculatePricing(data);

  const selectedSponsor = data.sponsorship.enabled
    ? SPONSORSHIP_OPTIONS.find((s) => s.id === data.sponsorship.tier)
    : null;

  const selectedStall = data.exhibition.enabled
    ? STALL_OPTIONS.find((s) => s.id === data.exhibition.stallType)
    : null;

  const selectedAd = data.advertisement.enabled
    ? SOUVENIR_OPTIONS.find((a) => a.id === data.advertisement.placement)
    : null;

  const SummaryContent = () => (
    <div className="space-y-4 text-xs">
      
      {/* Summary Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5">
        <span className="font-extrabold text-charcoal-900 text-sm">
          Your Registration
        </span>
        <span className="text-[10px] font-mono font-bold text-forest-900 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100 uppercase">
          LIVE ESTIMATE
        </span>
      </div>

      {/* Selected Items Breakdown */}
      <div className="space-y-2.5">
        {/* Delegate */}
        <div className="flex justify-between items-start">
          <div>
            <span className="font-semibold text-charcoal-900 block">Delegate</span>
            <span className="text-[11px] text-charcoal-600">
              {data.delegate.membershipType === 'member' ? 'NSAI Member' : 'Non-Member'}
            </span>
          </div>
          <span className="font-bold text-charcoal-900">{formatCurrency(pricing.delegateTotal)}</span>
        </div>

        {/* Spouse */}
        {data.spouse.enabled && (
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-charcoal-900 block">Spouse Pass</span>
              <span className="text-[11px] text-charcoal-600">
                {pricing.spouseCount} {pricing.spouseCount === 1 ? 'Person' : 'Persons'}
              </span>
            </div>
            <span className="font-bold text-charcoal-900">{formatCurrency(pricing.spouseTotal)}</span>
          </div>
        )}

        {/* Hotel Stay */}
        {data.stay.enabled && (
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-charcoal-900 block">Hotel Stay</span>
              <span className="text-[11px] text-charcoal-600">{pricing.stayNights} Nights</span>
            </div>
            <span className="font-bold text-charcoal-900">{formatCurrency(pricing.stayTotal)}</span>
          </div>
        )}

        {/* Trading Table */}
        {data.tradingTable.enabled && (
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-charcoal-900 block">Trading Table</span>
              <span className="text-[11px] text-charcoal-600">
                {pricing.tradingTableCount} Desk{pricing.tradingTableCount > 1 ? 's' : ''}
              </span>
            </div>
            <span className="font-bold text-charcoal-900">{formatCurrency(pricing.tradingTableTotal)}</span>
          </div>
        )}

        {/* Exhibition Stall */}
        {data.exhibition.enabled && (
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-charcoal-900 block">Exhibition Stall</span>
              <span className="text-[11px] text-charcoal-600">{selectedStall?.name}</span>
            </div>
            <span className="font-bold text-charcoal-900">{formatCurrency(pricing.exhibitionTotal)}</span>
          </div>
        )}

        {/* Sponsorship */}
        {data.sponsorship.enabled && (
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-charcoal-900 block">Sponsorship</span>
              <span className="text-[11px] text-charcoal-600 truncate max-w-[130px] block">{selectedSponsor?.name}</span>
            </div>
            <span className="font-bold text-charcoal-900">{formatCurrency(pricing.sponsorshipTotal)}</span>
          </div>
        )}

        {/* Advertisement */}
        {data.advertisement.enabled && (
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold text-charcoal-900 block">Souvenir Ad</span>
              <span className="text-[11px] text-charcoal-600">
                {data.advertisement.useIncludedWithSponsor ? 'Included with Sponsor' : selectedAd?.name}
              </span>
            </div>
            <span className="font-bold text-charcoal-900">
              {data.advertisement.useIncludedWithSponsor ? 'Included (₹0)' : formatCurrency(pricing.advertisementTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Estimated Total */}
      <div className="pt-3 border-t border-black/5">
        <div className="flex justify-between items-baseline">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            TOTAL
          </span>
          <span className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
            {formatCurrency(pricing.grandTotal)}
          </span>
        </div>
        <p className="text-[10px] text-charcoal-600 mt-1">
          Final amount will be confirmed during approval.
        </p>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Floating Glass Summary Panel */}
      <div className="hidden lg:block w-full glass-panel p-6 shadow-card">
        <SummaryContent />
      </div>

      {/* Mobile Compact Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-white/80 shadow-2xl p-4">
        {mobileExpanded && (
          <div className="pb-3 mb-2 border-b border-black/5 max-h-56 overflow-y-auto">
            <SummaryContent />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900 cursor-pointer"
          >
            <span>Your Registration</span>
            {mobileExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <div className="text-right">
            <span className="text-base font-extrabold text-charcoal-900">
              {formatCurrency(pricing.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
