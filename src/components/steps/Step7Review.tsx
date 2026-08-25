import React from 'react';
import { 
  Edit3, 
  User, 
  Heart, 
  BedDouble, 
  Table2, 
  Store, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { RegistrationPackageData } from '../../types';
import { calculatePricing, formatCurrency } from '../../utils/pricing';
import { SPONSORSHIP_OPTIONS, STALL_OPTIONS, SOUVENIR_OPTIONS } from '../../data/eventData';

interface Step7Props {
  data: RegistrationPackageData;
  onEditStep: (stepId: number) => void;
}

export const Step7Review: React.FC<Step7Props> = ({ data, onEditStep }) => {
  const pricing = calculatePricing(data);
  const { delegate, spouse, stay, tradingTable, exhibition, sponsorship, advertisement } = data;

  const selectedSponsor = sponsorship.enabled
    ? SPONSORSHIP_OPTIONS.find((s) => s.id === sponsorship.tier)
    : null;

  const selectedStall = exhibition.enabled
    ? STALL_OPTIONS.find((s) => s.id === exhibition.stallType)
    : null;

  const selectedAd = advertisement.enabled
    ? SOUVENIR_OPTIONS.find((a) => a.id === advertisement.placement)
    : null;

  return (
    <div className="space-y-6 step-enter">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Review Your Registration
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Review your complete ISC 2026 conference package before proceeding to payment.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card divide-y divide-slate-100 overflow-hidden">
        
        {/* 1. DELEGATE */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-base">Delegate Details</h3>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">{delegate.name || 'Delegate Name'}</span>
              <span className="text-slate-600 block">{delegate.designation} • {delegate.organization}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {delegate.city}, {delegate.stateCountry} • {delegate.email} • {delegate.mobile}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-bold text-brand-700 block">
                {delegate.membershipType === 'member' ? 'NSAI Member (₹25,000)' : 'Non-Member (₹30,000)'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. SPOUSE */}
        {spouse.enabled && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-base">Spouse / Accompanying Person</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-800">{spouse.name || 'Accompanying Person'}</span>
                {spouse.mobile && <span className="text-slate-400 block">{spouse.mobile}</span>}
              </div>
              <span className="font-bold text-brand-700">₹20,000</span>
            </div>
          </div>
        )}

        {/* 3. HOTEL STAY */}
        {stay.enabled && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Hotel Accommodation</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-800">
                  {stay.checkInDate} to {stay.checkOutDate}
                </span>
                <span className="text-slate-400 block">{stay.nights} Nights @ ₹15,000/night</span>
              </div>
              <span className="font-bold text-brand-700">{formatCurrency(pricing.stayTotal)}</span>
            </div>
          </div>
        )}

        {/* 4. TRADING TABLE */}
        {tradingTable.enabled && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Trading Table</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-800">
                  {tradingTable.quantity} B2B Trading Table{tradingTable.quantity > 1 ? 's' : ''}
                </span>
                {sponsorship.enabled && sponsorship.useIncludedTradingTable && (
                  <span className="text-emerald-700 block font-medium">✓ 1 Table Included with Sponsorship</span>
                )}
              </div>
              <span className="font-bold text-brand-700">{formatCurrency(pricing.tradingTableTotal)}</span>
            </div>
          </div>
        )}

        {/* 5. EXHIBITION STALL */}
        {exhibition.enabled && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Exhibition Stall</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-800">{selectedStall?.name} ({selectedStall?.size})</span>
                <span className="text-slate-400 block">Includes 1 Complimentary Delegate Registration</span>
              </div>
              <span className="font-bold text-brand-700">{formatCurrency(pricing.exhibitionTotal)}</span>
            </div>
          </div>
        )}

        {/* 6. SPONSORSHIP */}
        {sponsorship.enabled && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Sponsorship</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">{selectedSponsor?.name}</span>
                <span className="font-display font-extrabold text-brand-700 text-sm">
                  {selectedSponsor?.formattedPrice}
                </span>
              </div>
              <div className="text-slate-500 text-[11px] leading-relaxed">
                Includes: {selectedSponsor?.benefits.slice(0, 3).join(' • ')}...
              </div>
            </div>
          </div>
        )}

        {/* 7. ADVERTISEMENT */}
        {advertisement.enabled && (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Souvenir Advertisement</h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(6)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold text-slate-800">
                  {advertisement.useIncludedWithSponsor ? 'Included with Sponsorship' : selectedAd?.name}
                </span>
              </div>
              <span className="font-bold text-brand-700">
                {advertisement.useIncludedWithSponsor ? 'Included (₹0)' : formatCurrency(pricing.advertisementTotal)}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* FINAL PRICE SUMMARY CARD */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-card space-y-3.5 text-xs sm:text-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
          Final Price Summary
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Delegate Registration ({delegate.membershipType === 'member' ? 'NSAI Member' : 'Non-Member'})</span>
            <span className="font-mono">{formatCurrency(pricing.delegateTotal)}</span>
          </div>

          {spouse.enabled && (
            <div className="flex justify-between text-slate-300">
              <span>Spouse / Accompanying Person</span>
              <span className="font-mono">{formatCurrency(pricing.spouseTotal)}</span>
            </div>
          )}

          {stay.enabled && (
            <div className="flex justify-between text-slate-300">
              <span>Hotel Accommodation ({pricing.stayNights} Nights)</span>
              <span className="font-mono">{formatCurrency(pricing.stayTotal)}</span>
            </div>
          )}

          {tradingTable.enabled && (
            <div className="flex justify-between text-slate-300">
              <span>Trading Table</span>
              <span className="font-mono">{formatCurrency(pricing.tradingTableTotal)}</span>
            </div>
          )}

          {exhibition.enabled && (
            <div className="flex justify-between text-slate-300">
              <span>Exhibition Stall</span>
              <span className="font-mono">{formatCurrency(pricing.exhibitionTotal)}</span>
            </div>
          )}

          {sponsorship.enabled && (
            <div className="flex justify-between text-slate-300">
              <span>Sponsorship Package</span>
              <span className="font-mono">{formatCurrency(pricing.sponsorshipTotal)}</span>
            </div>
          )}

          {advertisement.enabled && (
            <div className="flex justify-between text-slate-300">
              <span>Souvenir Advertisement</span>
              <span className="font-mono">
                {advertisement.useIncludedWithSponsor ? '₹0 (Included)' : formatCurrency(pricing.advertisementTotal)}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-slate-400 block">
              Grand Total
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Calculated dynamically
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold font-display text-brand-300 tracking-tight">
            {formatCurrency(pricing.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
