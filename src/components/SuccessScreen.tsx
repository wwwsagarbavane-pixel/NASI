import React from 'react';
import { 
  CheckCircle2, 
  Printer, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { RegistrationPackageData } from '../types';
import { calculatePricing, formatCurrency } from '../utils/pricing';
import { SPONSORSHIP_OPTIONS, STALL_OPTIONS } from '../data/eventData';

interface SuccessScreenProps {
  data: RegistrationPackageData;
  onReset: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ data, onReset }) => {
  const pricing = calculatePricing(data);
  const { delegate, spouse, stay, tradingTable, exhibition, sponsorship, advertisement, payment } = data;

  const selectedSponsor = sponsorship.enabled
    ? SPONSORSHIP_OPTIONS.find((s) => s.id === sponsorship.tier)
    : null;

  const selectedStall = exhibition.enabled
    ? STALL_OPTIONS.find((s) => s.id === exhibition.stallType)
    : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 step-enter py-4 sm:py-8">
      
      {/* Top Banner & Status */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-100 flex items-center justify-center mx-auto shadow-sm animate-bounce duration-1000">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        </div>
        
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Registration Confirmed
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight pt-1 font-display">
            Registration Submitted Successfully
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Your registration for the <strong className="text-slate-900">14th Indian Seed Congress 2026</strong> has been submitted successfully.
          </p>
        </div>
      </div>

      {/* Printable Digital Pass / Confirmation Slip */}
      <div className="print-container bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 text-white p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-400/30 text-[11px] font-bold uppercase tracking-wider">
                  Official Conference Pass
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                14th Indian Seed Congress 2026
              </h2>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>26th–28th February 2026</span>
                <span>•</span>
                <span>Duangjitt Resort & Spa, Phuket, Thailand</span>
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium block uppercase tracking-wider">
                Registration ID
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-brand-300 tracking-wider">
                {data.registrationId || data.applicationId}
              </span>
            </div>
          </div>
        </div>

        {/* Pass Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key Grid Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-[10px]">Registered Delegate</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{delegate.name}</span>
              <span className="text-slate-500 text-[11px] block truncate">{delegate.organization}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-[10px]">Membership Status</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {delegate.membershipType === 'member' ? 'NSAI Member' : 'Non-Member'}
              </span>
              <span className="text-slate-500 text-[11px] block">{delegate.nsaiMembershipNo || 'Standard Delegate'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-[10px]">Total Paid</span>
              <span className="font-display font-extrabold text-brand-700 text-base mt-0.5 block">
                {formatCurrency(pricing.grandTotal)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-[10px]">Contact Email</span>
              <span className="font-medium text-slate-800 mt-0.5 block truncate">{delegate.email}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-[10px]">Payment Method</span>
              <span className="font-medium text-slate-800 mt-0.5 block">
                {payment?.method === 'bank_transfer' ? 'Bank Wire Transfer' : 'Demand Draft / Cheque'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-[10px]">Reference / Instrument No</span>
              <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                {payment?.method === 'bank_transfer' ? payment.transactionRef : payment?.ddChequeNumber || 'N/A'}
              </span>
            </div>
          </div>

          {/* Package Inclusions Summary */}
          <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-brand-900 uppercase tracking-wider block">
                Confirmed Package Inclusions:
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                <span className="bg-white px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                  1 Delegate Pass ({delegate.name})
                </span>
                {spouse.enabled && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                    1 Spouse Pass ({spouse.name})
                  </span>
                )}
                {stay.enabled && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                    {stay.nights} Nights Room Stay
                  </span>
                )}
                {tradingTable.enabled && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                    {tradingTable.quantity} Trading Table{tradingTable.quantity > 1 ? 's' : ''}
                  </span>
                )}
                {exhibition.enabled && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                    Exhibition Stall ({selectedStall?.name})
                  </span>
                )}
                {sponsorship.enabled && (
                  <span className="bg-white px-2.5 py-1 rounded-md border border-brand-200 font-medium">
                    {selectedSponsor?.name}
                  </span>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center flex-shrink-0 bg-white p-2 rounded-xl border border-brand-200">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <svg viewBox="0 0 100 100" className="w-12 h-12 fill-white">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="#0f172a" />
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="#0f172a" />
                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="#0f172a" />
                  <rect x="40" y="20" width="20" height="20" />
                  <rect x="40" y="60" width="30" height="20" />
                </svg>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">VERIFIED PASS</span>
            </div>
          </div>

          {/* Next steps */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Official Delegate Badge Collection:</p>
            <p>1. Present this Reference ID at the Registration & Hospitality Desk at Duangjitt Resort & Spa, Phuket.</p>
            <p>2. The NSAI secretariat will email the tax invoice and delegate welcome kit to {delegate.email}.</p>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-98 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Download Confirmation</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

    </div>
  );
};
