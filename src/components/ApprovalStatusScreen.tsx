import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { RegistrationPackageData, ApplicationStatus } from '../types';
import { calculatePricing, formatCurrency } from '../utils/pricing';

interface ApprovalStatusScreenProps {
  data: RegistrationPackageData;
  onStatusChange: (status: ApplicationStatus) => void;
  onViewTicket: () => void;
  onEditRegistration: () => void;
}

export const ApprovalStatusScreen: React.FC<ApprovalStatusScreenProps> = ({
  data,
  onStatusChange,
  onViewTicket,
  onEditRegistration,
}) => {
  const [copied, setCopied] = useState(false);
  const pricing = calculatePricing(data);

  const handleCopyId = () => {
    navigator.clipboard.writeText(data.applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[840px] mx-auto space-y-10 py-4 font-sans">
      
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0B6B43]">
            APPLICATION STATUS
          </span>
          <span className="w-8 h-[2px] bg-[#0B6B43]" />
          <span className="w-2 h-[2px] bg-[#E89A24]" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151A17] tracking-tight">
          Registration Submitted
        </h1>
        <p className="text-sm text-[#59635D] max-w-lg mx-auto leading-relaxed">
          Your registration application for Indian Seed Congress 2027 has been received and is now awaiting approval.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[12px] border border-[#DDE5DF] p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Registration ID Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDE5DF]">
          <div>
            <span className="text-xs font-bold text-[#7A847E] uppercase tracking-wider block">
              REGISTRATION ID
            </span>
            <span className="text-2xl font-num font-extrabold text-[#151A17] tracking-wide mt-0.5 block">
              {data.applicationId}
            </span>
            <span className="text-xs text-[#59635D]">Submitted on {data.submissionDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
              <Clock className="w-3.5 h-3.5 text-[#E89A24]" />
              <span>{data.status === 'approved' ? 'Approved' : 'Awaiting Approval'}</span>
            </span>

            <button
              type="button"
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-xs font-bold text-[#151A17] bg-[#F4F8F5] border border-[#DDE5DF] hover:border-[#0B6B43] transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0B6B43]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#151A17] uppercase tracking-wider block">
            Approval Progress
          </span>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-[#0B6B43] text-white flex items-center justify-center font-bold text-[10px]">
                ✓
              </span>
              <span className="font-bold text-[#151A17]">Registration Submitted</span>
              <span className="text-[#59635D] ml-auto font-num">{data.submissionDate}</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="w-5 h-5 rounded-full bg-[#E89A24] text-white flex items-center justify-center font-bold text-[10px]">
                ●
              </span>
              <span className="font-bold text-[#151A17]">Secretariat Review</span>
              <span className="text-[#E89A24] font-semibold ml-auto">
                {data.status === 'approved' ? 'Completed' : 'Current Stage'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                data.status === 'approved' ? 'bg-[#0B6B43] text-white' : 'border border-[#DDE5DF] text-[#7A847E]'
              }`}>
                {data.status === 'approved' ? '✓' : '○'}
              </span>
              <span className={`font-semibold ${data.status === 'approved' ? 'text-[#151A17]' : 'text-[#7A847E]'}`}>
                Approval & Pass Generation
              </span>
              <span className="text-[#59635D] ml-auto">{data.status === 'approved' ? 'Confirmed' : 'Pending'}</span>
            </div>
          </div>
        </div>

        {/* Delegate Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs p-4 rounded-[10px] bg-[#F4F8F5] border border-[#DDE5DF]">
          <div>
            <span className="text-[#59635D] font-medium block">Delegate</span>
            <span className="font-bold text-[#151A17] text-sm block">{data.delegate.name || 'Delegate Name'}</span>
            <span className="text-[#59635D]">{data.delegate.designation}</span>
          </div>

          <div>
            <span className="text-[#59635D] font-medium block">Organization</span>
            <span className="font-bold text-[#151A17] text-sm truncate block">{data.delegate.organization || 'Company'}</span>
            <span className="text-[#59635D]">{data.delegate.city}, {data.delegate.stateCountry}</span>
          </div>

          <div>
            <span className="text-[#59635D] font-medium block">Estimated Total</span>
            <span className="font-num font-extrabold text-[#0B6B43] text-base block">{formatCurrency(pricing.grandTotal)}</span>
            <span className="text-[#59635D]">Payable upon approval</span>
          </div>
        </div>

        {/* Secretariat Simulator Desk */}
        <div className="p-4 rounded-[10px] bg-emerald-50/70 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B6B43] uppercase tracking-wider">
              Secretariat Desk Simulator
            </span>
            <span className="text-[10px] font-semibold text-[#0B6B43] bg-white px-2 py-0.5 rounded border border-emerald-200">
              Interactive Test
            </span>
          </div>

          <p className="text-xs text-[#151A17] leading-relaxed">
            Simulate secretariat review action. Approving the registration immediately issues the official <strong>Digital Event Ticket</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {data.status !== 'approved' ? (
              <button
                type="button"
                onClick={() => onStatusChange('approved')}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Approve & Issue Digital Ticket →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onViewTicket}
                className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5"
              >
                <span>View Digital Ticket →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onEditRegistration}
              className="px-3 py-2 text-xs font-semibold text-[#59635D] hover:text-[#151A17] cursor-pointer ml-auto"
            >
              Edit Registration
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
