import React, { useEffect } from 'react';
import { Heart, BedDouble, Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { SpouseDetails, StayDetails, ValidationErrors } from '../../types';
import { formatCurrency } from '../../utils/pricing';

interface Step2Props {
  spouse: SpouseDetails;
  stay: StayDetails;
  errors: ValidationErrors;
  onChangeSpouse: (updated: Partial<SpouseDetails>) => void;
  onChangeStay: (updated: Partial<StayDetails>) => void;
}

export const Step2SpouseAndStay: React.FC<Step2Props> = ({
  spouse,
  stay,
  errors,
  onChangeSpouse,
  onChangeStay,
}) => {
  // Auto calculate nights
  useEffect(() => {
    if (stay.checkInDate && stay.checkOutDate) {
      const inDate = new Date(stay.checkInDate);
      const outDate = new Date(stay.checkOutDate);
      const diffTime = outDate.getTime() - inDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const calculatedNights = Math.max(1, diffDays > 0 ? diffDays : 1);
      if (calculatedNights !== stay.nights) {
        onChangeStay({ nights: calculatedNights });
      }
    }
  }, [stay.checkInDate, stay.checkOutDate]);

  const stayCost = (stay.nights || 1) * 15000;

  return (
    <div className="space-y-8 step-enter">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Spouse & Hotel Accommodation
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Customize your conference visit by adding an accompanying person or reserving hotel accommodation.
        </p>
      </div>

      {/* ==================================================== */}
      {/* SECTION A — SPOUSE / ACCOMPANYING PERSON */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 text-lg">
              Spouse / Accompanying Person
            </h3>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
            ₹20,000 / Person
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Would you like to add a spouse or accompanying person?
        </p>

        {/* Yes / No Choice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* No Option */}
          <div
            onClick={() => onChangeSpouse({ enabled: false })}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              !spouse.enabled
                ? 'border-brand-600 bg-brand-50/40 shadow-xs ring-1 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                !spouse.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
              }`}
            >
              {!spouse.enabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">No</span>
              <span className="text-xs text-slate-500">I don't want to add an accompanying person.</span>
            </div>
          </div>

          {/* Yes Option */}
          <div
            onClick={() => onChangeSpouse({ enabled: true })}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              spouse.enabled
                ? 'border-brand-600 bg-brand-50/40 shadow-xs ring-1 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                spouse.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
              }`}
            >
              {spouse.enabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 block">Yes, Add Person</span>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded">₹20,000</span>
              </div>
              <span className="text-xs text-slate-500">Includes Welcome & Gala Dinners and cultural events.</span>
            </div>
          </div>
        </div>

        {/* Expandable Fields if YES */}
        {spouse.enabled && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 step-enter">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mrs. Sunita Sharma"
                value={spouse.name}
                onChange={(e) => onChangeSpouse({ name: e.target.value })}
                className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                  errors.spouse_name
                    ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                    : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50'
                }`}
              />
              {errors.spouse_name && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.spouse_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 00000"
                value={spouse.mobile}
                onChange={(e) => onChangeSpouse({ mobile: e.target.value })}
                className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="email"
                placeholder="spouse@email.com"
                value={spouse.email}
                onChange={(e) => onChangeSpouse({ email: e.target.value })}
                className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* SECTION B — HOTEL ACCOMMODATION */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-lg">
              Hotel Accommodation
            </h3>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
            ₹15,000 / Night (Tax Incl.)
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Would you like to book accommodation at the official event venue (Duangjitt Resort & Spa, Phuket)?
        </p>

        {/* Yes / No Choice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* No Option */}
          <div
            onClick={() => onChangeStay({ enabled: false })}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              !stay.enabled
                ? 'border-brand-600 bg-brand-50/40 shadow-xs ring-1 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                !stay.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
              }`}
            >
              {!stay.enabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">No</span>
              <span className="text-xs text-slate-500">I don't need accommodation.</span>
            </div>
          </div>

          {/* Yes Option */}
          <div
            onClick={() => onChangeStay({ 
              enabled: true, 
              checkInDate: stay.checkInDate || '2026-02-26', 
              checkOutDate: stay.checkOutDate || '2026-02-28',
              nights: stay.nights || 2 
            })}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
              stay.enabled
                ? 'border-brand-600 bg-brand-50/40 shadow-xs ring-1 ring-brand-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                stay.enabled ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
              }`}
            >
              {stay.enabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 block">Yes, Add Stay</span>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded">₹15,000/night</span>
              </div>
              <span className="text-xs text-slate-500">Luxury resort room with breakfast and all taxes.</span>
            </div>
          </div>
        </div>

        {/* Expandable Fields if YES */}
        {stay.enabled && (
          <div className="pt-4 border-t border-slate-100 space-y-4 step-enter">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Check-in Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={stay.checkInDate}
                  onChange={(e) => onChangeStay({ checkInDate: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Check-out Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={stay.checkOutDate}
                  onChange={(e) => onChangeStay({ checkOutDate: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Calculated Nights
                </label>
                <div className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>{stay.nights} Night{stay.nights > 1 ? 's' : ''}</span>
                  <span className="text-xs text-slate-500 font-normal">@ ₹15,000/night</span>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <div className="p-3.5 rounded-xl bg-brand-50/50 border border-brand-100 flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-brand-900">
                Stay Total ({stay.nights} Night{stay.nights > 1 ? 's' : ''} × ₹15,000):
              </span>
              <span className="font-display font-extrabold text-brand-900 text-sm sm:text-base">
                {formatCurrency(stayCost)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
