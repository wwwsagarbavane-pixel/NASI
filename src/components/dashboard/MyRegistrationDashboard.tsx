import React from 'react';
import { 
  ShieldCheck, 
  User, 
  Heart, 
  BedDouble, 
  Table2, 
  Store, 
  Award, 
  BookOpen, 
  Coins,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { 
  RegistrationPackageData, 
  DynamicRates,
  RegCategory,
  SpousePackage,
  HotelRoomAdmin,
  SponsorshipPackageAdmin,
  AdvertisementPackageAdmin,
  StallTypeAdmin,
  TableTypeAdmin
} from '../../types';
import { calculatePricing, formatCurrency } from '../../utils/pricing';
import { SPONSORSHIP_OPTIONS, STALL_OPTIONS, SOUVENIR_OPTIONS } from '../../data/eventData';

interface MyRegistrationDashboardProps {
  data: RegistrationPackageData;
  onEditRegistration: () => void;
  onViewTicket: () => void;
  onCompletePayment: () => void;
  dynamicRates: DynamicRates;
  categories?: RegCategory[];
  spousePackages?: SpousePackage[];
  hotelRooms?: HotelRoomAdmin[];
  sponsorshipPackages?: SponsorshipPackageAdmin[];
  advertisementPackages?: AdvertisementPackageAdmin[];
  stallTypes?: StallTypeAdmin[];
  tableTypes?: TableTypeAdmin[];
}

export const MyRegistrationDashboard: React.FC<MyRegistrationDashboardProps> = ({
  data,
  onEditRegistration,
  onViewTicket,
  onCompletePayment,
  dynamicRates,
  categories,
  spousePackages,
  hotelRooms,
  sponsorshipPackages,
  advertisementPackages,
  stallTypes,
  tableTypes
}) => {
  const pricing = calculatePricing(data, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages);
  const { delegate, spouse, stay, tradingTable, exhibition, sponsorship, advertisement, payment, status } = data;

  const selectedSponsor = sponsorship.enabled
    ? SPONSORSHIP_OPTIONS.find((s) => s.id === sponsorship.tier)
    : null;

  const selectedStall = exhibition.enabled
    ? STALL_OPTIONS.find((s) => s.id === exhibition.stallType)
    : null;

  const selectedAd = advertisement.enabled
    ? SOUVENIR_OPTIONS.find((a) => a.id === advertisement.placement)
    : null;

  const isEditable = status === 'pending' || status === 'changes_required';
  const isApproved = status === 'approved';
  const isSubmitted = status !== 'pending' && status !== 'changes_required';

  // Status Helpers
  const getStatusBadge = () => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0B6B43] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'changes_required':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Action Required
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-8 py-8 px-4 sm:px-6">
      
      {/* 1. Header Details */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DDE5DF] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#151A17] tracking-tight">
            My Registration
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#7A847E] uppercase tracking-wider">Registration ID:</span>
            <span className="text-sm font-bold text-[#0B6B43] font-mono">{data.registrationId || 'ISC27-PENDING'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {isApproved && (
            <button
              type="button"
              onClick={onViewTicket}
              className="inline-flex items-center gap-1 px-4 py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white text-xs font-bold rounded-[8px] tracking-wide transition-all shadow-xs"
            >
              View Ticket <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Timeline Status Block */}
      <div className="bg-white border border-[#DDE5DF] rounded-[9px] p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A847E]">
          Application Progress
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative pt-2">
          {/* Progress Bar (Desktop only) */}
          <div className="hidden sm:block absolute left-0 right-0 top-6 h-0.5 bg-slate-100 z-0">
            <div 
              className="h-full bg-[#0B6B43] transition-all duration-500" 
              style={{
                width: isApproved ? '100%' : status === 'under_review' ? '66%' : isSubmitted ? '33%' : '10%'
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              isSubmitted || isApproved ? 'bg-[#0B6B43] border-[#0B6B43] text-white' : 'bg-white border-[#DDE5DF] text-[#7A847E]'
            }`}>
              {isSubmitted || isApproved ? '✓' : '1'}
            </div>
            <div className="text-left sm:text-center">
              <span className="text-xs font-bold text-[#151A17] block">Submitted</span>
              <span className="text-[10px] text-[#7A847E]">{data.submissionDate || 'Pending'}</span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              status === 'under_review' || isApproved ? 'bg-[#0B6B43] border-[#0B6B43] text-white' : 
              status === 'changes_required' ? 'bg-rose-600 border-rose-600 text-white' :
              'bg-white border-[#DDE5DF] text-[#7A847E]'
            }`}>
              {status === 'under_review' || isApproved ? '✓' : status === 'changes_required' ? '!' : '2'}
            </div>
            <div className="text-left sm:text-center">
              <span className="text-xs font-bold text-[#151A17] block">Under Review</span>
              <span className="text-[10px] text-[#7A847E]">
                {status === 'changes_required' ? 'Action Required' : status === 'under_review' ? 'Secretariat Checking' : 'Completed'}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              isApproved ? 'bg-[#0B6B43] border-[#0B6B43] text-white' : 'bg-white border-[#DDE5DF] text-[#7A847E]'
            }`}>
              {isApproved ? '✓' : '3'}
            </div>
            <div className="text-left sm:text-center">
              <span className="text-xs font-bold text-[#151A17] block">Approved</span>
              <span className="text-[10px] text-[#7A847E]">{isApproved ? 'Approved ✓' : 'Awaiting'}</span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
              isApproved ? 'bg-[#0B6B43] border-[#0B6B43] text-white' : 'bg-white border-[#DDE5DF] text-[#7A847E]'
            }`}>
              {isApproved ? '✓' : '4'}
            </div>
            <div className="text-left sm:text-center">
              <span className="text-xs font-bold text-[#151A17] block">Event Ticket</span>
              <span className="text-[10px] text-[#7A847E]">{isApproved ? 'Available ✓' : 'Locked'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Package Sections Summary Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Col */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A847E] px-1">
            Registered Services & Status
          </h3>

          <div className="bg-white border border-[#DDE5DF] rounded-[9px] divide-y divide-[#DDE5DF]/60 overflow-hidden text-xs">
            {/* Delegate Row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">Delegate</span>
                  <span className="text-[#59635D]">{delegate.membershipType === 'member' ? 'NSAI Member' : 'Non-Member'}</span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">{formatCurrency(pricing.delegateTotal)}</span>
            </div>

            {/* Spouse Row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">Spouse Pass</span>
                  <span className="text-[#59635D]">{spouse.enabled ? `${spouse.list?.length || 1} Accompanying` : 'Not Added'}</span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">
                {spouse.enabled ? formatCurrency(pricing.spouseTotal) : '—'}
              </span>
            </div>

            {/* Hotel stay Row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">Hotel Room Stay</span>
                  <span className="text-[#59635D]">{stay.enabled ? `${stay.nights} Nights Room` : 'Not Added'}</span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">
                {stay.enabled ? formatCurrency(pricing.stayTotal) : '—'}
              </span>
            </div>

            {/* Trading Table Row */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <Table2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">B2B Trading Table</span>
                  <span className="text-[#59635D]">{tradingTable.enabled ? `${tradingTable.quantity} Table(s)` : 'Not Added'}</span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">
                {tradingTable.enabled ? formatCurrency(pricing.tradingTableTotal) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A847E] px-1 invisible md:visible">
            Promotional & Setup Status
          </h3>

          <div className="bg-white border border-[#DDE5DF] rounded-[9px] divide-y divide-[#DDE5DF]/60 overflow-hidden text-xs">
            {/* Exhibition Stall */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">Exhibition Stall</span>
                  <span className="text-[#59635D]">{exhibition.enabled ? `${selectedStall?.name} (${selectedStall?.size})` : 'Not Added'}</span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">
                {exhibition.enabled ? formatCurrency(pricing.exhibitionTotal) : '—'}
              </span>
            </div>

            {/* Sponsorship */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">Sponsorship Tier</span>
                  <span className="text-[#59635D]">{sponsorship.enabled ? selectedSponsor?.name : 'Not Added'}</span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">
                {sponsorship.enabled ? formatCurrency(pricing.sponsorshipTotal) : '—'}
              </span>
            </div>

            {/* Souvenir Ad */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B6B43] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#151A17] block text-sm">Souvenir Advertisement</span>
                  <span className="text-[#59635D]">
                    {advertisement.enabled ? (advertisement.useIncludedWithSponsor ? 'Included with Sponsor' : selectedAd?.name) : 'Not Added'}
                  </span>
                </div>
              </div>
              <span className="font-bold text-[#151A17] font-mono-num">
                {advertisement.enabled ? (advertisement.useIncludedWithSponsor ? 'Included (₹0)' : formatCurrency(pricing.advertisementTotal)) : '—'}
              </span>
            </div>

            {/* Grand Total Row */}
            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <span className="font-bold text-[#151A17] text-sm uppercase tracking-wider">Grand Total</span>
              <span className="font-extrabold text-[#0B6B43] text-base font-mono-num">{formatCurrency(pricing.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Edit Actions Area */}
      {isEditable ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-[9px] text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#0B6B43] block">Registration in draft mode</span>
            <span className="text-[#59635D]">You can modify your details, spouse details, stay, trading table, exhibition, or sponsorship.</span>
          </div>
          <button
            type="button"
            onClick={onEditRegistration}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[8px] transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Details
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-[9px] text-xs text-[#59635D]">
          <span className="font-bold text-[#151A17] block">Registration details locked</span>
          Your application is currently under review by the ISC Secretariat. Editing details is disabled. If changes are required, you will receive an email notification.
        </div>
      )}

      {/* 5. Payment Details Card */}
      <div id="payment-status-block" className="bg-white border border-[#DDE5DF] rounded-[9px] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDE5DF] pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#0B6B43]" />
            <h3 className="font-bold text-[#151A17] text-sm">Payment Status</h3>
          </div>
          <span className="font-bold text-[#151A17] font-mono-num">{formatCurrency(pricing.grandTotal)}</span>
        </div>

        {payment && payment.transactionRef || payment?.ddChequeNumber ? (
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-[6px]">
              <div>
                <span className="text-[#59635D] block font-medium">Payment Method</span>
                <span className="font-bold text-[#151A17]">
                  {payment.method === 'bank_transfer' ? 'Bank Wire Transfer' : 'Demand Draft / Cheque'}
                </span>
              </div>
              <div>
                <span className="text-[#59635D] block font-medium">Reference Number</span>
                <span className="font-bold text-[#151A17] font-mono">
                  {payment.method === 'bank_transfer' ? payment.transactionRef : payment.ddChequeNumber}
                </span>
              </div>
              <div>
                <span className="text-[#59635D] block font-medium">Submission Status</span>
                <span className="flex items-center gap-1 font-bold text-[#0B6B43]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Submitted
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#7A847E]">
              ✓ Payment details have been submitted. The secretariat is verifying the wire transfer.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs pt-2">
            <p className="text-[#59635D]">
              Grand total of <span className="font-bold text-[#151A17]">{formatCurrency(pricing.grandTotal)}</span> is unpaid. Please submit bank wire transfer details to verify registration.
            </p>
            <button
              type="button"
              onClick={onCompletePayment}
              className="px-4 py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[8px] transition-all whitespace-nowrap shadow-xs"
            >
              Complete Payment
            </button>
          </div>
        )}
      </div>

      {/* 6. Complete Registration Details Preview */}
      <div className="bg-white border border-[#DDE5DF] rounded-[9px] p-6 shadow-xs space-y-6">
        <h3 className="font-extrabold text-[#151A17] text-lg tracking-tight border-b border-[#DDE5DF] pb-3">
          Registration Details
        </h3>

        {/* Delegate Details block */}
        <div className="space-y-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A847E] block">Delegate Details</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs bg-slate-50 p-4 rounded-[6px]">
            <div>
              <span className="text-[#59635D] block">Name</span>
              <span className="font-bold text-[#151A17] text-sm">{delegate.name || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-[#59635D] block">Designation</span>
              <span className="font-bold text-[#151A17]">{delegate.designation || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-[#59635D] block">Organization</span>
              <span className="font-bold text-[#151A17]">{delegate.organization || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-[#59635D] block">State / Country</span>
              <span className="font-bold text-[#151A17]">{delegate.stateCountry || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-[#59635D] block">Email</span>
              <span className="font-bold text-[#151A17] font-mono">{delegate.email || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-[#59635D] block">Mobile</span>
              <span className="font-bold text-[#151A17] font-mono">{delegate.mobile || 'Not filled'}</span>
            </div>
          </div>
        </div>

        {/* Spouse Details block */}
        {spouse.enabled && (
          <div className="space-y-3.5 border-t border-[#DDE5DF]/60 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A847E] block">Spouse Details</span>
            <div className="text-xs bg-slate-50 p-4 rounded-[6px] space-y-2">
              {(spouse.list || []).map((sp, idx) => (
                <div key={sp.id || idx} className="flex justify-between items-center py-1">
                  <div>
                    <span className="font-bold text-[#151A17] block">Spouse {idx + 1}: {sp.name}</span>
                    {sp.email && <span className="text-[#59635D] font-mono text-[11px] block">{sp.email}</span>}
                  </div>
                  <span className="font-bold text-[#0B6B43] font-mono-num">₹20,000</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stay details block */}
        {stay.enabled && (
          <div className="space-y-3.5 border-t border-[#DDE5DF]/60 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A847E] block">Hotel Stay Accommodation</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-xs bg-slate-50 p-4 rounded-[6px]">
              <div>
                <span className="text-[#59635D] block">Check-in</span>
                <span className="font-bold text-[#151A17] font-mono">{stay.checkInDate}</span>
              </div>
              <div>
                <span className="text-[#59635D] block">Check-out</span>
                <span className="font-bold text-[#151A17] font-mono">{stay.checkOutDate}</span>
              </div>
              <div>
                <span className="text-[#59635D] block">Nights Booking</span>
                <span className="font-bold text-[#151A17]">{stay.nights} Nights (@ ₹15,000/night)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Sponsorship Information Preview Section */}
      <div className="bg-white border border-[#DDE5DF] rounded-[9px] p-6 shadow-xs space-y-5">
        <h3 className="font-extrabold text-[#151A17] text-lg tracking-tight border-b border-[#DDE5DF] pb-3">
          Sponsorship Details
        </h3>

        {sponsorship.enabled && selectedSponsor ? (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-[6px] border border-[#DDE5DF]/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#0B6B43] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase font-mono tracking-wider">
                  Selected Sponsor
                </span>
                <h4 className="text-base font-extrabold text-[#151A17] tracking-tight">{selectedSponsor.name}</h4>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[#59635D] block text-[10px] uppercase font-bold tracking-wider">Sponsorship Fee</span>
                <span className="text-base font-extrabold text-[#0B6B43] font-mono-num">{selectedSponsor.formattedPrice}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#151A17] block">Sponsorship Inclusions:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 list-disc text-[#59635D]">
                {selectedSponsor.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs pt-1">
            <span className="text-[#59635D] italic">No Sponsorship Selected. Explore custom sponsorship options to promote your brand.</span>
            {isEditable && (
              <button
                type="button"
                onClick={onEditRegistration}
                className="px-4 py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded-[8px] transition-all whitespace-nowrap shadow-xs"
              >
                Explore Sponsorship
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
