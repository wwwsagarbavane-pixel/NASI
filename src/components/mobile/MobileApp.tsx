import React, { useState, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Layers, 
  QrCode, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown, 
  MapPin, 
  ExternalLink,
  Download,
  Bell,
  CheckCircle2,
  AlertCircle,
  LogOut,
  X,
  Plus,
  Minus,
  Trash2,
  Calendar,
  Building2,
  Receipt,
  BedDouble,
  Store,
  Table2,
  Award,
  Clock,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';
import { 
  RegistrationPackageData, 
  SingleDelegate, 
  SpouseDetails, 
  StayDetails, 
  TradingTableDetails, 
  ExhibitionDetails, 
  SponsorshipDetails, 
  AdvertisementDetails, 
  PaymentDetails, 
  DynamicRates, 
  RegCategory, 
  SpousePackage, 
  HotelRoomAdmin, 
  SponsorshipPackageAdmin, 
  AdvertisementPackageAdmin, 
  TradingTableAdmin, 
  ExhibitionStallAdmin,
  ApplicationStatus,
  ValidationErrors
} from '../../types';
import { 
  INDIAN_STATES_COUNTRIES, 
  BANK_DETAILS,
  UPI_DETAILS 
} from '../../data/eventData';
import { calculatePricing, formatCurrency } from '../../utils/pricing';

export interface MobileAppProps {
  registeredUsers: RegistrationPackageData[];
  onUpdateUsers: (users: RegistrationPackageData[]) => void;
  categories: RegCategory[];
  spousePackages: SpousePackage[];
  hotelRooms: HotelRoomAdmin[];
  tables: TradingTableAdmin[];
  stalls: ExhibitionStallAdmin[];
  sponsorshipPackages: SponsorshipPackageAdmin[];
  advertisementPackages: AdvertisementPackageAdmin[];
  dynamicRates: DynamicRates;
  onSwitchToWebsite?: () => void;
}

type TabType = 'home' | 'services' | 'ticket' | 'profile';
type AppView = 'dashboard' | 'registration_form';

export const MobileApp: React.FC<MobileAppProps> = ({
  registeredUsers,
  onUpdateUsers,
  categories,
  spousePackages,
  hotelRooms,
  tables,
  stalls,
  sponsorshipPackages,
  advertisementPackages,
  dynamicRates,
  onSwitchToWebsite
}) => {
  // Navigation & View States
  const [appView, setAppView] = useState<AppView>('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [selectedServiceModal, setSelectedServiceModal] = useState<any | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Form Step State (1 to 8)
  const [regStep, setRegStep] = useState<number>(1);
  const [showStatePicker, setShowStatePicker] = useState<boolean>(false);
  const [showSubmissionSuccessModal, setShowSubmissionSuccessModal] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Registration Submitted',
      message: 'Your ISC 2027 registration is currently under review by NSAI Secretariat.',
      timestamp: 'Just now',
      type: 'info'
    },
    {
      id: 'notif-2',
      title: 'Trading Table In Review',
      message: 'Trading Table request submitted for Hall A.',
      timestamp: '2h ago',
      type: 'info'
    }
  ]);

  // Demo User Constant Specification
  const DEMO_USER_ID = 'ISC27-25504';
  const DEMO_MOBILE = '9876543210';

  // Master Initial Demo Template Data
  const defaultDemoRegistration: RegistrationPackageData = {
    applicationId: 'APP-25504',
    ticketId: 'TKT-25504',
    registrationId: DEMO_USER_ID,
    status: 'approved',
    submissionDate: '26 Feb 2027',
    delegate: {
      name: 'Rajesh Sharma',
      designation: 'Managing Director',
      mobile: '9876543210',
      email: 'rajesh@example.com',
      organization: 'ABC Seeds Pvt Ltd',
      address: 'Plot 42, Seed Tech Park, Hitech City',
      city: 'Hyderabad',
      pinCode: '500081',
      stateCountry: 'Telangana',
      nsaiMembershipNo: 'NSAI/2026/894',
      membershipType: 'member',
    },
    spouse: {
      enabled: true,
      list: [
        { id: 'sp-1', name: 'Priya Sharma', mobile: '9876543211', email: 'priya@example.com' },
        { id: 'sp-2', name: 'Anita Sharma', mobile: '9876543212', email: 'anita@example.com' }
      ],
      name: 'Priya Sharma',
      mobile: '9876543211',
      email: 'priya@example.com',
    },
    stay: {
      enabled: true,
      checkInDate: '2027-02-26',
      checkOutDate: '2027-02-28',
      nights: 2,
    },
    tradingTable: {
      enabled: true,
      quantity: 1,
    },
    exhibition: {
      enabled: true,
      stallType: 'premium',
    },
    sponsorship: {
      enabled: true,
      tier: 'platinum',
      useIncludedTradingTable: true,
      useIncludedAd: true,
    },
    advertisement: {
      enabled: true,
      placement: 'regular_full',
      useIncludedWithSponsor: true,
    },
    payment: {
      method: 'bank_transfer',
      bankName: 'HDFC Bank Ltd',
      ddChequeNumber: '',
      branch: 'New Delhi',
      transactionRef: 'NEFT-89201948',
      date: '2027-02-26',
      amount: 1168200,
    },
    termsConfirmed: true
  };

  // Active user session state
  const [activeUser, setActiveUser] = useState<RegistrationPackageData>(defaultDemoRegistration);

  // Login Input state
  const [loginMobile, setLoginMobile] = useState('9876543210');

  // Form Editing State
  const [formData, setFormData] = useState<RegistrationPackageData>(defaultDemoRegistration);

  // Dynamic pricing calculation
  const formPricing = calculatePricing(
    formData, 
    dynamicRates, 
    categories, 
    spousePackages, 
    hotelRooms, 
    sponsorshipPackages, 
    advertisementPackages,
    tables
  );

  // Section Steps Metadata
  const REG_SECTIONS = [
    { step: 1, id: 'delegate', title: 'Delegate Registration' },
    { step: 2, id: 'spouse_stay', title: 'Spouse & Stay' },
    { step: 3, id: 'table', title: 'Trading Table' },
    { step: 4, id: 'stall', title: 'Exhibition Stall' },
    { step: 5, id: 'sponsorship', title: 'Sponsorship' },
    { step: 6, id: 'advertisement', title: 'Advertisement' },
    { step: 7, id: 'review', title: 'Review Registration' },
    { step: 8, id: 'payment', title: 'Payment & Declaration' }
  ];

  // Navigation handlers for step 1-8
  const handleNextStep = () => {
    if (regStep < 8) {
      setRegStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevStep = () => {
    if (regStep > 1) {
      setRegStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAppView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartNewRegistration = () => {
    const freshData: RegistrationPackageData = {
      ...defaultDemoRegistration,
      status: 'under_review',
      registrationId: `ISC27-${Math.floor(10000 + Math.random() * 90000)}`
    };
    setFormData(freshData);
    setRegStep(1);
    setAppView('registration_form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditRegistration = () => {
    setFormData(activeUser);
    setRegStep(1);
    setAppView('registration_form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoLogin = () => {
    setActiveUser(defaultDemoRegistration);
    setFormData(defaultDemoRegistration);
    setLoginError(null);
    setShowWelcome(false);
    setAppView('dashboard');
    setActiveTab('home');
  };

  // Submission sets status to PENDING APPROVAL (under_review)
  const handleFinalSubmit = () => {
    const assignedRegId = formData.registrationId || `ISC27-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalSubmission: RegistrationPackageData = {
      ...formData,
      registrationId: assignedRegId,
      status: 'under_review', // PENDING APPROVAL
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      payment: {
        method: formData.payment?.method || 'bank_transfer',
        bankName: formData.payment?.bankName || 'HDFC Bank Ltd',
        ddChequeNumber: formData.payment?.ddChequeNumber || '',
        branch: formData.payment?.branch || 'New Delhi',
        transactionRef: formData.payment?.transactionRef || 'NEFT-89201948',
        date: formData.payment?.date || new Date().toISOString().split('T')[0],
        amount: formPricing.grandTotal
      },
      termsConfirmed: true
    };

    setActiveUser(finalSubmission);
    localStorage.setItem('isc_demo_active_user', JSON.stringify(finalSubmission));

    const idx = registeredUsers.findIndex(u => u.registrationId === assignedRegId);
    if (idx >= 0) {
      const updated = [...registeredUsers];
      updated[idx] = finalSubmission;
      onUpdateUsers(updated);
    } else {
      onUpdateUsers([finalSubmission, ...registeredUsers]);
    }

    // Open Submission Success Modal directly showing Pending Status!
    setShowSubmissionSuccessModal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Simulate Secretariat Approval Toggle
  const handleSimulateApproval = () => {
    const approved: RegistrationPackageData = {
      ...activeUser,
      status: 'approved'
    };
    setActiveUser(approved);
    localStorage.setItem('isc_demo_active_user', JSON.stringify(approved));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Registration Approved ✓',
        message: 'Your registration has been approved by NSAI Secretariat. Event pass is ready.',
        timestamp: 'Just now',
        type: 'success'
      },
      ...prev
    ]);

    setSaveToast('Registration APPROVED ✓ Allocations Confirmed!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Revert to pending for testing
  const handleSimulatePending = () => {
    const pending: RegistrationPackageData = {
      ...activeUser,
      status: 'under_review'
    };
    setActiveUser(pending);
    localStorage.setItem('isc_demo_active_user', JSON.stringify(pending));
    setSaveToast('Status reverted to ● AWAITING APPROVAL');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isApproved = activeUser.status === 'approved';
  const isPending = activeUser.status === 'under_review';

  // Dynamic services list based on approval state
  const allFilledServices = [
    {
      id: 'table',
      title: 'Trading Table',
      badge: isApproved ? 'T-12 · Allocated' : '1 Table · Pending Allocation',
      detail: isApproved ? 'Table T-12 • Hall A (North Wing)' : 'Hall A (North Wing) B2B Space',
      sub: 'Dedicated B2B Meeting Space with 4 Executive Chairs & 5A Power Sockets. Listed in Official Congress B2B Directory.',
      icon: Table2
    },
    {
      id: 'stall',
      title: 'Exhibition Stall',
      badge: isApproved ? 'A-14 · Allocated' : 'Premium Stall · Pending Allocation',
      detail: isApproved ? 'Premium Stall (3m × 3m) • Main Pavilion' : 'Premium (3x3m) • Main Pavilion',
      sub: 'Octanorm Shell Scheme, Fascia Board with Company Name, 3 Spotlights, 1 Lockable Counter & Wastebin Included.',
      icon: Store
    },
    {
      id: 'stay',
      title: 'Hotel Accommodation',
      badge: isApproved ? 'Sitara Luxury Hotel · Confirmed' : 'Sitara Luxury Hotel · In Review',
      detail: 'Sitara 5-Star Luxury • Deluxe Double Room',
      sub: 'Check-in: 26 Feb 2027 • Check-out: 28 Feb 2027 (2 Nights). Complimentary Buffet Breakfast & Shuttle to Venue.',
      icon: BedDouble
    },
    {
      id: 'spouse',
      title: 'Spouse Pass',
      badge: isApproved ? '2 Persons · Confirmed' : '2 Persons · Pending Verification',
      detail: 'Priya Sharma & Anita Sharma',
      sub: 'Access to All Social Functions, Cultural Evening, Dinners, Networking Lounges & Grand Gala Evening.',
      icon: User
    },
    {
      id: 'sponsorship',
      title: 'Sponsorship Package',
      badge: isApproved ? 'Platinum Sponsor · Approved' : 'Platinum Sponsor · In Review',
      detail: 'Principal Convention Partner',
      sub: 'Prime Logo Placement across Convention Halls, Delegate Bags, Lanyards, Digital Screens & Souvenir Edition.',
      icon: Award
    },
    {
      id: 'advertisement',
      title: 'Souvenir Advertisement',
      badge: isApproved ? 'Full Page Color · Confirmed' : 'Full Page Color · In Review',
      detail: 'Full Page Premium Placement',
      sub: 'Featured in the Official Indian Seed Congress 2027 Commemorative Souvenir Book distributed to all delegates.',
      icon: FileText
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7F8F4] flex flex-col font-sans select-none antialiased relative">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 p-3.5 rounded-2xl bg-[#06452F] text-white text-xs font-bold shadow-2xl border border-emerald-400 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Floating Switcher to Desktop Website */}
      {onSwitchToWebsite && (
        <button
          onClick={onSwitchToWebsite}
          className="fixed top-3 right-3 z-50 px-3.5 py-1.5 bg-white/95 backdrop-blur-md border border-[#087443]/30 text-[#087443] hover:bg-emerald-50 active:scale-95 rounded-full text-[11px] font-bold shadow-md transition-all flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Desktop Website</span>
        </button>
      )}

      {/* Main App Container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-[#F7F8F4] text-[#111512] shadow-sm">
          
          {/* ========================================================================= */}
          {/* 1. DEMO LOGIN SCREEN */}
          {/* ========================================================================= */}
          {showWelcome ? (
            <div className="h-full flex flex-col justify-between bg-white text-[#111512] select-none relative overflow-y-auto min-h-screen">
              <div className="relative h-[360px] w-full shrink-0 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-right"
                  style={{ backgroundImage: `url('/images/isc_seedling_hero.jpg')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </div>

                <div className="relative z-10 px-7 pt-7 space-y-3.5">
                  <img src="/images/nsai_logo.png" alt="NSAI" className="h-11 w-auto object-contain drop-shadow-2xs" />
                  
                  <div className="pt-1">
                    <h1 className="text-[26px] font-black uppercase tracking-tight text-[#111512] leading-[1.08]">
                      INDIAN SEED<br />CONGRESS
                    </h1>
                    <span className="text-[32px] font-black tracking-tight text-[#087443] leading-none block mt-1">
                      2027
                    </span>
                    <div className="w-11 h-[3px] bg-[#E5A62A] rounded-full mt-2.5 shadow-2xs" />
                  </div>

                  <div className="flex items-start gap-1.5 text-[12px] text-[#68736D] font-medium leading-snug pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#087443] shrink-0 mt-0.5 stroke-[2.5]" />
                    <div>
                      <span className="block font-semibold text-[#111512]">Ramoji Film City,</span>
                      <span className="block text-[#68736D]">Hyderabad</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-1 inset-x-0 z-20 pointer-events-none">
                  <svg viewBox="0 0 390 85" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                    <path d="M0 65C120 78 280 85 390 25L390 85L0 85Z" fill="#E5A62A" />
                    <path d="M0 38C130 52 260 62 390 8L390 85L0 85Z" fill="#087443" />
                    <path d="M0 46C140 60 270 70 390 20L390 85L0 85Z" fill="#FFFFFF" />
                  </svg>
                </div>
              </div>

              <div className="px-7 pt-1 pb-7 relative z-30 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[#087443] flex items-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 20h10" />
                          <path d="M10 20c5.5-2.5.8-6.4 3-13" />
                          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" fill="#087443" />
                          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.7-2.3 2-4.6-2.6 0-4.2.8-5.2 2z" fill="#087443" />
                        </svg>
                      </div>
                      <h2 className="text-[22px] font-black text-[#111512] tracking-tight">
                        Delegate Login
                      </h2>
                    </div>
                    <p className="text-[13px] text-[#68736D] font-normal leading-normal">
                      Sign in with demo mobile: <span className="font-bold text-[#087443]">9876543210</span>
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#E5A62A] shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-0.5">
                    <label className="block text-[13px] font-bold text-[#111512]">Mobile Number</label>
                    <div className="h-[54px] px-4 rounded-2xl border-2 border-[#087443] bg-white flex items-center shadow-xs focus-within:ring-2 focus-within:ring-[#087443]/20 transition-all">
                      <div className="flex items-center gap-1.5 pr-3 border-r border-[#E5E7EB] text-[14px] font-bold text-[#111512] shrink-0">
                        <span>+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#68736D] stroke-[2.5]" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter mobile number"
                        value={loginMobile}
                        onChange={(e) => {
                          setLoginMobile(e.target.value);
                          setLoginError(null);
                        }}
                        className="flex-1 h-full pl-3 text-[14px] text-[#111512] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none font-medium font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleDemoLogin}
                    className="w-full h-[54px] rounded-2xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white font-bold text-[15px] shadow-sm transition-all flex items-center justify-center gap-2.5"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <div className="relative flex py-0.5 items-center">
                    <div className="flex-grow border-t border-[#E5E7EB]" />
                    <span className="flex-shrink mx-3 text-[11px] font-bold text-[#68736D] tracking-wider uppercase">
                      OR
                    </span>
                    <div className="flex-grow border-t border-[#E5E7EB]" />
                  </div>

                  {/* 1. REGISTER FOR EVENT */}
                  <button
                    onClick={() => {
                      setShowWelcome(false);
                      handleStartNewRegistration();
                    }}
                    className="w-full h-[54px] rounded-2xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white font-black text-[15px] shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Register for Event</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* 2. DEMO LOGIN */}
                  <button
                    onClick={() => {
                      setLoginMobile('9876543210');
                      setActiveUser(defaultDemoRegistration);
                      setFormData(defaultDemoRegistration);
                      setShowWelcome(false);
                      setAppView('dashboard');
                      setActiveTab('home');
                    }}
                    className="w-full h-[48px] rounded-2xl border border-[#E5E7EB] bg-white hover:bg-slate-50 active:scale-[0.99] text-[#111512] font-bold text-[13px] transition-all flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full border-[1.8px] border-[#087443] flex items-center justify-center text-[#087443]">
                      <User className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>Login as Rajesh Sharma (Demo)</span>
                  </button>
                </div>

                <div className="w-32 h-[4px] bg-black/80 rounded-full mx-auto mt-4 mb-0.5" />
              </div>
            </div>

          ) : appView === 'registration_form' ? (

            /* ========================================================================= */
            /* 2. REGISTRATION FORM (CLEAN TOP-ALIGNED MOBILE FORM) */
            /* ========================================================================= */
            <div className="w-full pb-36 pt-3 px-5 space-y-4 bg-[#F7F8F4]">
              
              {/* TOP HEADER: ← Back button, 01 / 08, Title, Thin progress line */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] text-[#111512] flex items-center justify-center active:scale-95 shadow-2xs hover:bg-slate-50 transition-all shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#111512]" />
                  </button>
                  <div className="flex-1">
                    <span className="text-[11px] font-mono font-bold text-[#087443] tracking-wide block">
                      0{regStep} / 08
                    </span>
                    <h1 className="text-[18px] font-black text-[#111512] leading-tight">
                      {REG_SECTIONS[regStep - 1].title}
                    </h1>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[13px] font-black text-[#087443] font-mono">
                      {formatCurrency(formPricing.grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Single Thin Progress Line */}
                <div className="w-full bg-slate-200/80 h-[3px] rounded-full overflow-hidden">
                  <div 
                    className="bg-[#087443] h-full rounded-full transition-all duration-300"
                    style={{ width: `${(regStep / 8) * 100}%` }}
                  />
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SECTION 01: DELEGATE REGISTRATION */}
              {/* ------------------------------------------------------------- */}
              {regStep === 1 && (
                <div className="space-y-4 pt-1">
                  
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <span className="block text-[11px] font-black uppercase tracking-wider text-[#68736D]">
                      REGISTRATION CATEGORY
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, delegate: { ...p.delegate, membershipType: 'member' } }))}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          formData.delegate.membershipType === 'member'
                            ? 'bg-emerald-50/70 border-[#087443] ring-1 ring-[#087443] shadow-xs'
                            : 'bg-white border-[#E5E7EB] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-xs text-[#111512]">NSAI Member</span>
                          {formData.delegate.membershipType === 'member' && (
                            <span className="w-4 h-4 rounded-full bg-[#087443] text-white flex items-center justify-center text-[10px]">✓</span>
                          )}
                        </div>
                        <span className="text-xs font-black text-[#087443] block mt-1">₹25,000 + GST</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, delegate: { ...p.delegate, membershipType: 'non_member' } }))}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          formData.delegate.membershipType === 'non_member'
                            ? 'bg-emerald-50/70 border-[#087443] ring-1 ring-[#087443] shadow-xs'
                            : 'bg-white border-[#E5E7EB] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-black text-xs text-[#111512]">Non-Member</span>
                          {formData.delegate.membershipType === 'non_member' && (
                            <span className="w-4 h-4 rounded-full bg-[#087443] text-white flex items-center justify-center text-[10px]">✓</span>
                          )}
                        </div>
                        <span className="text-xs font-black text-[#087443] block mt-1">₹30,000 + GST</span>
                      </button>
                    </div>
                  </div>

                  {/* Delegate Details */}
                  <div className="space-y-3 pt-1">
                    <span className="block text-[11px] font-black uppercase tracking-wider text-[#68736D]">
                      DELEGATE DETAILS
                    </span>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">Delegate Name *</label>
                      <input 
                        type="text"
                        placeholder="Enter delegate full name"
                        value={formData.delegate.name}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, name: e.target.value } }))}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:ring-1 focus:ring-[#087443] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">Designation *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Managing Director"
                        value={formData.delegate.designation}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, designation: e.target.value } }))}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:ring-1 focus:ring-[#087443] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">Mobile Number *</label>
                      <div className="h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white flex items-center shadow-2xs focus-within:border-[#087443] focus-within:ring-1 focus-within:ring-[#087443]">
                        <span className="text-sm font-bold text-[#111512] pr-2.5 border-r border-[#E5E7EB] shrink-0">+91</span>
                        <input 
                          type="tel"
                          placeholder="98765 43210"
                          value={formData.delegate.mobile}
                          onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, mobile: e.target.value } }))}
                          className="flex-1 h-full pl-3 text-sm text-[#111512] bg-transparent focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">Email Address *</label>
                      <input 
                        type="email"
                        placeholder="rajesh@company.com"
                        value={formData.delegate.email}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, email: e.target.value } }))}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:ring-1 focus:ring-[#087443] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">Organization / Company *</label>
                      <input 
                        type="text"
                        placeholder="e.g. ABC Seeds Pvt Ltd"
                        value={formData.delegate.organization}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, organization: e.target.value } }))}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:ring-1 focus:ring-[#087443] focus:outline-none"
                      />
                    </div>

                    {formData.delegate.membershipType === 'member' && (
                      <div>
                        <label className="block text-[12px] font-bold text-[#111512] mb-1">NSAI Membership Number</label>
                        <input 
                          type="text"
                          placeholder="e.g. NSAI/2026/894"
                          value={formData.delegate.nsaiMembershipNo}
                          onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, nsaiMembershipNo: e.target.value } }))}
                          className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:outline-none font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">Registered Address *</label>
                      <textarea 
                        rows={2}
                        placeholder="Plot / Street / Building Address"
                        value={formData.delegate.address}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, address: e.target.value } }))}
                        className="w-full p-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">City *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Hyderabad"
                        value={formData.delegate.city}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, city: e.target.value } }))}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">State / Country *</label>
                      <button
                        type="button"
                        onClick={() => setShowStatePicker(true)}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-left flex items-center justify-between text-[#111512] hover:border-[#087443] transition-all"
                      >
                        <span className="truncate">{formData.delegate.stateCountry || 'Select State / Country'}</span>
                        <ChevronDown className="w-4 h-4 text-[#68736D] shrink-0" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-[#111512] mb-1">PIN / Postal Code</label>
                      <input 
                        type="text"
                        placeholder="e.g. 500081"
                        value={formData.delegate.pinCode}
                        onChange={(e) => setFormData(p => ({ ...p, delegate: { ...p.delegate, pinCode: e.target.value } }))}
                        className="w-full h-[52px] px-3.5 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111512] focus:border-[#087443] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 02: SPOUSE & STAY */}
              {/* ------------------------------------------------------------- */}
              {regStep === 2 && (
                <div className="space-y-4 pt-1">
                  {/* Spouse Block */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-[#111512] block">Add Spouse / Accompanying Person?</span>
                        <span className="text-xs text-[#68736D]">₹20,000 per person + GST</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => {
                            const list = formData.spouse.list && formData.spouse.list.length > 0 ? formData.spouse.list : [
                              { id: 'sp-1', name: 'Priya Sharma', mobile: '9876543211', email: 'priya@example.com' }
                            ];
                            setFormData(p => ({ ...p, spouse: { ...p.spouse, enabled: true, list } }));
                          }}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${formData.spouse.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          YES
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, spouse: { ...p.spouse, enabled: false } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${!formData.spouse.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>

                    {formData.spouse.enabled && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        {formData.spouse.list?.map((sp, idx) => (
                          <div key={sp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#087443] text-xs">Spouse 0{idx + 1}</span>
                              {formData.spouse.list && formData.spouse.list.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = formData.spouse.list?.filter((_, i) => i !== idx) || [];
                                    setFormData(p => ({ ...p, spouse: { ...p.spouse, list } }));
                                  }}
                                  className="text-rose-600 text-xs font-bold flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              placeholder="Full Name *"
                              value={sp.name}
                              onChange={(e) => {
                                const list = [...(formData.spouse.list || [])];
                                list[idx].name = e.target.value;
                                setFormData(p => ({ ...p, spouse: { ...p.spouse, list } }));
                              }}
                              className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512] focus:border-[#087443] focus:outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="tel"
                                placeholder="Mobile Number"
                                value={sp.mobile}
                                onChange={(e) => {
                                  const list = [...(formData.spouse.list || [])];
                                  list[idx].mobile = e.target.value;
                                  setFormData(p => ({ ...p, spouse: { ...p.spouse, list } }));
                                }}
                                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512] focus:border-[#087443] focus:outline-none"
                              />
                              <input
                                type="email"
                                placeholder="Email Address"
                                value={sp.email}
                                onChange={(e) => {
                                  const list = [...(formData.spouse.list || [])];
                                  list[idx].email = e.target.value;
                                  setFormData(p => ({ ...p, spouse: { ...p.spouse, list } }));
                                }}
                                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512] focus:border-[#087443] focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const current = formData.spouse.list || [];
                            const newItem = { id: `sp-${Date.now()}`, name: '', mobile: '', email: '' };
                            setFormData(p => ({ ...p, spouse: { ...p.spouse, list: [...current, newItem] } }));
                          }}
                          className="w-full py-2.5 rounded-xl border border-dashed border-[#087443] text-[#087443] hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Plus className="w-4 h-4" /> Add Another Spouse / Guest
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stay Block */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-[#111512] block">Book Hotel Accommodation?</span>
                        <span className="text-xs text-[#68736D]">Sitara / Tara Luxury Hotel</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, stay: { ...p.stay, enabled: true } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${formData.stay.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          YES
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, stay: { ...p.stay, enabled: false } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${!formData.stay.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>

                    {formData.stay.enabled && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <label className="block font-bold text-[#111512] mb-1">Hotel & Room Category</label>
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                            <span className="font-black text-[#087443] block">Sitara Luxury 5-Star Hotel</span>
                            <span className="text-[11px] text-[#68736D]">Deluxe Double Room (₹15,000 / night + GST)</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-[#111512] mb-1">Check-in Date</label>
                            <input
                              type="date"
                              value={formData.stay.checkInDate || '2027-02-26'}
                              onChange={(e) => setFormData(p => ({ ...p, stay: { ...p.stay, checkInDate: e.target.value } }))}
                              className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-[#111512] mb-1">Check-out Date</label>
                            <input
                              type="date"
                              value={formData.stay.checkOutDate || '2027-02-28'}
                              onChange={(e) => setFormData(p => ({ ...p, stay: { ...p.stay, checkOutDate: e.target.value } }))}
                              className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512]"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-[#111512]">Total Nights</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, stay: { ...p.stay, nights: Math.max(1, (p.stay.nights || 2) - 1) } }))}
                              className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center font-bold"
                            >
                              -
                            </button>
                            <span className="font-black text-sm text-[#087443]">{formData.stay.nights || 2} Nights</span>
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, stay: { ...p.stay, nights: (p.stay.nights || 2) + 1 } }))}
                              className="w-7 h-7 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 03: TABLE */}
              {/* ------------------------------------------------------------- */}
              {regStep === 3 && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-[#111512] block">Book Trading Table?</span>
                        <span className="text-xs text-[#68736D]">Dedicated B2B Meeting Space (Hall A)</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, tradingTable: { ...p.tradingTable, enabled: true } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${formData.tradingTable.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          YES
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, tradingTable: { ...p.tradingTable, enabled: false } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${!formData.tradingTable.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>

                    {formData.tradingTable.enabled && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div>
                            <span className="font-bold text-[#111512] block">Number of Tables</span>
                            <span className="text-[11px] text-[#68736D]">₹30,000 per table + GST</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, tradingTable: { ...p.tradingTable, quantity: Math.max(1, (p.tradingTable.quantity || 1) - 1) } }))}
                              className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center font-bold active:scale-90"
                            >
                              -
                            </button>
                            <span className="font-black text-sm text-[#087443]">{formData.tradingTable.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, tradingTable: { ...p.tradingTable, quantity: Math.min(5, (p.tradingTable.quantity || 1) + 1) } }))}
                              className="w-8 h-8 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center font-bold active:scale-90"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                          <span className="font-black text-[#087443] block text-xs">Table Inclusions:</span>
                          <p className="text-[11px] leading-relaxed">
                            • 1 High Quality Meeting Table + 4 Executive Chairs<br />
                            • 5A Power Connection for laptops/chargers<br />
                            • Company Name board & listing in official B2B directory
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 04: STALL */}
              {/* ------------------------------------------------------------- */}
              {regStep === 4 && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-[#111512] block">Book Exhibition Stall?</span>
                        <span className="text-xs text-[#68736D]">Main Exhibition Pavilion</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, exhibition: { ...p.exhibition, enabled: true, stallType: 'premium' } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${formData.exhibition.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          YES
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, exhibition: { ...p.exhibition, enabled: false } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${!formData.exhibition.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>

                    {formData.exhibition.enabled && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-[#111512] block">Select Stall Type</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, exhibition: { ...p.exhibition, stallType: 'premium' } }))}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              formData.exhibition.stallType === 'premium'
                                ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443]'
                                : 'bg-white border-[#E5E7EB]'
                            }`}
                          >
                            <span className="font-black text-xs text-[#111512] block">Premium (3x3m)</span>
                            <span className="text-xs font-black text-[#087443]">₹1,50,000 + GST</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, exhibition: { ...p.exhibition, stallType: 'normal' } }))}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              formData.exhibition.stallType === 'normal'
                                ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443]'
                                : 'bg-white border-[#E5E7EB]'
                            }`}
                          >
                            <span className="font-black text-xs text-[#111512] block">Normal (3x3m)</span>
                            <span className="text-xs font-black text-[#087443]">₹1,20,000 + GST</span>
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#68736D] space-y-1">
                          <span className="font-black text-[#111512] block text-xs">Stall Inclusions:</span>
                          <p className="text-[11px] leading-relaxed">
                            Octanorm structure, Fascia with company name, 3 spotlights, 1 lockable reception counter, 2 chairs & power plug.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 05: SPONSORSHIP */}
              {/* ------------------------------------------------------------- */}
              {regStep === 5 && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-[#111512] block">Sponsor ISC 2027?</span>
                        <span className="text-xs text-[#68736D]">Principal Convention Partners</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, sponsorship: { ...p.sponsorship, enabled: true, tier: 'platinum' } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${formData.sponsorship.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          YES
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, sponsorship: { ...p.sponsorship, enabled: false } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${!formData.sponsorship.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>

                    {formData.sponsorship.enabled && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-[#111512] block">Select Sponsorship Tier</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'platinum', title: 'Platinum Sponsor', price: '₹7,00,000' },
                            { id: 'gold', title: 'Gold Sponsor', price: '₹5,00,000' },
                            { id: 'silver', title: 'Silver Sponsor', price: '₹3,00,000' },
                            { id: 'gala_dinner', title: 'Gala Dinner', price: '₹5,00,000' }
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, sponsorship: { ...p.sponsorship, tier: t.id as any } }))}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                formData.sponsorship.tier === t.id
                                  ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443]'
                                  : 'bg-white border-[#E5E7EB]'
                              }`}
                            >
                              <span className="font-black text-xs text-[#111512] block">{t.title}</span>
                              <span className="text-xs font-black text-[#087443]">{t.price} + GST</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 06: ADVERTISEMENT */}
              {/* ------------------------------------------------------------- */}
              {regStep === 6 && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-3 p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-sm text-[#111512] block">Book Souvenir Ad?</span>
                        <span className="text-xs text-[#68736D]">Official Congress Souvenir Magazine</span>
                      </div>
                      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, advertisement: { ...p.advertisement, enabled: true, placement: 'regular_full' } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${formData.advertisement.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          YES
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, advertisement: { ...p.advertisement, enabled: false } }))}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${!formData.advertisement.enabled ? 'bg-[#087443] text-white shadow-xs' : 'text-[#68736D]'}`}
                        >
                          NO
                        </button>
                      </div>
                    </div>

                    {formData.advertisement.enabled && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-[#111512] block">Select Ad Placement</span>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'regular_full', title: 'Regular Full Page', price: '₹30,000' },
                            { id: 'regular_half', title: 'Regular Half Page', price: '₹20,000' },
                            { id: 'back_page', title: 'Back Cover Page', price: '₹2,00,000' },
                            { id: 'front_inside', title: 'Front Inside Cover', price: '₹1,00,000' }
                          ].map(ad => (
                            <button
                              key={ad.id}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, advertisement: { ...p.advertisement, placement: ad.id as any } }))}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                formData.advertisement.placement === ad.id
                                  ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443]'
                                  : 'bg-white border-[#E5E7EB]'
                              }`}
                            >
                              <span className="font-black text-xs text-[#111512] block">{ad.title}</span>
                              <span className="text-xs font-black text-[#087443]">{ad.price} + GST</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 07: REVIEW */}
              {/* ------------------------------------------------------------- */}
              {regStep === 7 && (
                <div className="space-y-3 pt-1">
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                    <span className="font-black text-sm text-[#111512] block">Review Registration Summary</span>
                    <div className="text-xs space-y-2 divide-y divide-slate-100">
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Delegate:</span><span className="font-bold">{formData.delegate.name}</span></div>
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Company:</span><span className="font-bold">{formData.delegate.organization}</span></div>
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Mobile:</span><span className="font-bold font-mono">{formData.delegate.mobile}</span></div>
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Trading Table:</span><span className="font-bold text-[#087443]">1 Table (Hall A)</span></div>
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Exhibition Stall:</span><span className="font-bold text-[#087443]">Premium Stall (3x3m)</span></div>
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Hotel Accommodation:</span><span className="font-bold text-[#087443]">Sitara Luxury (2 Nights)</span></div>
                      <div className="pt-2 flex justify-between"><span className="text-[#68736D]">Sponsorship:</span><span className="font-bold text-[#087443]">Platinum Sponsor</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SECTION 08: PAYMENT & DECLARATION */}
              {/* ------------------------------------------------------------- */}
              {regStep === 8 && (
                <div className="space-y-4 pt-1">
                  {/* Grand Total Summary Card */}
                  <div className="p-5 rounded-2xl bg-[#06452F] text-white space-y-3.5 shadow-md">
                    <div className="flex justify-between items-center border-b border-emerald-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">FINAL AMOUNT</span>
                        <span className="text-sm font-bold text-white">Grand Total (incl. 18% GST)</span>
                      </div>
                      <span className="text-2xl font-black text-[#E5A62A] font-mono">
                        {formatCurrency(formPricing.grandTotal)}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-emerald-100">
                      <div className="flex justify-between"><span>Delegate Fee</span><span>{formatCurrency(formPricing.delegateTotal)}</span></div>
                      {formPricing.spouseTotal > 0 && <div className="flex justify-between"><span>Spouse Pass (×{formPricing.spouseCount})</span><span>{formatCurrency(formPricing.spouseTotal)}</span></div>}
                      {formPricing.stayTotal > 0 && <div className="flex justify-between"><span>Hotel Accommodation</span><span>{formatCurrency(formPricing.stayTotal)}</span></div>}
                      {formPricing.tradingTableTotal > 0 && <div className="flex justify-between"><span>Trading Table</span><span>{formatCurrency(formPricing.tradingTableTotal)}</span></div>}
                      {formPricing.exhibitionTotal > 0 && <div className="flex justify-between"><span>Exhibition Stall</span><span>{formatCurrency(formPricing.exhibitionTotal)}</span></div>}
                      {formPricing.sponsorshipTotal > 0 && <div className="flex justify-between"><span>Sponsorship</span><span>{formatCurrency(formPricing.sponsorshipTotal)}</span></div>}
                      {formPricing.advertisementTotal > 0 && <div className="flex justify-between"><span>Souvenir Ad</span><span>{formatCurrency(formPricing.advertisementTotal)}</span></div>}
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <span className="block text-[11px] font-black uppercase tracking-wider text-[#68736D]">
                      SELECT PAYMENT METHOD
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({
                          ...p,
                          payment: {
                            method: 'upi_qr',
                            bankName: p.payment?.bankName || '',
                            ddChequeNumber: p.payment?.ddChequeNumber || '',
                            branch: p.payment?.branch || '',
                            date: p.payment?.date || '',
                            amount: formPricing.grandTotal,
                            transactionRef: p.payment?.transactionRef || '',
                            upiId: p.payment?.upiId || '',
                            ...p.payment
                          }
                        }))}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          (formData.payment?.method || 'upi_qr') === 'upi_qr'
                            ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443] shadow-xs'
                            : 'bg-white border-[#E5E7EB]'
                        }`}
                      >
                        <QrCode className="w-5 h-5 mx-auto text-[#087443] mb-1" />
                        <span className="font-bold text-[11px] text-[#111512] block">UPI & QR</span>
                        <span className="text-[9px] text-[#68736D]">GPay / PhonePe</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(p => ({
                          ...p,
                          payment: {
                            method: 'bank_transfer',
                            bankName: p.payment?.bankName || 'State Bank of India',
                            ddChequeNumber: p.payment?.ddChequeNumber || '',
                            branch: p.payment?.branch || 'New Delhi',
                            date: p.payment?.date || '',
                            amount: formPricing.grandTotal,
                            transactionRef: p.payment?.transactionRef || '',
                            ...p.payment
                          }
                        }))}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          formData.payment?.method === 'bank_transfer'
                            ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443] shadow-xs'
                            : 'bg-white border-[#E5E7EB]'
                        }`}
                      >
                        <Building2 className="w-5 h-5 mx-auto text-[#087443] mb-1" />
                        <span className="font-bold text-[11px] text-[#111512] block">NEFT / RTGS</span>
                        <span className="text-[9px] text-[#68736D]">Bank Transfer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(p => ({
                          ...p,
                          payment: {
                            method: 'dd_cheque',
                            bankName: p.payment?.bankName || '',
                            ddChequeNumber: p.payment?.ddChequeNumber || '',
                            branch: p.payment?.branch || '',
                            date: p.payment?.date || '',
                            amount: formPricing.grandTotal,
                            transactionRef: p.payment?.transactionRef || '',
                            ...p.payment
                          }
                        }))}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          formData.payment?.method === 'dd_cheque'
                            ? 'bg-emerald-50 border-[#087443] ring-1 ring-[#087443] shadow-xs'
                            : 'bg-white border-[#E5E7EB]'
                        }`}
                      >
                        <Receipt className="w-5 h-5 mx-auto text-[#087443] mb-1" />
                        <span className="font-bold text-[11px] text-[#111512] block">DD / Cheque</span>
                        <span className="text-[9px] text-[#68736D]">Demand Draft</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: UPI & QR Code Box */}
                  {(formData.payment?.method || 'upi_qr') === 'upi_qr' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs text-center space-y-3">
                        <span className="text-[10px] font-bold text-[#087443] uppercase tracking-wider block">
                          SCAN TO PAY WITH ANY UPI APP
                        </span>

                        <div className="w-44 h-44 mx-auto p-2 border-2 border-[#087443]/30 rounded-2xl bg-white flex items-center justify-center shadow-xs">
                          <QrCode className="w-40 h-40 text-[#06452F]" />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">GPay</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">PhonePe</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200">Paytm</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-900 border border-orange-200">BHIM</span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[#68736D] text-[11px]">Beneficiary UPI ID:</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(UPI_DETAILS.upiId);
                                setSaveToast('UPI ID copied: ' + UPI_DETAILS.upiId);
                                setTimeout(() => setSaveToast(null), 2500);
                              }}
                              className="text-[10px] font-bold text-[#087443] hover:underline"
                            >
                              Copy ID
                            </button>
                          </div>
                          <span className="font-mono font-bold text-[#111512] block text-[13px]">{UPI_DETAILS.upiId}</span>
                          <span className="text-[11px] text-[#68736D] block">{UPI_DETAILS.payeeName}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3 text-xs">
                        <span className="font-bold text-sm text-[#111512] block">Enter UPI Payment Confirmation:</span>
                        <div>
                          <label className="block text-[11px] font-bold text-[#111512] mb-1">
                            12-Digit UPI Reference No / UTR *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 702910482910"
                            value={formData.payment?.transactionRef || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(p => ({
                                ...p,
                                payment: {
                                  method: 'upi_qr',
                                  bankName: p.payment?.bankName || '',
                                  ddChequeNumber: p.payment?.ddChequeNumber || '',
                                  branch: p.payment?.branch || '',
                                  date: p.payment?.date || '',
                                  amount: formPricing.grandTotal,
                                  ...p.payment,
                                  transactionRef: val
                                }
                              }));
                            }}
                            className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#111512] mb-1">
                            Your UPI ID / Mobile Number
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. rajesh@oksbi"
                            value={formData.payment?.upiId || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData(p => ({
                                ...p,
                                payment: {
                                  method: 'upi_qr',
                                  bankName: p.payment?.bankName || '',
                                  ddChequeNumber: p.payment?.ddChequeNumber || '',
                                  branch: p.payment?.branch || '',
                                  date: p.payment?.date || '',
                                  amount: formPricing.grandTotal,
                                  transactionRef: p.payment?.transactionRef || '',
                                  ...p.payment,
                                  upiId: val
                                }
                              }));
                            }}
                            className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Bank Transfer (NEFT / RTGS) */}
                  {formData.payment?.method === 'bank_transfer' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3 text-xs">
                        <span className="font-bold text-sm text-[#111512] block">NSAI Official Bank Details:</span>
                        <div className="font-mono text-[#68736D] space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <div>A/C Name: <span className="font-bold text-[#111512]">{BANK_DETAILS.accountName}</span></div>
                          <div>A/C Number: <span className="font-bold text-[#087443]">{BANK_DETAILS.accountNumber}</span></div>
                          <div>Bank: <span className="font-bold text-[#111512]">{BANK_DETAILS.bankName}</span></div>
                          <div>IFSC: <span className="font-bold text-[#087443]">{BANK_DETAILS.ifsc}</span></div>
                          <div>Branch: <span className="text-[#111512]">{BANK_DETAILS.branch}</span></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3 text-xs">
                        <span className="font-bold text-sm text-[#111512] block">Transfer Reference Details:</span>
                        <input
                          type="text"
                          placeholder="NEFT / RTGS / UTR Reference No *"
                          value={formData.payment?.transactionRef || 'NEFT-89201948'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(p => ({
                              ...p,
                              payment: {
                                method: 'bank_transfer',
                                bankName: p.payment?.bankName || '',
                                ddChequeNumber: p.payment?.ddChequeNumber || '',
                                branch: p.payment?.branch || '',
                                date: p.payment?.date || '',
                                amount: formPricing.grandTotal,
                                ...p.payment,
                                transactionRef: val
                              }
                            }));
                          }}
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512] font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Bank & Branch Name"
                          value={formData.payment?.bankName || 'HDFC Bank, New Delhi'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(p => ({
                              ...p,
                              payment: {
                                method: 'bank_transfer',
                                ddChequeNumber: p.payment?.ddChequeNumber || '',
                                branch: p.payment?.branch || '',
                                date: p.payment?.date || '',
                                amount: formPricing.grandTotal,
                                transactionRef: p.payment?.transactionRef || '',
                                ...p.payment,
                                bankName: val
                              }
                            }));
                          }}
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mode 3: DD / Cheque */}
                  {formData.payment?.method === 'dd_cheque' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-2 text-xs">
                        <span className="font-bold text-sm text-[#111512] block">Demand Draft / Cheque Details:</span>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <div>In Favour Of: <span className="font-bold text-[#111512]">{BANK_DETAILS.ddInFavourOf}</span></div>
                          <div>Payable At: <span className="font-bold text-[#087443]">{BANK_DETAILS.payableAt}</span></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3 text-xs">
                        <input
                          type="text"
                          placeholder="DD / Cheque Number *"
                          value={formData.payment?.ddChequeNumber || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(p => ({
                              ...p,
                              payment: {
                                method: 'dd_cheque',
                                bankName: p.payment?.bankName || '',
                                branch: p.payment?.branch || '',
                                date: p.payment?.date || '',
                                amount: formPricing.grandTotal,
                                transactionRef: p.payment?.transactionRef || '',
                                ...p.payment,
                                ddChequeNumber: val
                              }
                            }));
                          }}
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512] font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Issuing Bank & Branch"
                          value={formData.payment?.bankName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData(p => ({
                              ...p,
                              payment: {
                                method: 'dd_cheque',
                                ddChequeNumber: p.payment?.ddChequeNumber || '',
                                branch: p.payment?.branch || '',
                                date: p.payment?.date || '',
                                amount: formPricing.grandTotal,
                                transactionRef: p.payment?.transactionRef || '',
                                ...p.payment,
                                bankName: val
                              }
                            }));
                          }}
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111512]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs flex items-start gap-2.5 text-xs">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsConfirmed}
                      onChange={(e) => setFormData(p => ({ ...p, termsConfirmed: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 rounded text-[#087443] focus:ring-[#087443]"
                    />
                    <label htmlFor="terms" className="text-[#68736D] leading-snug">
                      I confirm the delegate details provided are accurate and agree to NSAI Indian Seed Congress 2027 Guidelines.
                    </label>
                  </div>
                </div>
              )}

              {/* STICKY BOTTOM ACTION BAR */}
              <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-4 py-3.5 shadow-lg flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-1/3 h-12 rounded-xl bg-white border border-[#E5E7EB] text-[#111512] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{regStep === 1 ? 'Cancel' : 'Back'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-2/3 h-12 rounded-xl bg-[#087443] hover:bg-[#06452F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition-all"
                >
                  <span>{regStep === 8 ? 'Submit Registration' : 'Continue'}</span>
                  {regStep < 8 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>

            </div>

          ) : (
            
            /* ========================================================================= */
            /* 3. USER DASHBOARD (DYNAMIC STATUS: PENDING APPROVAL VS APPROVED) */
            /* ========================================================================= */
            <div className="h-full flex flex-col justify-between overflow-y-auto pb-24 pt-3">

              {/* TAB 1: HOME */}
              {activeTab === 'home' && (
                <div className="px-5 space-y-4">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[12px] text-[#68736D] font-medium block">
                        {getGreeting()}, {activeUser?.delegate?.name ? activeUser.delegate.name.split(' ')[0] : 'Rajesh'}
                      </span>
                      <h1 className="text-[20px] font-black text-[#111512] tracking-tight leading-tight">
                        Indian Seed Congress 2027
                      </h1>
                      <div className="flex items-center gap-1 text-[11px] text-[#68736D] font-medium mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#087443] stroke-[2.5]" />
                        <span>Ramoji Film City · Hyderabad</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={() => setShowNotifications(true)}
                        className="relative p-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-[#111512] shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
                      >
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E5A62A] ring-2 ring-white" />
                      </button>

                      <div 
                        onClick={() => setActiveTab('profile')}
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-600/30 cursor-pointer shadow-2xs active:scale-95 transition-all"
                      >
                        <img src="/images/delegate_avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Clean Official NSAI Logo Banner */}
                  <div className="rounded-[24px] bg-white border border-[#E5E7EB] p-5 shadow-2xs flex items-center justify-center min-h-[120px] transition-all hover:shadow-xs">
                    <img 
                      src="/images/nsai_logo.png" 
                      alt="National Seed Association of India" 
                      className="h-16 max-h-20 w-auto object-contain max-w-full drop-shadow-2xs" 
                    />
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <button 
                      onClick={() => setActiveTab('ticket')}
                      className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#087443] active:scale-95 transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#087443] flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#111512]">My Pass</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('services')}
                      className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#087443] active:scale-95 transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#E5A62A] flex items-center justify-center">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#111512]">Services</span>
                    </button>

                    <button 
                      onClick={handleEditRegistration}
                      className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#087443] active:scale-95 transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#087443] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#111512]">Edit Reg</span>
                    </button>

                    <button 
                      onClick={() => alert('Venue: Ramoji Film City, Hyderabad - 26-28 February 2027')}
                      className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#087443] active:scale-95 transition-all flex flex-col items-center gap-1.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#111512] flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#111512]">Venue</span>
                    </button>
                  </div>

                  {/* DYNAMIC REGISTRATION STATUS CARD: PENDING APPROVAL VS APPROVED */}
                  <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#087443] uppercase tracking-wider">
                        MY REGISTRATION
                      </span>
                      
                      {isPending ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E5A62A] animate-ping" />
                          <span>● AWAITING APPROVAL</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 bg-emerald-50 text-[#087443] border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>✓ APPROVED</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-black text-[#111512] font-mono tracking-tight">
                        {activeUser?.registrationId || DEMO_USER_ID}
                      </span>
                      <span className={`text-[11px] font-bold ${isApproved ? 'text-[#087443]' : 'text-[#E5A62A]'}`}>
                        {isApproved ? 'Allocations Confirmed' : 'Under Review by NSAI'}
                      </span>
                    </div>

                    <p className="text-xs text-[#68736D] leading-snug">
                      {isApproved 
                        ? 'Your registration has been approved. Digital event credential and allocations (T-12, A-14) are ready.' 
                        : 'Your registration has been submitted and is awaiting approval from NSAI Secretariat.'}
                    </p>

                    {isPending ? (
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={handleSimulateApproval}
                          className="w-full py-2.5 rounded-xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simulate Secretariat Approval (Demo)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => setActiveTab('ticket')}
                          className="w-full py-2.5 rounded-xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                        >
                          <span>View Event Pass →</span>
                        </button>
                        <button
                          onClick={handleSimulatePending}
                          className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#68736D] text-[11px] font-bold border border-slate-200 transition-all text-center"
                        >
                          Switch back to Pending State (Demo)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* My Services Preview */}
                  <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#087443] uppercase tracking-wider">
                        MY SERVICES
                      </span>
                      <button onClick={() => setActiveTab('services')} className="text-[10px] font-bold text-[#087443] hover:underline">
                        View All (6) →
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {allFilledServices.slice(0, 3).map(srv => (
                        <div 
                          key={srv.id} 
                          onClick={() => setSelectedServiceModal(srv)}
                          className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-1 rounded-lg transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <srv.icon className="w-4 h-4 text-[#087443]" />
                            <div>
                              <span className="font-bold text-[#111512] block leading-tight">{srv.title}</span>
                              <span className="text-[10px] text-[#68736D]">{srv.detail}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                            isApproved 
                              ? 'bg-emerald-50 text-[#087443] border-emerald-200' 
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}>
                            {srv.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Event Schedule Timeline */}
                  <div className="p-4 rounded-[22px] bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-[#087443] uppercase tracking-wider">
                        EVENT TIMELINE
                      </span>
                      <span className="text-[10px] font-bold text-[#E5A62A] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        26–28 FEB 2027
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="px-2 py-1 rounded-lg bg-[#06452F] text-white text-[10px] font-bold shrink-0">DAY 01</span>
                        <div className="flex-1">
                          <span className="font-bold text-[#111512] block">Registration & Inauguration</span>
                          <span className="text-[10px] text-[#68736D]">26 Feb • 10:00 AM • Main Auditorium</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="px-2 py-1 rounded-lg bg-[#06452F] text-white text-[10px] font-bold shrink-0">DAY 02</span>
                        <div className="flex-1">
                          <span className="font-bold text-[#111512] block">Congress Symposia & B2B Trading</span>
                          <span className="text-[10px] text-[#68736D]">27 Feb • 09:30 AM • Hall A & B</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="px-2 py-1 rounded-lg bg-[#06452F] text-white text-[10px] font-bold shrink-0">DAY 03</span>
                        <div className="flex-1">
                          <span className="font-bold text-[#111512] block">Valedictory & Gala Dinner</span>
                          <span className="text-[10px] text-[#68736D]">28 Feb • 05:30 PM • Grand Ballroom</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: SERVICES */}
              {activeTab === 'services' && (
                <div className="px-5 space-y-4">
                  <div className="pt-1">
                    <h1 className="text-[20px] font-black text-[#111512]">My Services</h1>
                    <p className="text-xs text-[#68736D]">
                      {isApproved ? 'Confirmed bookings and allocations from your registration.' : 'Requested services currently in review.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {allFilledServices.map(srv => (
                      <div 
                        key={srv.id}
                        onClick={() => setSelectedServiceModal(srv)}
                        className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-between cursor-pointer hover:border-[#087443] active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#087443] shrink-0">
                            <srv.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-[#111512] block leading-tight">{srv.title}</span>
                            <span className="text-[11px] text-[#68736D] block">{srv.detail}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            isApproved 
                              ? 'bg-emerald-50 text-[#087443] border-emerald-200' 
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}>
                            {srv.badge}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#68736D]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TICKET */}
              {activeTab === 'ticket' && (
                <div className="px-5 space-y-4">
                  <div className="pt-1">
                    <h1 className="text-[20px] font-black text-[#111512]">Event Pass</h1>
                    <p className="text-xs text-[#68736D]">Official digital credential for Indian Seed Congress 2027.</p>
                  </div>

                  {/* OFFICIAL DIGITAL EVENT PASS */}
                  <div className="rounded-[28px] bg-white border border-[#E5E7EB] overflow-hidden shadow-md relative">
                    <div className="bg-[#06452F] p-5 text-white flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-[#E5A62A] uppercase tracking-wider block">ISC 2027 EVENT PASS</span>
                        <h3 className="text-base font-black text-white">INDIAN SEED CONGRESS 2027</h3>
                        <span className="text-[11px] text-emerald-200 block">Ramoji Film City • Hyderabad • 26–28 Feb 2027</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white shrink-0 border ${
                        isApproved ? 'bg-emerald-500/20 border-emerald-400/40' : 'bg-amber-500/20 border-amber-400/40'
                      }`}>
                        {isApproved ? 'APPROVED ✓' : 'PENDING APPROVAL'}
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h2 className="text-lg font-black text-[#111512]">{activeUser?.delegate?.name || 'Rajesh Sharma'}</h2>
                        <p className="text-xs font-bold text-[#087443]">{activeUser?.delegate?.organization || 'ABC Seeds Pvt Ltd'}</p>
                        <p className="text-xs text-[#68736D]">{activeUser?.delegate?.designation || 'Managing Director'}</p>
                        <span className="text-[11px] font-mono text-[#68736D] block mt-1">ID: {activeUser?.registrationId || DEMO_USER_ID}</span>
                      </div>

                      <div className="flex items-center justify-between border-y border-dashed border-[#E5E7EB] py-3 text-xs">
                        <div>
                          <span className="text-[9px] text-[#68736D] uppercase font-bold block">Table</span>
                          <span className="font-extrabold text-[#087443]">{isApproved ? 'T-12 (Hall A)' : 'Pending'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#68736D] uppercase font-bold block">Stall</span>
                          <span className="font-extrabold text-[#087443]">{isApproved ? 'A-14 (Premium)' : 'Pending'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#68736D] uppercase font-bold block">Sponsorship</span>
                          <span className="font-extrabold text-[#111512]">Platinum</span>
                        </div>
                      </div>

                      <div className="text-center py-2 space-y-2">
                        <div className="p-3.5 border border-slate-200 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center bg-white shadow-xs relative">
                          <QrCode className={`w-36 h-36 ${isApproved ? 'text-[#06452F]' : 'text-slate-300 blur-[1px]'}`} />
                          {!isApproved && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl p-2 text-center">
                              <Lock className="w-6 h-6 text-[#E5A62A] mb-1" />
                              <span className="text-[10px] font-black text-[#111512]">LOCKED</span>
                              <span className="text-[9px] text-[#68736D]">Pending NSAI Approval</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-[#68736D] block">
                          {isApproved ? 'Scan at Ramoji Film City Entrance Gates' : 'Digital pass will be activated upon approval'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      {isApproved ? (
                        <button
                          onClick={() => {
                            setSaveToast('Digital Pass downloaded to device successfully!');
                            setTimeout(() => setSaveToast(null), 3000);
                          }}
                          className="w-full h-12 rounded-xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                        >
                          <Download className="w-4 h-4" /> Download / View Full Pass
                        </button>
                      ) : (
                        <button
                          onClick={handleSimulateApproval}
                          className="w-full h-12 rounded-xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                        >
                          <Check className="w-4 h-4" /> Approve Pass (Demo Simulation)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROFILE */}
              {activeTab === 'profile' && (
                <div className="px-5 space-y-5">
                  <div className="text-center space-y-1 pt-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#087443] mx-auto shadow-sm">
                      <img src="/images/delegate_avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-base font-black text-[#111512] pt-1">{activeUser?.delegate?.name || 'Rajesh Sharma'}</h3>
                    <p className="text-xs font-bold text-[#087443]">{activeUser?.delegate?.organization || 'ABC Seeds Pvt Ltd'}</p>
                    <p className="text-xs text-[#68736D]">{activeUser?.delegate?.designation || 'Managing Director'}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] divide-y divide-slate-100 text-xs shadow-2xs">
                    <div className="py-2.5 flex justify-between"><span className="text-[#68736D]">Mobile</span><span className="font-bold text-[#111512]">{activeUser?.delegate?.mobile || '+91 98765 43210'}</span></div>
                    <div className="py-2.5 flex justify-between"><span className="text-[#68736D]">Email</span><span className="font-bold text-[#111512]">{activeUser?.delegate?.email || 'rajesh@example.com'}</span></div>
                    <div className="py-2.5 flex justify-between"><span className="text-[#68736D]">Membership</span><span className="font-bold text-[#111512]">NSAI Member</span></div>
                    <div className="py-2.5 flex justify-between"><span className="text-[#68736D]">Registration ID</span><span className="font-bold font-mono text-[#087443]">{activeUser?.registrationId || DEMO_USER_ID}</span></div>
                    <div className="py-2.5 flex justify-between"><span className="text-[#68736D]">Status</span><span className={`font-bold ${isApproved ? 'text-[#087443]' : 'text-[#E5A62A]'}`}>{isApproved ? 'APPROVED ✓' : 'AWAITING APPROVAL'}</span></div>
                  </div>

                  <div className="p-2 rounded-2xl bg-white border border-[#E5E7EB] divide-y divide-slate-100 text-xs font-bold shadow-2xs">
                    <button 
                      onClick={handleEditRegistration}
                      className="w-full p-3 flex justify-between items-center text-[#111512] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <span>Edit Profile & Registration</span>
                      <ChevronRight className="w-4 h-4 text-[#68736D]" />
                    </button>
                    <button onClick={() => setShowNotifications(true)} className="w-full p-3 flex justify-between items-center text-[#111512] hover:bg-slate-50 rounded-xl transition-all">
                      <span>Notifications ({notifications.length})</span>
                      <ChevronRight className="w-4 h-4 text-[#68736D]" />
                    </button>
                    <button onClick={() => alert('Contacting NSAI Secretariat: info@nsai.org')} className="w-full p-3 flex justify-between items-center text-[#111512] hover:bg-slate-50 rounded-xl transition-all">
                      <span>Help & Support</span>
                      <ChevronRight className="w-4 h-4 text-[#68736D]" />
                    </button>
                    {onSwitchToWebsite && (
                      <button onClick={onSwitchToWebsite} className="w-full p-3 flex justify-between items-center text-[#087443] hover:bg-emerald-50 rounded-xl transition-all">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          <span>Switch to Desktop Website</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#68736D]" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setShowWelcome(true);
                      setAppView('dashboard');
                    }}
                    className="w-full h-11 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-95 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}

              {/* SERVICE DETAILS MODAL */}
              {selectedServiceModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
                  <div className="bg-white rounded-t-[32px] p-6 space-y-4 max-h-[85%] overflow-y-auto shadow-2xl max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <selectedServiceModal.icon className="w-5 h-5 text-[#087443]" />
                        <h3 className="text-base font-black text-[#111512]">{selectedServiceModal.title}</h3>
                      </div>
                      <button onClick={() => setSelectedServiceModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-90">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className={`p-3.5 rounded-2xl border ${
                        isApproved ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                      }`}>
                        <span className={`font-bold block text-sm ${isApproved ? 'text-[#087443]' : 'text-amber-900'}`}>{selectedServiceModal.badge}</span>
                        <p className="text-[#111512] font-semibold mt-1">{selectedServiceModal.detail}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-[#68736D] leading-relaxed block">{selectedServiceModal.sub}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedServiceModal(null)}
                      className="w-full py-3 bg-[#087443] text-white font-bold rounded-xl text-xs active:scale-95"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* NOTIFICATION MODAL */}
              {showNotifications && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
                  <div className="bg-white rounded-t-[32px] p-6 space-y-4 max-h-[80%] overflow-y-auto shadow-2xl max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h3 className="text-base font-black text-[#111512]">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-90">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#087443]">{n.title}</span>
                            <span className="text-[10px] text-[#68736D]">{n.timestamp}</span>
                          </div>
                          <p className="text-[#111512] leading-snug">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* MAIN APP BOTTOM NAVIGATION */}
          {/* ========================================================================= */}
          {appView === 'dashboard' && !showWelcome && (
            <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-3 py-2.5 z-40 flex items-center justify-around shadow-lg">
              
              {/* 1. Home */}
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative active:scale-90 ${
                  activeTab === 'home' ? 'text-[#06452F] font-black' : 'text-[#68736D] font-medium'
                }`}
              >
                <Home className="w-5 h-5 fill-current stroke-[2.5]" />
                <span className="text-[10px]">Home</span>
                {activeTab === 'home' && (
                  <span className="w-5 h-0.5 bg-[#06452F] rounded-full absolute -bottom-1 shadow-xs" />
                )}
              </button>

              {/* 2. Services */}
              <button
                onClick={() => setActiveTab('services')}
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative active:scale-90 ${
                  activeTab === 'services' ? 'text-[#06452F] font-black' : 'text-[#68736D] font-medium'
                }`}
              >
                <Layers className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px]">Services</span>
                {activeTab === 'services' && (
                  <span className="w-5 h-0.5 bg-[#06452F] rounded-full absolute -bottom-1 shadow-xs" />
                )}
              </button>

              {/* 3. Ticket */}
              <button
                onClick={() => setActiveTab('ticket')}
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative active:scale-90 ${
                  activeTab === 'ticket' ? 'text-[#06452F] font-black' : 'text-[#68736D] font-medium'
                }`}
              >
                <QrCode className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px]">Ticket</span>
                {activeTab === 'ticket' && (
                  <span className="w-5 h-0.5 bg-[#06452F] rounded-full absolute -bottom-1 shadow-xs" />
                )}
              </button>

              {/* 4. Profile */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative active:scale-90 ${
                  activeTab === 'profile' ? 'text-[#06452F] font-black' : 'text-[#68736D] font-medium'
                }`}
              >
                <User className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px]">Profile</span>
                {activeTab === 'profile' && (
                  <span className="w-5 h-0.5 bg-[#06452F] rounded-full absolute -bottom-1 shadow-xs" />
                )}
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. SUBMISSION SUCCESS POPUP MODAL (PENDING APPROVAL STATUS) */}
          {/* ========================================================================= */}
          {showSubmissionSuccessModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end">
              <div className="bg-white rounded-t-[32px] p-6 space-y-4 max-h-[90%] overflow-y-auto shadow-2xl max-w-md mx-auto w-full animate-in slide-in-from-bottom duration-300 text-center">
                
                {/* Checkmark Icon & Title */}
                <div className="space-y-2 pt-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-[#087443] mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                  </div>
                  
                  <h3 className="text-xl font-black text-[#111512] tracking-tight">
                    Registration Submitted!
                  </h3>
                  
                  {/* PENDING APPROVAL STATUS BADGE */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#E5A62A] animate-ping" />
                    <span>● Awaiting NSAI Approval (Pending)</span>
                  </div>
                </div>

                {/* Application Details Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 text-left divide-y divide-slate-200/70">
                  <div className="flex justify-between items-center">
                    <span className="text-[#68736D]">Application / Reg ID</span>
                    <span className="font-mono font-black text-sm text-[#087443]">{activeUser?.registrationId}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#68736D]">Delegate Name</span>
                    <span className="font-bold text-[#111512]">{activeUser?.delegate?.name}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#68736D]">Organization</span>
                    <span className="font-bold text-[#111512]">{activeUser?.delegate?.organization}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[#68736D]">Total Invoiced (incl. 18% GST)</span>
                    <span className="font-mono font-black text-sm text-[#111512]">{formatCurrency(formPricing.grandTotal)}</span>
                  </div>
                </div>

                <p className="text-xs text-[#68736D] leading-relaxed px-1">
                  Your registration has been submitted to NSAI Secretariat. You will receive SMS verification, and your <strong>Digital Event Pass & Allocations</strong> will be unlocked once approved.
                </p>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  {/* 1. GO TO DASHBOARD */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionSuccessModal(false);
                      setAppView('dashboard');
                      setActiveTab('home');
                    }}
                    className="w-full h-12 rounded-xl bg-[#087443] hover:bg-[#06452F] active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* 2. DEMO SIMULATE APPROVAL */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmissionSuccessModal(false);
                      handleSimulateApproval();
                      setAppView('dashboard');
                      setActiveTab('home');
                    }}
                    className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-[#111512] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#E5A62A]" />
                    <span>Simulate Instant Secretariat Approval (Demo)</span>
                  </button>
                </div>

              </div>
            </div>
          )}

      </div>
    </div>
  );
};
