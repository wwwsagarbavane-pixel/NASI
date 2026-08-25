import React, { useState } from 'react';
import { 
  Printer, 
  Wallet,
  CheckCircle2
} from 'lucide-react';
import { RegistrationPackageData } from '../types';
import { calculatePricing, formatCurrency } from '../utils/pricing';

interface DigitalEventTicketProps {
  data: RegistrationPackageData;
  onBackToStatus: () => void;
}

export const DigitalEventTicket: React.FC<DigitalEventTicketProps> = ({ data, onBackToStatus }) => {
  const [walletAdded, setWalletAdded] = useState(false);
  const pricing = calculatePricing(data);

  const handlePrint = () => {
    window.print();
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 3000);
  };

  return (
    <div className="max-w-[760px] mx-auto space-y-10 py-6 font-sans">
      
      {/* Top Welcome */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0B6B43]">
            OFFICIAL EVENT PASS
          </span>
          <span className="w-8 h-[2px] bg-[#0B6B43]" />
          <span className="w-2 h-[2px] bg-[#E89A24]" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151A17] tracking-tight">
          Indian Seed Congress 2027
        </h1>
        <p className="text-sm font-semibold text-[#0B6B43]">
          Ramoji Film City, Hyderabad
        </p>
      </div>

      {/* ==================================================== */}
      {/* DIGITAL REGISTRATION TICKET */}
      {/* ==================================================== */}
      <div className="print-container bg-white rounded-[14px] border border-[#DDE5DF] overflow-hidden max-w-lg mx-auto shadow-sm">
        
        {/* Ticket Header (Green with Orange accent line) */}
        <div className="bg-[#0B6B43] text-white p-6 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-200 block mb-1">
                OFFICIAL DELEGATE PASS · ISC 2027
              </span>
              <h2 className="text-xl font-bold text-white">
                Indian Seed Congress 2027
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">Ramoji Film City, Hyderabad</p>
            </div>

            <div className="text-right bg-white/10 px-3 py-1.5 rounded-[6px] border border-white/10">
              <span className="text-[9px] font-mono uppercase font-bold text-emerald-200 block">Access</span>
              <span className="text-xs font-mono font-extrabold text-[#E89A24] tracking-wider">ADMIT ONE</span>
            </div>
          </div>
        </div>

        {/* Orange Accent Line */}
        <div className="h-1 w-full bg-[#E89A24]" />

        {/* Ticket Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Left: Delegate Details */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#7A847E] uppercase tracking-wider block">
                  Delegate Name
                </span>
                <span className="text-lg font-bold text-[#151A17] block mt-0.5">
                  {data.delegate.name || 'Rahul Sharma'}
                </span>
                <span className="text-xs text-[#59635D] block">
                  {data.delegate.designation || 'Director'} · {data.delegate.organization || 'Acme Seeds Pvt. Ltd.'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#7A847E] uppercase tracking-wider block">Category</span>
                  <span className="font-bold text-[#0B6B43]">{data.delegate.membershipType === 'member' ? 'NSAI Member' : 'Non-Member'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#7A847E] uppercase tracking-wider block">Total Payable</span>
                  <span className="font-num font-bold text-[#151A17]">{formatCurrency(pricing.grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-0.5 text-xs text-[#151A17] font-medium pt-1">
                <div>Dates: FEBRUARY 2027</div>
                <div>Venue: Ramoji Film City, Hyderabad</div>
              </div>
            </div>

            {/* Right: High-Res QR Code */}
            <div className="sm:col-span-4 flex flex-col items-center sm:items-end justify-center space-y-2">
              <div className="p-2.5 bg-[#F4F8F5] border border-[#DDE5DF] rounded-[10px] flex flex-col items-center">
                <div className="w-24 h-24 bg-white p-1.5 border border-[#DDE5DF] flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-[#0B6B43]">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="10" width="10" height="10" />
                    
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                    <rect x="80" y="10" width="10" height="10" />
                    
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                    <rect x="10" y="80" width="10" height="10" />
                    
                    <rect x="35" y="10" width="10" height="10" />
                    <rect x="50" y="15" width="10" height="15" />
                    <rect x="35" y="35" width="30" height="30" />
                    <rect x="70" y="40" width="15" height="15" />
                    <rect x="40" y="75" width="15" height="20" />
                    <rect x="75" y="70" width="20" height="20" />
                  </svg>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#7A847E] mt-1">VENUE VERIFICATION</span>
              </div>

              <div className="text-center sm:text-right">
                <span className="text-[9px] font-mono font-bold text-[#7A847E] uppercase block">Ticket ID</span>
                <span className="text-xs font-mono font-bold text-[#151A17]">{data.ticketId}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Perforation Separator */}
        <div className="relative flex items-center px-4">
          <div className="w-3 h-5 bg-[#F4F8F5] rounded-r-full -ml-4 border-r border-t border-b border-[#DDE5DF]" />
          <div className="flex-1 border-t border-dashed border-[#DDE5DF] mx-2" />
          <div className="w-3 h-5 bg-[#F4F8F5] rounded-l-full -mr-4 border-l border-t border-b border-[#DDE5DF]" />
        </div>

        {/* Ticket Footer */}
        <div className="p-4 bg-[#F4F8F5] border-t border-[#DDE5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-[4px] bg-emerald-100 text-[#0B6B43] font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>APPROVED ✓</span>
            </span>
            <span className="text-[#59635D] font-mono text-[11px]">Ref: {data.applicationId}</span>
          </div>

          <span className="text-[11px] text-[#59635D] font-medium">
            National Seed Association of India
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="btn-primary text-xs sm:text-sm flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Download / Print Ticket</span>
        </button>

        <button
          type="button"
          onClick={handleAddToWallet}
          className="btn-secondary text-xs sm:text-sm flex items-center gap-2"
        >
          <Wallet className="w-4 h-4 text-[#0B6B43]" />
          <span>{walletAdded ? '✓ Added to Wallet' : 'Add to Wallet Pass'}</span>
        </button>

        <button
          type="button"
          onClick={onBackToStatus}
          className="px-4 py-2.5 text-xs font-semibold text-[#59635D] hover:text-[#151A17] cursor-pointer"
        >
          <span>View Application Status</span>
        </button>
      </div>

    </div>
  );
};
