import React, { useEffect, useState, useRef } from 'react';
import { 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Receipt,
  ShieldCheck,
  Send,
  QrCode,
  Smartphone,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { 
  RegistrationPackageData, 
  SingleDelegate, 
  SpouseDetails, 
  SpouseItem,
  StayDetails, 
  TradingTableDetails, 
  ExhibitionDetails, 
  SponsorshipDetails, 
  AdvertisementDetails, 
  PaymentDetails,
  ValidationErrors, 
  StallType,
  SponsorshipTier,
  SouvenirPlacement,
  DynamicRates,
  RegCategory,
  SpousePackage,
  HotelRoomAdmin,
  SponsorshipPackageAdmin,
  AdvertisementPackageAdmin,
  StallTypeAdmin,
  TableTypeAdmin
} from '../types';
import { 
  INDIAN_STATES_COUNTRIES, 
  STALL_OPTIONS, 
  SPONSORSHIP_OPTIONS, 
  SOUVENIR_OPTIONS,
  BANK_DETAILS,
  UPI_DETAILS
} from '../data/eventData';
import { calculatePricing, formatCurrency } from '../utils/pricing';

interface SmartRegistrationFormProps {
  data: RegistrationPackageData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  onUpdateDelegate: (field: keyof SingleDelegate, value: any) => void;
  onUpdateSpouse: (updated: Partial<SpouseDetails>) => void;
  onUpdateStay: (updated: Partial<StayDetails>) => void;
  onUpdateTradingTable: (updated: Partial<TradingTableDetails>) => void;
  onUpdateExhibition: (updated: Partial<ExhibitionDetails>) => void;
  onUpdateSponsorship: (updated: Partial<SponsorshipDetails>) => void;
  onUpdateAdvertisement: (updated: Partial<AdvertisementDetails>) => void;
  onUpdatePayment: (updated: Partial<PaymentDetails>) => void;
  onToggleTerms: (checked: boolean) => void;
  onSubmit: () => void;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  onSetEmailVerified: (val: boolean) => void;
  onSetMobileVerified: (val: boolean) => void;
  dynamicRates: DynamicRates;
  categories?: RegCategory[];
  spousePackages?: SpousePackage[];
  hotelRooms?: HotelRoomAdmin[];
  sponsorshipPackages?: SponsorshipPackageAdmin[];
  advertisementPackages?: AdvertisementPackageAdmin[];
  stallTypes?: StallTypeAdmin[];
  tableTypes?: TableTypeAdmin[];
}

export const SmartRegistrationForm: React.FC<SmartRegistrationFormProps> = ({
  data,
  errors,
  isSubmitting,
  onUpdateDelegate,
  onUpdateSpouse,
  onUpdateStay,
  onUpdateTradingTable,
  onUpdateExhibition,
  onUpdateSponsorship,
  onUpdateAdvertisement,
  onUpdatePayment,
  onToggleTerms,
  onSubmit,
  isEmailVerified,
  isMobileVerified,
  onSetEmailVerified,
  onSetMobileVerified,
  dynamicRates,
  categories,
  spousePackages,
  hotelRooms,
  sponsorshipPackages,
  advertisementPackages,
  stallTypes,
  tableTypes,
}) => {
  const [expandedSponsorId, setExpandedSponsorId] = useState<string | null>(null);
  const pricing = calculatePricing(data, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages);

  // Email inline OTP
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpValues, setEmailOtpValues] = useState<string[]>(Array(6).fill(''));
  const [emailTimer, setEmailTimer] = useState(0);
  const [emailError, setEmailError] = useState('');
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Mobile inline OTP
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpValues, setMobileOtpValues] = useState<string[]>(Array(6).fill(''));
  const [mobileTimer, setMobileTimer] = useState(0);
  const [mobileError, setMobileError] = useState('');
  const mobileOtpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Countdown timers
  useEffect(() => {
    let interval: any;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: any;
    if (mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer]);

  const handleSendEmailOtp = () => {
    setEmailError('');
    const email = data.delegate.email;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email first.');
      return;
    }
    setEmailOtpSent(true);
    setEmailTimer(30);
    setEmailOtpValues(Array(6).fill(''));
    setTimeout(() => emailOtpRefs.current[0]?.focus(), 100);
  };

  const handleVerifyEmailOtp = () => {
    setEmailError('');
    const fullOtp = emailOtpValues.join('');
    if (fullOtp.length < 6) {
      setEmailError('Enter 6-digit OTP.');
      return;
    }
    if (fullOtp !== '123456') {
      setEmailError('Invalid OTP.');
      return;
    }
    onSetEmailVerified(true);
    setEmailOtpSent(false);
  };

  const handleEmailOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newValues = [...emailOtpValues];
    newValues[index] = value;
    setEmailOtpValues(newValues);
    if (value !== '' && index < 5) {
      emailOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newValues = [...emailOtpValues];
      if (newValues[index] === '' && index > 0) {
        newValues[index - 1] = '';
        setEmailOtpValues(newValues);
        emailOtpRefs.current[index - 1]?.focus();
      } else {
        newValues[index] = '';
        setEmailOtpValues(newValues);
      }
    }
  };

  const handleSendMobileOtp = () => {
    setMobileError('');
    const mobile = data.delegate.mobile;
    if (!mobile || mobile.length < 10) {
      setMobileError('Please enter a valid 10-digit mobile.');
      return;
    }
    setMobileOtpSent(true);
    setMobileTimer(30);
    setMobileOtpValues(Array(6).fill(''));
    setTimeout(() => mobileOtpRefs.current[0]?.focus(), 100);
  };

  const handleVerifyMobileOtp = () => {
    setMobileError('');
    const fullOtp = mobileOtpValues.join('');
    if (fullOtp.length < 6) {
      setMobileError('Enter 6-digit OTP.');
      return;
    }
    if (fullOtp !== '123456') {
      setMobileError('Invalid OTP.');
      return;
    }
    onSetMobileVerified(true);
    setMobileOtpSent(false);
  };

  const handleMobileOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newValues = [...mobileOtpValues];
    newValues[index] = value;
    setMobileOtpValues(newValues);
    if (value !== '' && index < 5) {
      mobileOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleMobileOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newValues = [...mobileOtpValues];
      if (newValues[index] === '' && index > 0) {
        newValues[index - 1] = '';
        setMobileOtpValues(newValues);
        mobileOtpRefs.current[index - 1]?.focus();
      } else {
        newValues[index] = '';
        setMobileOtpValues(newValues);
      }
    }
  };

  // Ensure spouse list has at least 1 item when enabled
  useEffect(() => {
    if (data.spouse.enabled && (!data.spouse.list || data.spouse.list.length === 0)) {
      onUpdateSpouse({
        list: [
          {
            id: 'spouse-1',
            name: data.spouse.name || '',
            mobile: data.spouse.mobile || '',
            email: data.spouse.email || '',
          },
        ],
      });
    }
  }, [data.spouse.enabled]);

  // Auto calculate nights
  useEffect(() => {
    if (data.stay.checkInDate && data.stay.checkOutDate) {
      const inDate = new Date(data.stay.checkInDate);
      const outDate = new Date(data.stay.checkOutDate);
      const diffTime = outDate.getTime() - inDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const calculatedNights = Math.max(1, diffDays > 0 ? diffDays : 1);
      if (calculatedNights !== data.stay.nights) {
        onUpdateStay({ nights: calculatedNights });
      }
    }
  }, [data.stay.checkInDate, data.stay.checkOutDate]);

  const selectedSponsor = data.sponsorship.enabled
    ? SPONSORSHIP_OPTIONS.find((s) => s.id === data.sponsorship.tier)
    : null;

  const selectedStall = data.exhibition.enabled
    ? STALL_OPTIONS.find((s) => s.id === data.exhibition.stallType)
    : null;

  const selectedAd = data.advertisement.enabled
    ? SOUVENIR_OPTIONS.find((a) => a.id === data.advertisement.placement)
    : null;

  const sponsorHasAd = selectedSponsor && selectedSponsor.includesAd !== 'none';
  const sponsorHasTable = selectedSponsor && selectedSponsor.includesTable;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const paymentMethod = data.payment?.method || 'bank_transfer';

  // Spouse list handlers
  const handleAddSpouse = () => {
    const currentList = data.spouse.list || [];
    const newSpouse: SpouseItem = {
      id: `spouse-${Date.now()}`,
      name: '',
      mobile: '',
      email: '',
    };
    onUpdateSpouse({ list: [...currentList, newSpouse] });
  };

  const handleUpdateSpouseItem = (index: number, field: keyof SpouseItem, value: string) => {
    const currentList = [...(data.spouse.list || [])];
    if (currentList[index]) {
      currentList[index] = { ...currentList[index], [field]: value };
      onUpdateSpouse({ 
        list: currentList,
        ...(index === 0 ? { [field]: value } : {})
      });
    }
  };

  const handleRemoveSpouseItem = (index: number) => {
    const currentList = [...(data.spouse.list || [])];
    if (currentList.length > 1) {
      currentList.splice(index, 1);
      onUpdateSpouse({ list: currentList });
    } else {
      onUpdateSpouse({ enabled: false, list: [] });
    }
  };

  const spouseList = data.spouse.list || [];

  return (
    <div className="max-w-[1180px] mx-auto font-sans">
      
      {/* ==================================================== */}
      {/* 8 COLS FORM AREA + 4 COLS STICKY SUMMARY AREA */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ==================================================== */}
        {/* FULL 12 COLUMNS: CENTERED REGISTRATION FORM */}
        {/* ==================================================== */}
        <div className="lg:col-span-12 max-w-[850px] mx-auto w-full space-y-0">
          
          {/* ==================================================== */}
          {/* 01 — DELEGATE REGISTRATION (White Background) */}
          {/* ==================================================== */}
          <section id="section-01" className="pt-2 pb-14 bg-white">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    01
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Delegate Registration
                </h2>
              </div>

              <span className="text-[11px] font-bold text-[#0B6B43] uppercase tracking-wider pb-1">
                REQUIRED
              </span>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-6">
              
              {/* Registration Category */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17]">
                  Registration Category <span className="text-[#E89A24] font-bold">*</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
                  {categories && categories.length > 0 ? (
                    categories.filter(c => c.status === 'active').map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => onUpdateDelegate('membershipType', cat.id)}
                        className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                          data.delegate.membershipType === cat.id
                            ? 'border-[#0B6B43] bg-[#F7FAF8] ring-1 ring-[#0B6B43]'
                            : 'bg-white border-[#DDE5DF] text-[#151A17] hover:border-[#0B6B43]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              data.delegate.membershipType === cat.id
                                ? 'border-[#0B6B43] bg-[#0B6B43] text-white'
                                : 'border-[#DDE5DF] bg-white'
                            }`}
                          >
                            {data.delegate.membershipType === cat.id && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#151A17] block">{cat.name}</span>
                            <span className="text-xs text-[#59635D]">{cat.description}</span>
                          </div>
                        </div>
                        <span className="font-mono-num text-base font-bold text-[#0B6B43]">{formatCurrency(cat.price)}</span>
                      </button>
                    ))
                  ) : (
                    <>
                      {/* NSAI Member */}
                      <button
                        type="button"
                        onClick={() => onUpdateDelegate('membershipType', 'member')}
                        className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                          data.delegate.membershipType === 'member'
                            ? 'border-[#0B6B43] bg-[#F7FAF8] ring-1 ring-[#0B6B43]'
                            : 'bg-white border-[#DDE5DF] text-[#151A17] hover:border-[#0B6B43]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              data.delegate.membershipType === 'member'
                                ? 'border-[#0B6B43] bg-[#0B6B43] text-white'
                                : 'border-[#DDE5DF] bg-white'
                            }`}
                          >
                            {data.delegate.membershipType === 'member' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#151A17] block">NSAI Member</span>
                            <span className="text-xs text-[#59635D]">Official member rate</span>
                          </div>
                        </div>
                        <span className="font-mono-num text-base font-bold text-[#0B6B43]">₹25,000</span>
                      </button>

                      {/* Non-Member */}
                      <button
                        type="button"
                        onClick={() => onUpdateDelegate('membershipType', 'non_member')}
                        className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                          data.delegate.membershipType === 'non_member'
                            ? 'border-[#0B6B43] bg-[#F7FAF8] ring-1 ring-[#0B6B43]'
                            : 'bg-white border-[#DDE5DF] text-[#151A17] hover:border-[#0B6B43]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              data.delegate.membershipType === 'non_member'
                                ? 'border-[#0B6B43] bg-[#0B6B43] text-white'
                                : 'border-[#DDE5DF] bg-white'
                            }`}
                          >
                            {data.delegate.membershipType === 'non_member' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#151A17] block">Non-Member</span>
                            <span className="text-xs text-[#59635D]">Standard delegate rate</span>
                          </div>
                        </div>
                        <span className="font-mono-num text-base font-bold text-[#0B6B43]">₹30,000</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    Delegate Name <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Rajesh Sharma"
                    value={data.delegate.name}
                    onChange={(e) => onUpdateDelegate('name', e.target.value)}
                    className={`isc-input ${errors.name ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    Designation <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Managing Director"
                    value={data.delegate.designation}
                    onChange={(e) => onUpdateDelegate('designation', e.target.value)}
                    className={`isc-input ${errors.designation ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.designation && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.designation}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    Mobile Number <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    disabled={isMobileVerified}
                    placeholder="9876543210"
                    value={data.delegate.mobile}
                    onChange={(e) => onUpdateDelegate('mobile', e.target.value.replace(/[^0-9]/g, ''))}
                    className={`isc-input font-mono-num ${errors.mobile ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.mobile && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.mobile}</p>}
                  
                  {/* Inline Mobile OTP */}
                  <div className="mt-2">
                    {isMobileVerified ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-[#0B6B43]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Mobile Verified
                        <button
                          type="button"
                          onClick={() => onSetMobileVerified(false)}
                          className="text-[#7A847E] hover:text-[#151A17] text-[10px] font-bold underline ml-2 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {!mobileOtpSent ? (
                          <button
                            type="button"
                            onClick={handleSendMobileOtp}
                            className="px-3 py-1.5 bg-[#0B6B43] hover:bg-[#08452F] text-white text-[10px] font-bold rounded-[6px] transition-all cursor-pointer"
                          >
                            Send OTP
                          </button>
                        ) : (
                          <div className="p-3 bg-slate-50 border border-[#DDE5DF] rounded-[6px] space-y-2 max-w-[280px]">
                            <span className="text-[10px] text-[#59635D] block">Enter Mobile OTP (use <span className="font-bold underline">123456</span>):</span>
                            <div className="flex gap-1.5">
                              {mobileOtpValues.map((val, idx) => (
                                <input
                                  key={idx}
                                  ref={el => (mobileOtpRefs.current[idx] = el)}
                                  type="text"
                                  maxLength={1}
                                  value={val}
                                  onChange={e => handleMobileOtpChange(idx, e.target.value)}
                                  onKeyDown={e => handleMobileOtpKeyDown(idx, e)}
                                  className="w-8 h-9 text-center text-sm font-bold border border-[#DDE5DF] rounded-[4px] focus:outline-none focus:border-[#0B6B43] bg-white text-[#151A17] font-mono"
                                />
                              ))}
                            </div>
                            {mobileError && <p className="text-[10px] text-rose-500 font-semibold">{mobileError}</p>}
                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={handleVerifyMobileOtp}
                                className="px-2.5 py-1 bg-[#0B6B43] hover:bg-[#08452F] text-white text-[10px] font-bold rounded-[4px] cursor-pointer"
                              >
                                Verify
                              </button>
                              {mobileTimer > 0 ? (
                                <span className="text-[9px] text-[#7A847E]">Resend in {mobileTimer}s</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSendMobileOtp}
                                  className="text-[9px] text-[#0B6B43] hover:underline font-bold cursor-pointer"
                                >
                                  Resend
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    Email Address <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    disabled={isEmailVerified}
                    placeholder="rajesh@company.com"
                    value={data.delegate.email}
                    onChange={(e) => onUpdateDelegate('email', e.target.value)}
                    className={`isc-input ${errors.email ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
                  
                  {/* Inline Email OTP */}
                  <div className="mt-2">
                    {isEmailVerified ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-[#0B6B43]">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Email Verified
                        <button
                          type="button"
                          onClick={() => onSetEmailVerified(false)}
                          className="text-[#7A847E] hover:text-[#151A17] text-[10px] font-bold underline ml-2 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {!emailOtpSent ? (
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            className="px-3 py-1.5 bg-[#0B6B43] hover:bg-[#08452F] text-white text-[10px] font-bold rounded-[6px] transition-all cursor-pointer"
                          >
                            Send OTP
                          </button>
                        ) : (
                          <div className="p-3 bg-slate-50 border border-[#DDE5DF] rounded-[6px] space-y-2 max-w-[280px]">
                            <span className="text-[10px] text-[#59635D] block">Enter Email OTP (use <span className="font-bold underline">123456</span>):</span>
                            <div className="flex gap-1.5">
                              {emailOtpValues.map((val, idx) => (
                                <input
                                  key={idx}
                                  ref={el => (emailOtpRefs.current[idx] = el)}
                                  type="text"
                                  maxLength={1}
                                  value={val}
                                  onChange={e => handleEmailOtpChange(idx, e.target.value)}
                                  onKeyDown={e => handleEmailOtpKeyDown(idx, e)}
                                  className="w-8 h-9 text-center text-sm font-bold border border-[#DDE5DF] rounded-[4px] focus:outline-none focus:border-[#0B6B43] bg-white text-[#151A17] font-mono"
                                />
                              ))}
                            </div>
                            {emailError && <p className="text-[10px] text-rose-500 font-semibold">{emailError}</p>}
                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={handleVerifyEmailOtp}
                                className="px-2.5 py-1 bg-[#0B6B43] hover:bg-[#08452F] text-white text-[10px] font-bold rounded-[4px] cursor-pointer"
                              >
                                Verify
                              </button>
                              {emailTimer > 0 ? (
                                <span className="text-[9px] text-[#7A847E]">Resend in {emailTimer}s</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSendEmailOtp}
                                  className="text-[9px] text-[#0B6B43] hover:underline font-bold cursor-pointer"
                                >
                                  Resend
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    Organization / Company <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Seeds Pvt Ltd"
                    value={data.delegate.organization}
                    onChange={(e) => onUpdateDelegate('organization', e.target.value)}
                    className={`isc-input ${errors.organization ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.organization && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.organization}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    Registered Address <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Plot No., Building Name, Street, Sector"
                    value={data.delegate.address}
                    onChange={(e) => onUpdateDelegate('address', e.target.value)}
                    className={`w-full p-3.5 rounded-[9px] border border-[#DDE5DF] bg-white text-[#151A17] text-sm focus:outline-none focus:border-[#0B6B43] focus:ring-3 focus:ring-[#0B6B43]/10 resize-none ${
                      errors.address ? 'border-rose-500 ring-2 ring-rose-100' : ''
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    City <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Hyderabad"
                    value={data.delegate.city}
                    onChange={(e) => onUpdateDelegate('city', e.target.value)}
                    className={`isc-input ${errors.city ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    PIN Code <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="500081"
                    value={data.delegate.pinCode}
                    onChange={(e) => onUpdateDelegate('pinCode', e.target.value)}
                    className={`isc-input font-mono-num ${errors.pinCode ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  />
                  {errors.pinCode && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.pinCode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    State / Country <span className="text-[#E89A24] font-bold">*</span>
                  </label>
                  <select
                    value={data.delegate.stateCountry}
                    onChange={(e) => onUpdateDelegate('stateCountry', e.target.value)}
                    className={`isc-input cursor-pointer ${errors.stateCountry ? 'border-rose-500 ring-2 ring-rose-100' : ''}`}
                  >
                    <option value="">Select State / Country...</option>
                    {INDIAN_STATES_COUNTRIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {errors.stateCountry && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.stateCountry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1.5">
                    NSAI Membership No. <span className="text-[#7A847E] font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="NSAI/2026/110"
                    value={data.delegate.nsaiMembershipNo}
                    onChange={(e) => onUpdateDelegate('nsaiMembershipNo', e.target.value)}
                    className="isc-input font-mono-num"
                  />
                </div>
              </div>

            </div>

          </section>

          {/* ==================================================== */}
          {/* 02 — SPOUSE & STAY (Subtle #F7FAF8 Background) */}
          {/* ==================================================== */}
          <section id="section-02" className="pt-20 sm:pt-24 pb-14 bg-[#F7FAF8] -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-[12px] border border-[#DDE5DF]/60">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    02
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Spouse & Stay
                </h2>
              </div>

              <span className="text-[11px] font-medium text-[#7A847E] uppercase tracking-wider pb-1">
                OPTIONAL
              </span>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-8">
              
              {/* 1. Spouse Choice */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[9px] bg-white border border-[#DDE5DF]">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#151A17]">
                      Spouse / Accompanying Person
                    </h3>
                    <p className="text-xs text-[#59635D]">₹20,000 per accompanying person pass</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateSpouse({ enabled: true })}
                      className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                        data.spouse.enabled
                          ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                          : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                      }`}
                    >
                      YES
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateSpouse({ enabled: false })}
                      className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                        !data.spouse.enabled
                          ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                          : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>

                {/* Multiple Spouses Entry */}
                {data.spouse.enabled && (
                  <div className="section-expand space-y-3 pt-1">
                    {spouseList.map((spouse, idx) => (
                      <div 
                        key={spouse.id || idx} 
                        className="p-4 bg-white rounded-[9px] border border-[#DDE5DF] space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#DDE5DF] pb-2">
                          <span className="text-xs font-mono-num font-bold text-[#0B6B43] uppercase tracking-wider">
                            Spouse 0{idx + 1}
                          </span>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-mono-num text-xs font-bold text-[#151A17]">₹20,000</span>
                            {spouseList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSpouseItem(idx)}
                                className="text-[#7A847E] hover:text-rose-600 p-1 transition-colors cursor-pointer text-xs font-semibold"
                                title="Remove spouse"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                              Full Name <span className="text-[#E89A24] font-bold">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Sunita Sharma"
                              value={spouse.name}
                              onChange={(e) => handleUpdateSpouseItem(idx, 'name', e.target.value)}
                              className={`isc-input text-sm ${
                                errors[`spouse_name_${idx}`] || (idx === 0 && errors.spouse_name)
                                  ? 'border-rose-500 ring-2 ring-rose-100'
                                  : ''
                              }`}
                            />
                            {(errors[`spouse_name_${idx}`] || (idx === 0 && errors.spouse_name)) && (
                              <p className="mt-1 text-xs text-rose-500">
                                {errors[`spouse_name_${idx}`] || errors.spouse_name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              placeholder="+91 98765 00000"
                              value={spouse.mobile}
                              onChange={(e) => handleUpdateSpouseItem(idx, 'mobile', e.target.value)}
                              className="isc-input text-sm font-mono-num"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              placeholder="spouse@email.com"
                              value={spouse.email}
                              onChange={(e) => handleUpdateSpouseItem(idx, 'email', e.target.value)}
                              className="isc-input text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleAddSpouse}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-xs font-bold text-[#0B6B43] bg-white border border-[#DDE5DF] hover:border-[#0B6B43] transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Another Spouse</span>
                      </button>

                      <span className="font-mono-num text-xs font-bold text-[#151A17]">
                        {pricing.spouseCount} {pricing.spouseCount === 1 ? 'Spouse' : 'Spouses'} · {formatCurrency(pricing.spouseTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Stay Choice */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[9px] bg-white border border-[#DDE5DF]">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#151A17]">
                      Hotel Accommodation
                    </h3>
                    <p className="text-xs text-[#59635D]">₹15,000 per night at partner hotel</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateStay({ 
                        enabled: true, 
                        checkInDate: data.stay.checkInDate || '2027-02-25', 
                        checkOutDate: data.stay.checkOutDate || '2027-02-27',
                        nights: data.stay.nights || 2 
                      })}
                      className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                        data.stay.enabled
                          ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                          : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                      }`}
                    >
                      YES
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateStay({ enabled: false })}
                      className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                        !data.stay.enabled
                          ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                          : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>

                {data.stay.enabled && (
                  <div className="section-expand p-4 bg-white rounded-[9px] border border-[#DDE5DF] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                          Check-in Date <span className="text-[#E89A24] font-bold">*</span>
                        </label>
                        <input
                          type="date"
                          value={data.stay.checkInDate}
                          onChange={(e) => onUpdateStay({ checkInDate: e.target.value })}
                          className="isc-input text-sm font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                          Check-out Date <span className="text-[#E89A24] font-bold">*</span>
                        </label>
                        <input
                          type="date"
                          value={data.stay.checkOutDate}
                          onChange={(e) => onUpdateStay({ checkOutDate: e.target.value })}
                          className="isc-input text-sm font-mono-num"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                          Total Nights & Amount
                        </label>
                        <div className="h-[52px] px-3.5 rounded-[9px] bg-[#F7FAF8] border border-[#DDE5DF] flex items-center justify-between text-xs sm:text-sm font-bold text-[#151A17]">
                          <span>{data.stay.nights} {data.stay.nights === 1 ? 'Night' : 'Nights'}</span>
                          <span className="font-mono-num text-[#0B6B43] font-bold">{formatCurrency(pricing.stayTotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </section>

          {/* ==================================================== */}
          {/* 03 — TABLE BOOKING (White Background) */}
          {/* ==================================================== */}
          <section id="section-03" className="pt-20 sm:pt-24 pb-14 bg-white">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    03
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Table Booking
                </h2>
              </div>

              <span className="text-[11px] font-medium text-[#7A847E] uppercase tracking-wider pb-1">
                OPTIONAL
              </span>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[9px] bg-[#F7FAF8] border border-[#DDE5DF]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#151A17]">
                    Would you like to book a table?
                  </h3>
                  <p className="text-xs text-[#59635D]">₹30,000 per table in central trading area</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateTradingTable({ enabled: true, quantity: data.tradingTable.quantity || 1 })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      data.tradingTable.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateTradingTable({ enabled: false })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      !data.tradingTable.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {data.tradingTable.enabled && (
                <div className="section-expand p-4 bg-white rounded-[9px] border border-[#DDE5DF] space-y-3">
                  {sponsorHasTable && data.sponsorship.useIncludedTradingTable && (
                    <div className="p-3 rounded-[8px] bg-[#F7FAF8] border border-[#DDE5DF] text-xs text-[#0B6B43] font-medium">
                      ✓ <strong>1 Trading Table Included</strong> with your {selectedSponsor?.name}.
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#151A17] block">Number of Tables</span>
                      <span className="text-xs text-[#59635D]">₹30,000 per unit</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onUpdateTradingTable({ quantity: Math.max(1, (data.tradingTable.quantity || 1) - 1) })}
                        disabled={(data.tradingTable.quantity || 1) <= 1}
                        className="w-9 h-9 rounded-[8px] bg-white border border-[#DDE5DF] text-[#151A17] flex items-center justify-center hover:border-[#0B6B43] disabled:opacity-40 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-6 text-center font-mono-num font-bold text-sm text-[#151A17]">
                        {data.tradingTable.quantity || 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateTradingTable({ quantity: Math.min(20, (data.tradingTable.quantity || 1) + 1) })}
                        className="w-9 h-9 rounded-[8px] bg-white border border-[#DDE5DF] text-[#151A17] flex items-center justify-center hover:border-[#0B6B43] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <span className="font-mono-num text-sm font-bold text-[#0B6B43] pl-2">
                        {data.tradingTable.quantity || 1} table{(data.tradingTable.quantity || 1) > 1 ? 's' : ''} · {formatCurrency(pricing.tradingTableTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </section>

          {/* ==================================================== */}
          {/* 04 — EXHIBITION STALL (Subtle #F7FAF8 Background) */}
          {/* ==================================================== */}
          <section id="section-04" className="pt-20 sm:pt-24 pb-14 bg-[#F7FAF8] -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-[12px] border border-[#DDE5DF]/60">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    04
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Exhibition Stall
                </h2>
              </div>

              <span className="text-[11px] font-medium text-[#7A847E] uppercase tracking-wider pb-1">
                OPTIONAL
              </span>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[9px] bg-white border border-[#DDE5DF]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#151A17]">
                    Would you like to book an exhibition stall?
                  </h3>
                  <p className="text-xs text-[#59635D]">Includes 1 complimentary delegate pass</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateExhibition({ enabled: true, stallType: data.exhibition.stallType || 'normal' })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      data.exhibition.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateExhibition({ enabled: false })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      !data.exhibition.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {data.exhibition.enabled && (
                <div className="section-expand grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(stallTypes && stallTypes.length > 0
                    ? stallTypes.filter(s => s.status === 'active')
                    : STALL_OPTIONS
                  ).map((stall) => {
                    const isSelected = data.exhibition.stallType === stall.id;
                    const displayPrice = 'formattedPrice' in stall ? (stall.formattedPrice as string) : formatCurrency(stall.price);

                    return (
                      <div
                        key={stall.id}
                        onClick={() => onUpdateExhibition({ stallType: stall.id as StallType })}
                        className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer relative bg-white ${
                          isSelected
                            ? 'border-[#0B6B43] bg-[#F7FAF8] ring-1 ring-[#0B6B43]'
                            : 'border-[#DDE5DF] hover:border-[#0B6B43]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-mono-num font-bold text-[#59635D] uppercase tracking-wider block">
                              {stall.size}
                            </span>
                            <h4 className="text-base font-bold text-[#151A17] mt-0.5">
                              {stall.name}
                            </h4>
                          </div>

                          <span className="font-mono-num text-base font-bold text-[#0B6B43]">
                            {displayPrice}
                          </span>
                        </div>

                        <p className="text-xs text-[#0B6B43] font-semibold mt-2.5 pt-2 border-t border-[#DDE5DF]">
                          ✓ Includes {'includedDelegates' in stall ? stall.includedDelegates : 1} Complimentary Delegate Pass
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </section>

          {/* ==================================================== */}
          {/* 05 — SPONSORSHIP (White Background) */}
          {/* ==================================================== */}
          <section id="section-05" className="pt-20 sm:pt-24 pb-14 bg-white">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    05
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Sponsorship
                </h2>
              </div>

              <span className="text-[11px] font-medium text-[#7A847E] uppercase tracking-wider pb-1">
                OPTIONAL
              </span>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[9px] bg-[#F7FAF8] border border-[#DDE5DF]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#151A17]">
                    Would you like to partner with ISC 2027?
                  </h3>
                  <p className="text-xs text-[#59635D]">Official corporate sponsorship tiers and branding</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSponsorship({ enabled: true, tier: data.sponsorship.tier || 'event' })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      data.sponsorship.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSponsorship({ enabled: false })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      !data.sponsorship.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {/* Clean Catalogue Rows */}
              {data.sponsorship.enabled && (
                <div className="section-expand space-y-2 pt-1">
                  <div className="divide-y divide-[#DDE5DF] border border-[#DDE5DF] rounded-[9px] overflow-hidden bg-white">
                    {(() => {
                      const activeSponsors = sponsorshipPackages && sponsorshipPackages.length > 0
                        ? sponsorshipPackages.filter(s => s.status === 'available').map(s => ({
                            id: s.id,
                            name: s.name,
                            tag: s.shortName,
                            price: s.price,
                            formattedPrice: formatCurrency(s.price),
                            benefits: s.benefits
                          }))
                        : SPONSORSHIP_OPTIONS;
                      return activeSponsors.map((sponsor, idx) => {
                        const isSelected = data.sponsorship.tier === sponsor.id;
                      const isExpanded = expandedSponsorId === sponsor.id;
                      const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

                      return (
                        <div
                          key={sponsor.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-[#F7FAF8] border-l-4 border-l-[#0B6B43]' : 'hover:bg-[#F7FAF8]/60'
                          }`}
                        >
                          <div
                            onClick={() => onUpdateSponsorship({ tier: sponsor.id as SponsorshipTier })}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="text-xs font-mono-num font-bold text-[#7A847E] w-6">
                                {numStr}
                              </span>

                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? 'border-[#0B6B43] bg-[#0B6B43] text-white' : 'border-[#DDE5DF] bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>

                              <div className="min-w-0">
                                <span className={`text-sm font-bold block ${isSelected ? 'text-[#0B6B43]' : 'text-[#151A17]'}`}>
                                  {sponsor.name}
                                </span>
                                <span className="text-xs text-[#59635D] block truncate">{sponsor.tag}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-5 flex-shrink-0 pl-9 sm:pl-0">
                              <span className="font-mono-num text-sm font-bold text-[#0B6B43]">
                                {sponsor.formattedPrice}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedSponsorId(isExpanded ? null : sponsor.id);
                                }}
                                className="text-xs font-semibold text-[#59635D] hover:text-[#0B6B43] flex items-center gap-1 cursor-pointer py-1"
                              >
                                <span>{isExpanded ? 'Hide' : 'View Benefits →'}</span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-5 sm:px-12 py-3.5 bg-white border-t border-[#DDE5DF] space-y-2 text-xs text-[#151A17]">
                              <span className="font-bold text-[#0B6B43] block text-[11px] uppercase tracking-wider font-mono-num">
                                Included Deliverables:
                              </span>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {sponsor.benefits.map((b: string, i: number) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <span className="text-[#0B6B43] font-bold">✓</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                  </div>
                </div>
              )}
            </div>

          </section>

          {/* ==================================================== */}
          {/* 06 — ADVERTISEMENT (Subtle #F7FAF8 Background) */}
          {/* ==================================================== */}
          <section id="section-06" className="pt-20 sm:pt-24 pb-14 bg-[#F7FAF8] -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-[12px] border border-[#DDE5DF]/60">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    06
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Advertisement
                </h2>
              </div>

              <span className="text-[11px] font-medium text-[#7A847E] uppercase tracking-wider pb-1">
                OPTIONAL
              </span>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[9px] bg-white border border-[#DDE5DF]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#151A17]">
                    Would you like to advertise in the Congress Souvenir?
                  </h3>
                  <p className="text-xs text-[#59635D]">Circulated to all registered delegates and VIP dignitaries</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateAdvertisement({ 
                      enabled: true, 
                      placement: data.advertisement.placement || 'regular_full',
                      useIncludedWithSponsor: sponsorHasAd ? true : false
                    })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      data.advertisement.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    YES
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateAdvertisement({ enabled: false })}
                    className={`px-6 py-2.5 rounded-[9px] text-xs font-bold transition-all cursor-pointer border ${
                      !data.advertisement.enabled
                        ? 'bg-[#0B6B43] text-white border-[#0B6B43]'
                        : 'bg-white text-[#151A17] border-[#DDE5DF] hover:border-[#0B6B43]'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {data.advertisement.enabled && (
                <div className="section-expand space-y-2 pt-1">
                  {sponsorHasAd && (
                    <div className="p-3 rounded-[8px] bg-white border border-[#DDE5DF] text-xs text-[#0B6B43] font-medium flex items-center justify-between">
                      <span>✓ 1 Advertisement is included with your {selectedSponsor?.name}.</span>
                      <span className="font-bold font-mono-num">₹0 (Included)</span>
                    </div>
                  )}

                  <div className="divide-y divide-[#DDE5DF] border border-[#DDE5DF] rounded-[9px] overflow-hidden bg-white">
                    {(() => {
                      const activeAds = advertisementPackages && advertisementPackages.length > 0
                        ? advertisementPackages.filter(a => a.status === 'active').map(a => ({
                            id: a.id,
                            name: a.name,
                            price: a.price,
                            formattedPrice: formatCurrency(a.price),
                            dimensions: a.size,
                            highlight: `Placement: ${a.placement.replace('_', ' ')}`
                          }))
                        : SOUVENIR_OPTIONS;
                      return activeAds.map((ad, idx) => {
                        const isSelected = data.advertisement.placement === ad.id;
                        const isIncluded = data.advertisement.useIncludedWithSponsor && sponsorHasAd;
                        const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

                        return (
                          <div
                            key={ad.id}
                            onClick={() => onUpdateAdvertisement({ placement: ad.id as SouvenirPlacement, useIncludedWithSponsor: false })}
                            className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected && !isIncluded ? 'bg-[#F7FAF8] border-l-4 border-l-[#0B6B43]' : 'hover:bg-[#F7FAF8]/60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono-num font-bold text-[#7A847E] w-6">
                                {numStr}
                              </span>

                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  isSelected && !isIncluded ? 'border-[#0B6B43] bg-[#0B6B43] text-white' : 'border-[#DDE5DF] bg-white'
                                }`}
                              >
                                {isSelected && !isIncluded && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <span className="text-sm font-bold text-[#151A17] block">{ad.name}</span>
                                <span className="text-xs text-[#59635D]">{ad.dimensions}</span>
                              </div>
                            </div>

                            <span className="font-mono-num text-sm font-bold text-[#0B6B43]">
                              {ad.formattedPrice}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>

          </section>

          {/* ==================================================== */}
          {/* 07 — REVIEW (White Background) */}
          {/* ==================================================== */}
          <section id="section-07" className="pt-20 sm:pt-24 pb-14 bg-white">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    07
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Review
                </h2>
              </div>
            </div>

            {/* Section Content */}
            <div className="pt-8 divide-y divide-[#DDE5DF] border border-[#DDE5DF] rounded-[9px] overflow-hidden bg-white text-xs">
              {/* Delegate */}
              <div className="p-4 flex items-start justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Delegate</span>
                  <span className="text-sm font-bold text-[#151A17] block">{data.delegate.name || 'Not filled yet'}</span>
                  <p className="text-[#59635D]">{data.delegate.designation} · {data.delegate.organization}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="font-mono-num font-bold text-sm text-[#0B6B43]">{formatCurrency(pricing.delegateTotal)}</span>
                  <button type="button" onClick={() => scrollToSection('section-01')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                    Edit
                  </button>
                </div>
              </div>

              {/* Spouse */}
              {data.spouse.enabled && (
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Spouse</span>
                    <div className="space-y-0.5 pt-0.5">
                      {spouseList.map((sp, i) => (
                        <p key={i} className="text-xs font-bold text-[#151A17]">
                          {i + 1}. {sp.name || `Spouse ${i + 1}`}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono-num font-bold text-sm text-[#0B6B43]">{formatCurrency(pricing.spouseTotal)}</span>
                    <button type="button" onClick={() => scrollToSection('section-02')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Stay */}
              {data.stay.enabled && (
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Stay</span>
                    <span className="text-xs font-bold text-[#151A17] block">{data.stay.nights} Nights Stay</span>
                    <p className="text-[#59635D]">{data.stay.checkInDate} to {data.stay.checkOutDate}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono-num font-bold text-sm text-[#0B6B43]">{formatCurrency(pricing.stayTotal)}</span>
                    <button type="button" onClick={() => scrollToSection('section-02')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              {data.tradingTable.enabled && (
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Table</span>
                    <span className="text-xs font-bold text-[#151A17] block">{data.tradingTable.quantity} Table(s)</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono-num font-bold text-sm text-[#0B6B43]">{formatCurrency(pricing.tradingTableTotal)}</span>
                    <button type="button" onClick={() => scrollToSection('section-03')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Stall */}
              {data.exhibition.enabled && (
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Stall</span>
                    <span className="text-xs font-bold text-[#151A17] block">{selectedStall?.name}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono-num font-bold text-sm text-[#0B6B43]">{formatCurrency(pricing.exhibitionTotal)}</span>
                    <button type="button" onClick={() => scrollToSection('section-04')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Sponsorship */}
              {data.sponsorship.enabled && (
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Sponsorship</span>
                    <span className="text-xs font-bold text-[#151A17] block">{selectedSponsor?.name}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono-num font-bold text-sm text-[#0B6B43]">{formatCurrency(pricing.sponsorshipTotal)}</span>
                    <button type="button" onClick={() => scrollToSection('section-05')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Advertisement */}
              {data.advertisement.enabled && (
                <div className="p-4 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#7A847E] uppercase tracking-wider text-[11px] block">Advertisement</span>
                    <span className="text-xs font-bold text-[#151A17] block">
                      {data.advertisement.useIncludedWithSponsor ? 'Included with Sponsor' : selectedAd?.name}
                    </span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-mono-num font-bold text-sm text-[#0B6B43]">
                      {data.advertisement.useIncludedWithSponsor ? '₹0' : formatCurrency(pricing.advertisementTotal)}
                    </span>
                    <button type="button" onClick={() => scrollToSection('section-06')} className="block text-xs font-semibold text-[#0B6B43] hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              )}

              {/* Grand Total */}
              <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-[#DDE5DF]">
                <span className="text-sm font-bold text-[#151A17] uppercase tracking-wider">
                  Grand Total
                </span>
                <span className="font-mono-num font-extrabold text-lg text-[#0B6B43]">
                  {formatCurrency(pricing.grandTotal)}
                </span>
              </div>
            </div>

          </section>

          {/* ==================================================== */}
          {/* 08 — PAYMENT (Subtle #F7FAF8 Background) */}
          {/* ==================================================== */}
          <section id="section-08" className="pt-20 sm:pt-24 pb-14 bg-[#F7FAF8] -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-[12px] border border-[#DDE5DF]/60">
            
            {/* Section Header */}
            <div className="flex items-end justify-between pb-4 border-b border-[#DDE5DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-num text-[13px] font-semibold text-[#0B6B43]">
                    08
                  </span>
                  <div className="flex items-center">
                    <span className="w-5 h-[2px] bg-[#0B6B43]" />
                    <span className="w-1.5 h-[2px] bg-[#E89A24]" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-[30px] font-bold text-[#151A17] tracking-tight">
                  Payment
                </h2>
              </div>
            </div>

            {/* Section Content */}
            <div className="pt-8 space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17]">
                  Payment Method <span className="text-[#E89A24] font-bold">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: UPI & QR */}
                  <button
                    type="button"
                    onClick={() => onUpdatePayment({ method: 'upi_qr' })}
                    className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'upi_qr'
                        ? 'border-[#0B6B43] bg-white ring-1 ring-[#0B6B43] shadow-xs'
                        : 'bg-white border-[#DDE5DF] text-[#151A17] hover:border-[#0B6B43]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'upi_qr'
                            ? 'border-[#0B6B43] bg-[#0B6B43] text-white'
                            : 'border-[#DDE5DF] bg-white'
                        }`}
                      >
                        {paymentMethod === 'upi_qr' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#151A17] block">UPI & QR Code</span>
                        <span className="text-xs text-[#59635D]">GPay, PhonePe, Paytm</span>
                      </div>
                    </div>
                    <QrCode className="w-4 h-4 text-[#0B6B43]" />
                  </button>

                  {/* Option 2: Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => onUpdatePayment({ method: 'bank_transfer' })}
                    className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#0B6B43] bg-white ring-1 ring-[#0B6B43] shadow-xs'
                        : 'bg-white border-[#DDE5DF] text-[#151A17] hover:border-[#0B6B43]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-[#0B6B43] bg-[#0B6B43] text-white'
                            : 'border-[#DDE5DF] bg-white'
                        }`}
                      >
                        {paymentMethod === 'bank_transfer' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#151A17] block">Bank Transfer</span>
                        <span className="text-xs text-[#59635D]">NEFT / RTGS / IMPS</span>
                      </div>
                    </div>
                    <Building2 className="w-4 h-4 text-[#0B6B43]" />
                  </button>

                  {/* Option 3: DD / Cheque */}
                  <button
                    type="button"
                    onClick={() => onUpdatePayment({ method: 'dd_cheque' })}
                    className={`p-4 rounded-[9px] border text-left transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'dd_cheque'
                        ? 'border-[#0B6B43] bg-white ring-1 ring-[#0B6B43] shadow-xs'
                        : 'bg-white border-[#DDE5DF] text-[#151A17] hover:border-[#0B6B43]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'dd_cheque'
                            ? 'border-[#0B6B43] bg-[#0B6B43] text-white'
                            : 'border-[#DDE5DF] bg-white'
                        }`}
                      >
                        {paymentMethod === 'dd_cheque' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#151A17] block">DD / Cheque</span>
                        <span className="text-xs text-[#59635D]">Demand Draft / Cheque</span>
                      </div>
                    </div>
                    <Receipt className="w-4 h-4 text-[#0B6B43]" />
                  </button>
                </div>
              </div>

              {/* UPI & QR Code Details */}
              {paymentMethod === 'upi_qr' && (
                <div className="section-expand space-y-4 pt-1">
                  <div className="p-5 rounded-[12px] bg-gradient-to-br from-emerald-950 via-[#06452F] to-[#043323] text-white border border-emerald-700/50 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left: Scannable QR Code */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-lg text-center">
                        <div className="w-40 h-40 flex items-center justify-center relative bg-white p-2">
                          <QrCode className="w-36 h-36 text-[#06452F]" />
                        </div>
                        <span className="text-[11px] font-black text-[#111512] mt-1 block">Scan with any UPI App</span>
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900">GPay</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-900">PhonePe</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-900">Paytm</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-900">BHIM</span>
                        </div>
                      </div>

                      {/* Right: UPI ID & Beneficiary Info */}
                      <div className="md:col-span-8 space-y-3.5">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">OFFICIAL BENEFICIARY UPI ID</span>
                          <h4 className="text-base font-bold text-white mt-0.5">{UPI_DETAILS.payeeName}</h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 p-3 bg-emerald-900/60 rounded-xl border border-emerald-600/40">
                          <span className="text-xs text-emerald-200">UPI ID:</span>
                          <span className="font-mono font-black text-sm text-amber-300">{UPI_DETAILS.upiId}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(UPI_DETAILS.upiId);
                              alert('UPI ID copied to clipboard: ' + UPI_DETAILS.upiId);
                            }}
                            className="ml-auto px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-[11px] font-bold text-white flex items-center gap-1 transition-all"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>

                        <div className="text-xs text-emerald-200/90 leading-relaxed bg-black/20 p-3 rounded-xl">
                          Pay exact Grand Total: <span className="font-bold text-amber-300 font-mono text-sm">{formatCurrency(pricing.grandTotal)}</span> (includes 18% GST).
                          After paying, enter the 12-digit UPI Reference Number / UTR below.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        UPI UTR / Transaction Reference ID <span className="text-[#E89A24] font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 702910482910 or UPI-Ref"
                        value={data.payment?.transactionRef || ''}
                        onChange={(e) => onUpdatePayment({ transactionRef: e.target.value })}
                        className="isc-input text-sm font-mono-num"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        Your UPI ID / Mobile Number <span className="text-[#7A847E] font-normal normal-case">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. yourname@oksbi"
                        value={data.payment?.upiId || ''}
                        onChange={(e) => onUpdatePayment({ upiId: e.target.value })}
                        className="isc-input text-sm font-mono-num"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank_transfer' && (
                <div className="section-expand space-y-4 pt-1">
                  <div className="p-4 rounded-[9px] bg-white border border-[#DDE5DF] space-y-2.5 text-xs">
                    <span className="font-bold text-[#0B6B43] uppercase tracking-wider block border-b border-[#DDE5DF] pb-2 text-[11px] font-mono-num">
                      Official NSAI Bank Account Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[#59635D] block">Account Name</span>
                        <span className="font-bold text-[#151A17]">{BANK_DETAILS.accountName}</span>
                      </div>
                      <div>
                        <span className="text-[#59635D] block">Account Number</span>
                        <span className="font-mono-num font-bold text-[#151A17] text-sm">{BANK_DETAILS.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#59635D] block">Bank & Branch</span>
                        <span className="font-medium text-[#151A17]">{BANK_DETAILS.bankName}, {BANK_DETAILS.branch}</span>
                      </div>
                      <div>
                        <span className="text-[#59635D] block">IFSC / SWIFT</span>
                        <span className="font-mono-num font-bold text-[#0B6B43] text-sm">{BANK_DETAILS.ifsc}</span>
                        <span className="text-[#59635D] ml-2">({BANK_DETAILS.swift})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        Transaction Reference / UTR <span className="text-[#7A847E] font-normal normal-case">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="UTR123456789"
                        value={data.payment?.transactionRef || ''}
                        onChange={(e) => onUpdatePayment({ transactionRef: e.target.value })}
                        className="isc-input text-sm font-mono-num"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        Transfer Date
                      </label>
                      <input
                        type="date"
                        value={data.payment?.date || '2027-02-20'}
                        onChange={(e) => onUpdatePayment({ date: e.target.value })}
                        className="isc-input text-sm font-mono-num"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DD / Cheque Details */}
              {paymentMethod === 'dd_cheque' && (
                <div className="section-expand space-y-4 pt-1">
                  <div className="p-4 rounded-[9px] bg-white border border-[#DDE5DF] space-y-2.5 text-xs">
                    <span className="font-bold text-[#0B6B43] uppercase tracking-wider block border-b border-[#DDE5DF] pb-2 text-[11px] font-mono-num">
                      Demand Draft / Cheque Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[#59635D] block">In Favour Of</span>
                        <span className="font-bold text-[#151A17]">{BANK_DETAILS.ddInFavourOf}</span>
                      </div>
                      <div>
                        <span className="text-[#59635D] block">Payable At</span>
                        <span className="font-bold text-[#151A17]">{BANK_DETAILS.payableAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="State Bank of India"
                        value={data.payment?.bankName || ''}
                        onChange={(e) => onUpdatePayment({ bankName: e.target.value })}
                        className="isc-input text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        DD / Cheque Number
                      </label>
                      <input
                        type="text"
                        placeholder="054231"
                        value={data.payment?.ddChequeNumber || ''}
                        onChange={(e) => onUpdatePayment({ ddChequeNumber: e.target.value })}
                        className="isc-input text-sm font-mono-num"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#151A17] mb-1">
                        Branch
                      </label>
                      <input
                        type="text"
                        placeholder="Hyderabad Main"
                        value={data.payment?.branch || ''}
                        onChange={(e) => onUpdatePayment({ branch: e.target.value })}
                        className="isc-input text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </section>

          {/* ==================================================== */}
          {/* FINAL SUBMIT ACTION */}
          {/* ==================================================== */}
          <section className="pt-16 pb-6 border-t border-[#DDE5DF] space-y-5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.termsConfirmed}
                onChange={(e) => onToggleTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#0B6B43] focus:ring-[#0B6B43] border-[#DDE5DF] cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-[#151A17] leading-relaxed font-medium">
                I confirm that all information provided is correct and I agree to submit this application for approval.
              </span>
            </label>
            {errors.termsConfirmed && (
              <p className="text-xs text-rose-500 font-semibold">{errors.termsConfirmed}</p>
            )}

            <button
              type="button"
              disabled={isSubmitting || !isEmailVerified || !isMobileVerified}
              onClick={onSubmit}
              className="w-full btn-primary disabled:opacity-50 text-base"
            >
              {isSubmitting ? (
                <span>Submitting Registration...</span>
              ) : !isEmailVerified || !isMobileVerified ? (
                <span>Verify Email & Mobile (under Section 01) to Submit</span>
              ) : (
                <span>Submit Registration</span>
              )}
            </button>
            {(!isEmailVerified || !isMobileVerified) && (
              <p className="text-center text-xs text-rose-600 font-semibold mt-1">
                * Both Email and Mobile must be verified in Section 01 to allow submission.
              </p>
            )}
          </section>

        </div>

      </div>

    </div>
  );
};
