import React from 'react';
import { User, Building2, MapPin, AlertCircle } from 'lucide-react';
import { SingleDelegate, MembershipType, ValidationErrors } from '../../types';
import { INDIAN_STATES_COUNTRIES } from '../../data/eventData';

interface Step1Props {
  delegate: SingleDelegate;
  errors: ValidationErrors;
  onChange: (field: keyof SingleDelegate, value: any) => void;
}

export const Step1Delegates: React.FC<Step1Props> = ({
  delegate,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-6 step-enter">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Delegate Registration
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal">
          Enter your details to register for Indian Seed Congress 2026.
        </p>
      </div>

      {/* Delegate Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-6">
        
        {/* Membership Type Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Registration Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Registration type">
            {/* NSAI Member */}
            <div
              onClick={() => onChange('membershipType', 'member')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                delegate.membershipType === 'member'
                  ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-1 ring-brand-600/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    delegate.membershipType === 'member'
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {delegate.membershipType === 'member' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">NSAI Member</span>
                  <span className="text-xs text-slate-500">✓ Member registration fee</span>
                </div>
              </div>
              <span className="font-display font-extrabold text-base text-brand-700">₹25,000</span>
            </div>

            {/* Non-Member */}
            <div
              onClick={() => onChange('membershipType', 'non_member')}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                delegate.membershipType === 'non_member'
                  ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-1 ring-brand-600/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    delegate.membershipType === 'non_member'
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300'
                  }`}
                >
                  {delegate.membershipType === 'non_member' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Non-Member</span>
                  <span className="text-xs text-slate-500">✓ Standard delegate fee</span>
                </div>
              </div>
              <span className="font-display font-extrabold text-base text-slate-800">₹30,000</span>
            </div>
          </div>
        </div>

        {/* Delegate Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Delegate Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Delegate Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Rajesh Sharma"
              value={delegate.name}
              onChange={(e) => onChange('name', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.name
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Designation <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Managing Director"
              value={delegate.designation}
              onChange={(e) => onChange('designation', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.designation
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.designation && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.designation}
              </p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={delegate.mobile}
              onChange={(e) => onChange('mobile', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.mobile
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.mobile && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.mobile}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="rajesh@company.com"
              value={delegate.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.email
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Organization */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Organization / Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Seeds Pvt Ltd"
              value={delegate.organization}
              onChange={(e) => onChange('organization', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.organization
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.organization && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.organization}
              </p>
            )}
          </div>

          {/* NSAI Membership No */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              NSAI Membership No. <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. NSAI/2025/110"
              value={delegate.nsaiMembershipNo}
              onChange={(e) => onChange('nsaiMembershipNo', e.target.value)}
              className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900 outline-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hyderabad"
              value={delegate.city}
              onChange={(e) => onChange('city', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.city
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.city}
              </p>
            )}
          </div>

          {/* PIN Code */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              PIN Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 500081"
              value={delegate.pinCode}
              onChange={(e) => onChange('pinCode', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                errors.pinCode
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.pinCode && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.pinCode}
              </p>
            )}
          </div>

          {/* State / Country */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              State / Country <span className="text-rose-500">*</span>
            </label>
            <select
              value={delegate.stateCountry}
              onChange={(e) => onChange('stateCountry', e.target.value)}
              className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none cursor-pointer ${
                errors.stateCountry
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            >
              <option value="">Select State / Country...</option>
              {INDIAN_STATES_COUNTRIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            {errors.stateCountry && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.stateCountry}
              </p>
            )}
          </div>

          {/* Address (Full Width) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Organization Registered Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Plot No., Building Name, Street, Sector"
              value={delegate.address}
              onChange={(e) => onChange('address', e.target.value)}
              className={`w-full p-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none resize-none ${
                errors.address
                  ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                  : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 text-slate-900'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.address}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
