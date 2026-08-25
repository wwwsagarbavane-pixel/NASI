import React, { useState } from 'react';
import { 
  Landmark, 
  FileText, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  QrCode,
  Smartphone
} from 'lucide-react';
import { PaymentDetails, ValidationErrors } from '../../types';
import { BANK_DETAILS, UPI_DETAILS } from '../../data/eventData';
import { formatCurrency } from '../../utils/pricing';

interface Step8Props {
  payment: PaymentDetails;
  grandTotal: number;
  termsConfirmed: boolean;
  errors: ValidationErrors;
  onChangePayment: (field: keyof PaymentDetails, value: any) => void;
  onToggleTerms: (checked: boolean) => void;
}

export const Step8Payment: React.FC<Step8Props> = ({
  payment,
  grandTotal,
  termsConfirmed,
  errors,
  onChangePayment,
  onToggleTerms,
}) => {
  const [showBankDetails, setShowBankDetails] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Step Header */}
      <div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          Section 08 / 08
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
          Payment & Declaration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select payment mode and provide transfer reference.
        </p>
      </div>

      {/* Payment Method Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* UPI & QR */}
        <div
          onClick={() => onChangePayment('method', 'upi_qr')}
          className={`flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            payment.method === 'upi_qr'
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
              payment.method === 'upi_qr' ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {payment.method === 'upi_qr' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                UPI & QR
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              GPay, PhonePe, Paytm
            </p>
          </div>
        </div>

        {/* Bank Transfer */}
        <div
          onClick={() => onChangePayment('method', 'bank_transfer')}
          className={`flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            payment.method === 'bank_transfer'
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
              payment.method === 'bank_transfer' ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {payment.method === 'bank_transfer' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Bank Transfer
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              NEFT / RTGS / IMPS
            </p>
          </div>
        </div>

        {/* DD / Cheque */}
        <div
          onClick={() => onChangePayment('method', 'dd_cheque')}
          className={`flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
            payment.method === 'dd_cheque'
              ? 'border-brand-600 bg-brand-50/40 shadow-card ring-2 ring-brand-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
              payment.method === 'dd_cheque' ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
            }`}
          >
            {payment.method === 'dd_cheque' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                DD / Cheque
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              In favour of NSAI
            </p>
          </div>
        </div>
      </div>

      {/* Official NSAI Bank Details (Expandable) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-card transition-all">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowBankDetails(!showBankDetails)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                NSAI Bank Details
              </h3>
              <p className="text-xs text-slate-400">
                State Bank of India • Official Beneficiary
              </p>
            </div>
          </div>
          <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-white">
            {showBankDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showBankDetails && (
          <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Account Name</span>
              <span className="text-xs sm:text-sm font-bold text-white mt-0.5 block">{BANK_DETAILS.accountName}</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Account Number</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-brand-300 mt-0.5 block">{BANK_DETAILS.accountNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'acc')}
                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">IFSC Code</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-brand-300 mt-0.5 block">{BANK_DETAILS.ifsc}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(BANK_DETAILS.ifsc, 'ifsc')}
                className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
              >
                {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bank</span>
              <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block">{BANK_DETAILS.bankName}</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Branch</span>
              <span className="text-xs text-slate-300 mt-0.5 block line-clamp-2">{BANK_DETAILS.branch}</span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">SWIFT Code</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 mt-0.5 block">{BANK_DETAILS.swift}</span>
            </div>
          </div>
        )}
      </div>

      {/* Relevant Payment Form Fields */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-7 space-y-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Total Final Amount:</span>
          <span className="text-xl font-display font-extrabold text-slate-900">
            {formatCurrency(grandTotal)}
          </span>
        </div>

        {payment.method === 'bank_transfer' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                UTR / Reference Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. SBIN024891823901"
                value={payment.transactionRef}
                onChange={(e) => onChangePayment('transactionRef', e.target.value)}
                className={`w-full h-12 px-4 rounded-xl text-sm font-mono font-medium bg-white border transition-all outline-none ${
                  errors.transactionRef
                    ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                    : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50'
                }`}
              />
              {errors.transactionRef && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.transactionRef}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Remitting Bank Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank / ICICI Bank"
                value={payment.bankName}
                onChange={(e) => onChangePayment('bankName', e.target.value)}
                className={`w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border transition-all outline-none ${
                  errors.bankName
                    ? 'border-rose-300 ring-2 ring-rose-100 text-rose-900'
                    : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50'
                }`}
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.bankName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Transfer <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={payment.date}
                onChange={(e) => onChangePayment('date', e.target.value)}
                className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Remitting Branch <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Banjara Hills, Hyderabad"
                value={payment.branch}
                onChange={(e) => onChangePayment('branch', e.target.value)}
                className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Instructions:</strong> DD/Cheque must be in favour of <strong>"National Seed Association of India"</strong>, payable at <strong>"New Delhi"</strong>.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  DD / Cheque Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 048291"
                  value={payment.ddChequeNumber}
                  onChange={(e) => onChangePayment('ddChequeNumber', e.target.value)}
                  className={`w-full h-12 px-4 rounded-xl text-sm font-mono font-medium bg-white border transition-all outline-none ${
                    errors.ddChequeNumber
                      ? 'border-rose-300 ring-2 ring-rose-100'
                      : 'border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50'
                  }`}
                />
                {errors.ddChequeNumber && (
                  <p className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.ddChequeNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Punjab National Bank"
                  value={payment.bankName}
                  onChange={(e) => onChangePayment('bankName', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Branch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Connaught Place, New Delhi"
                  value={payment.branch}
                  onChange={(e) => onChangePayment('branch', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={payment.date}
                  onChange={(e) => onChangePayment('date', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl text-sm font-medium bg-white border border-slate-200 focus:border-brand-600 focus:ring-4 focus:ring-brand-50 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Checkbox */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
        <label className="flex items-start gap-3.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={termsConfirmed}
            onChange={(e) => onToggleTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded-md text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
          />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900">
              I confirm that all information provided is correct.
            </span>{' '}
            I agree to the ISC 2026 Delegate Guidelines & NSAI Terms of Participation.
          </div>
        </label>

        {errors.termsConfirmed && (
          <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 pl-8">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.termsConfirmed}
          </p>
        )}
      </div>
    </div>
  );
};
