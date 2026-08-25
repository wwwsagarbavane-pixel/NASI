import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SmartRegistrationForm } from './components/SmartRegistrationForm';
import { MyRegistrationDashboard } from './components/dashboard/MyRegistrationDashboard';
import { DigitalEventTicket } from './components/DigitalEventTicket';
import { SupportModal } from './components/SupportModal';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { AdminControlCenter } from './components/AdminControlCenter';
import { MobileApp } from './components/mobile/MobileApp';

import { 
  RegistrationPackageData, 
  ValidationErrors, 
  SingleDelegate,
  PaymentDetails,
  SpouseDetails,
  UserSession,
  DynamicRates,
  EventSettings,
  RegistrationSettings,
  RegCategory,
  SpousePackage,
  HotelRoomAdmin,
  SponsorshipPackageAdmin,
  AdvertisementPackageAdmin,
  MembershipTypeAdmin,
  FormSectionConfig,
  TradingTableAdmin,
  TableTypeAdmin,
  ExhibitionStallAdmin,
  StallTypeAdmin
} from './types';
import { generateApplicationId, generateTicketId } from './utils/pricing';

const MOCK_USERS: RegistrationPackageData[] = [
  {
    applicationId: "app-849102",
    ticketId: "tkt-849102",
    registrationId: "ISC27-849102",
    status: "under_review",
    submissionDate: "20 Aug 2026",
    delegate: {
      name: "Rajesh Kumar",
      designation: "Managing Director",
      mobile: "9876543210",
      email: "rajesh@company.com",
      organization: "Vedic Seeds Corp",
      address: "Sector 5, Hitec City",
      city: "Hyderabad",
      pinCode: "500081",
      stateCountry: "Telangana",
      nsaiMembershipNo: "NSAI/2026/894",
      membershipType: "member",
    },
    spouse: { enabled: false, list: [] },
    stay: { enabled: false, checkInDate: "", checkOutDate: "", nights: 1 },
    tradingTable: { enabled: false, quantity: 1 },
    exhibition: { enabled: false, stallType: "normal" },
    sponsorship: { enabled: false, tier: "event", useIncludedTradingTable: true, useIncludedAd: true },
    advertisement: { enabled: false, placement: "regular_full", useIncludedWithSponsor: true },
    payment: {
      method: "bank_transfer",
      bankName: "HDFC Bank",
      ddChequeNumber: "",
      branch: "Madhapur",
      date: "2027-02-18",
      amount: 25000,
      transactionRef: "TXN94028471"
    },
    termsConfirmed: true
  }
];

const INITIAL_RATES: DynamicRates = {
  delegateMember: 25000,
  delegateNonMember: 30000,
  spouseFee: 20000,
  stayPerNight: 15000,
  tradingTablePerTable: 30000,
  stall_normal: 120000,
  stall_premium: 150000,
  sponsor_event: 900000,
  sponsor_platinum: 700000,
  sponsor_welcome_dinner: 600000,
  sponsor_gala_dinner: 500000,
  sponsor_gold: 500000,
  sponsor_lunch: 400000,
  sponsor_conference_kit: 300000,
  sponsor_badge_lanyard: 200000,
  sponsor_silver: 300000,
  sponsor_bronze: 200000,
  ad_back_page: 200000,
  ad_front_inside: 100000,
  ad_back_inner: 100000,
  ad_back_inner_facing: 100000,
  ad_regular_full: 30000,
  ad_regular_half: 20000,
};

const INITIAL_EVENT_SETTINGS: EventSettings = {
  eventName: "Indian Seed Congress 2027",
  eventLocation: "Ramoji Film City, Hyderabad",
  eventDate: "25-27 February 2027",
  registrationOpeningDate: "2026-10-01",
  registrationClosingDate: "2027-02-15",
  contactEmail: "isc2027@nsai.co.in",
  contactNumber: "+91-11-43533241",
  bankAccountName: "National Seed Association of India",
  bankAccountNumber: "36261440426",
  bankName: "State Bank of India",
  bankBranch: "Kasturba Gandhi Marg, New Delhi",
  bankIfsc: "SBIN0050191",
  bankSwift: "SBININBB701"
};

const INITIAL_REG_SETTINGS: RegistrationSettings = {
  isRegistrationOpen: true,
  allowNewRegistrations: true,
  allowEditing: true,
  requireEmailOtp: true,
  requireMobileOtp: true,
  requireMemberVerification: true,
  requirePaymentBeforeApproval: true,
  enableSponsorship: true,
  enableAdvertisement: true,
  enableHotelBooking: true,
  enableTableBooking: true,
  enableStallBooking: true
};

const INITIAL_CATEGORIES: RegCategory[] = [
  { id: 'member', name: 'NSAI Member', price: 25000, tax: 18, finalPrice: 29500, maxRegistrations: 500, booked: 0, availableFrom: '2026-10-01', availableUntil: '2027-02-15', status: 'active', description: 'NSAI registered members' },
  { id: 'non_member', name: 'Non-Member', price: 30000, tax: 18, finalPrice: 35400, maxRegistrations: 300, booked: 0, availableFrom: '2026-10-01', availableUntil: '2027-02-15', status: 'active', description: 'General delegates / non-members' }
];

const INITIAL_SPOUSE_PACKAGES: SpousePackage[] = [
  { id: 'spouse_standard', name: 'Spouse / Accompanying Person', price: 20000, maxPersons: 5, status: 'active', includedBenefits: ['Conference Access', 'Lunch', 'Dinner', 'Kit Bag', 'Welcome Ceremony Access'] }
];

const INITIAL_HOTEL_ROOMS: HotelRoomAdmin[] = [
  { id: 'room_deluxe', hotelName: 'Sitara Luxury Hotel (5 Star)', roomType: 'Deluxe Room', occupancy: 2, pricePerNight: 15000, tax: 18, totalPerNight: 17700, availableRooms: 50, booked: 0, maxNights: 5, status: 'available', amenities: ['Free WiFi', 'Breakfast Included', 'Swimming Pool Access', 'Gym Access'] },
  { id: 'room_suit', hotelName: 'Tara Luxury Hotel (4 Star)', roomType: 'Executive Suit', occupancy: 2, pricePerNight: 10000, tax: 18, totalPerNight: 11800, availableRooms: 30, booked: 0, maxNights: 5, status: 'available', amenities: ['Free WiFi', 'Breakfast Included', 'Mini Bar'] }
];

const INITIAL_SPONSOR_PACKAGES: SponsorshipPackageAdmin[] = [
  { id: 'sponsor_event', name: 'Event Sponsor', shortName: 'EVENT', price: 900000, tax: 18, discount: 0, finalPrice: 1062000, slotsLimit: 2, bookedSlots: 0, maxPerCompany: 1, status: 'available', benefits: ['Logo on Main Stage', 'Logo on Website', 'Back Cover Ad', '2 complimentary premium stalls', '4 Delegate passes'], includedDelegates: 4, includedStalls: 2, includedTables: 0, includedAds: 1 },
  { id: 'sponsor_platinum', name: 'Platinum Sponsor', shortName: 'PLATINUM', price: 700000, tax: 18, discount: 0, finalPrice: 826000, slotsLimit: 5, bookedSlots: 0, maxPerCompany: 1, status: 'available', benefits: ['Logo on Website', 'Main Stage Branding', '2 delegates passes', '1 exhibition stall', '1 trading table'], includedDelegates: 2, includedStalls: 1, includedTables: 1, includedAds: 1 }
];

const INITIAL_AD_PACKAGES: AdvertisementPackageAdmin[] = [
  { id: 'ad_back_page', name: 'Back Cover (Outer Page)', size: 'A4 Full Page', price: 200000, tax: 18, placement: 'back_cover', color: 'color', maxBookings: 1, booked: 0, status: 'active' },
  { id: 'ad_front_inside', name: 'Front Inside Cover', size: 'A4 Full Page', price: 100000, tax: 18, placement: 'inside_front', color: 'color', maxBookings: 1, booked: 0, status: 'active' },
  { id: 'ad_regular_full', name: 'Regular Full Page', size: 'A4 Full Page', price: 30000, tax: 18, placement: 'regular_full', color: 'color', maxBookings: 20, booked: 0, status: 'active' },
  { id: 'ad_regular_half', name: 'Regular Half Page', size: 'A5 Half Page', price: 20000, tax: 18, placement: 'regular_half', color: 'color', maxBookings: 30, booked: 0, status: 'active' }
];

const INITIAL_MEMBERSHIP_TYPES: MembershipTypeAdmin[] = [
  { id: 'member', name: 'NSAI Member', price: 25000, numRequired: true, verificationRequired: true, benefits: ['Discounted rates', 'B2B voting rights'], status: 'active' },
  { id: 'non_member', name: 'Non-Member', price: 30000, numRequired: false, verificationRequired: false, benefits: ['General admittance'], status: 'active' }
];

const INITIAL_FORM_CONFIGS: FormSectionConfig[] = [
  { id: 'sec_delegate', name: '01 Delegate Details', enabled: true, required: true, displayOrder: 1, helpText: 'Basic attendee information and inline OTP checks' },
  { id: 'sec_spouse', name: '02 Spouse & Stay', enabled: true, required: false, displayOrder: 2, helpText: 'Add spouse passes and choose hotel stays' },
  { id: 'sec_table', name: '03 Table Booking', enabled: true, required: false, displayOrder: 3, helpText: 'Reserve B2B B2B trading tables' },
  { id: 'sec_stall', name: '04 Exhibition Stall', enabled: true, required: false, displayOrder: 4, helpText: 'Book standard/premium exhibition modular stalls' },
  { id: 'sec_sponsor', name: '05 Sponsorship', enabled: true, required: false, displayOrder: 5, helpText: 'Principal / Tier packages builder' },
  { id: 'sec_ad', name: '06 Advertisement', enabled: true, required: false, displayOrder: 6, helpText: 'Souvenir space ads booking options' }
];

const INITIAL_TABLES: TradingTableAdmin[] = [
  { tableNumber: 'T01', location: 'Hall A', price: 30000, status: 'available' },
  { 
    tableNumber: 'T02', 
    location: 'Hall A', 
    price: 30000, 
    status: 'allocated', 
    allocatedTo: 'Rajesh Sharma', 
    registrationId: 'ISC27-00421', 
    companyName: 'ABC Seeds Pvt Ltd',
    allocatedDate: '25 Aug 2026',
    allocatedBy: 'superadmin',
    paymentStatus: 'verified',
    history: [{ date: '25 Aug 2026', action: 'allocated', toUser: 'Rajesh Sharma', toCompany: 'ABC Seeds Pvt Ltd', by: 'superadmin' }]
  },
  { 
    tableNumber: 'T03', 
    location: 'Hall A', 
    price: 30000, 
    status: 'reserved', 
    allocatedTo: 'Priya Kumar', 
    registrationId: 'ISC27-00432', 
    companyName: 'XYZ Seeds Ltd',
    allocatedDate: '25 Aug 2026',
    allocatedBy: 'superadmin',
    paymentStatus: 'pending',
    history: [{ date: '25 Aug 2026', action: 'allocated', toUser: 'Priya Kumar', toCompany: 'XYZ Seeds Ltd', by: 'superadmin' }]
  },
  { tableNumber: 'T04', location: 'Hall A', price: 30000, status: 'blocked', blockedReason: 'Reserved for VIP' },
  { tableNumber: 'T05', location: 'Hall A', price: 30000, status: 'available' },
  { tableNumber: 'T06', location: 'Hall A', price: 30000, status: 'available' },
  { tableNumber: 'T07', location: 'Hall A', price: 30000, status: 'available' },
  { tableNumber: 'T08', location: 'Hall A', price: 30000, status: 'available' },
  { tableNumber: 'T09', location: 'Hall B', price: 30000, status: 'available' },
  { tableNumber: 'T10', location: 'Hall B', price: 30000, status: 'available' }
];

const INITIAL_TABLE_TYPES: TableTypeAdmin[] = [
  { id: 'standard', name: 'Standard Table', price: 30000, size: '2x2 M', capacity: 2, benefits: ['2 Chairs', '1 Power Socket', 'WiFi'], status: 'active' },
  { id: 'premium', name: 'Premium Table', price: 45000, size: '3x2 M', capacity: 4, benefits: ['4 Chairs', '1 Power Socket', 'Branded Signage', 'WiFi'], status: 'active' },
  { id: 'vip', name: 'VIP Table', price: 60000, size: '3x3 M', capacity: 6, benefits: ['6 Chairs', '2 Power Sockets', 'VIP Lounge access', 'Signage', 'WiFi'], status: 'active' }
];

const INITIAL_STALLS: ExhibitionStallAdmin[] = [
  { stallNumber: 'A01', stallType: 'premium', size: '4 × 3 M', price: 150000, status: 'available' },
  { stallNumber: 'A02', stallType: 'premium', size: '4 × 3 M', price: 150000, status: 'available' },
  { stallNumber: 'A03', stallType: 'premium', size: '4 × 3 M', price: 150000, status: 'blocked' },
  { stallNumber: 'B01', stallType: 'normal', size: '3 × 3 M', price: 120000, status: 'available' },
  { stallNumber: 'B02', stallType: 'normal', size: '3 × 3 M', price: 120000, status: 'available' }
];

const INITIAL_STALL_TYPES: StallTypeAdmin[] = [
  { id: 'normal', name: 'Standard Stall', size: '3 × 3 Meter', price: 120000, tax: 18, includedDelegates: 1, includedTables: 1, includedChairs: 2, powerSupply: true, lighting: true, branding: true, furniture: true, benefits: ['1 Table', '2 Chairs', 'Power & Light', 'Company name fascia'], status: 'active' },
  { id: 'premium', name: 'Premium Stall', size: '4 × 3 Meter', price: 150000, tax: 18, includedDelegates: 2, includedTables: 1, includedChairs: 3, powerSupply: true, lighting: true, branding: true, furniture: true, benefits: ['1 Premium Table', '3 Chairs', 'Power & Spotlight', 'Custom fascia branding'], status: 'active' }
];

const INITIAL_SPONSOR_BENEFITS: string[] = [
  'Logo on Main Stage',
  'Logo on Website',
  'Full Page Advertisement',
  'Conference Kit Branding',
  '2 Complimentary Delegates',
  '1 Exhibition Stall',
  '1 Trading Table',
  'Gala Dinner Branding',
  'Welcome Dinner Branding',
  'Social Media Promotion',
  'Speaking Opportunity',
  'VIP Access'
];

const INITIAL_DATA: RegistrationPackageData = {
  applicationId: generateApplicationId(),
  ticketId: generateTicketId(),
  status: 'pending',
  submissionDate: '',
  delegate: {
    name: '',
    designation: '',
    mobile: '',
    email: '',
    organization: '',
    address: '',
    city: '',
    pinCode: '',
    stateCountry: '',
    nsaiMembershipNo: '',
    membershipType: 'member',
  },
  spouse: {
    enabled: false,
    list: [
      { id: 'spouse-1', name: '', mobile: '', email: '' }
    ],
    name: '',
    mobile: '',
    email: '',
  },
  stay: {
    enabled: false,
    checkInDate: '2027-02-25',
    checkOutDate: '2027-02-27',
    nights: 2,
  },
  tradingTable: {
    enabled: false,
    quantity: 1,
  },
  exhibition: {
    enabled: false,
    stallType: 'normal',
  },
  sponsorship: {
    enabled: false,
    tier: 'event',
    useIncludedTradingTable: true,
    useIncludedAd: true,
  },
  advertisement: {
    enabled: false,
    placement: 'regular_full',
    useIncludedWithSponsor: true,
  },
  payment: {
    method: 'bank_transfer',
    bankName: '',
    ddChequeNumber: '',
    branch: '',
    date: '2027-02-20',
    amount: 0,
    transactionRef: '',
  },
  termsConfirmed: false,
};

export const App: React.FC = () => {
  const [registeredUsers, setRegisteredUsers] = useState<RegistrationPackageData[]>(() => {
    const stored = localStorage.getItem('isc_registered_users');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_registered_users', JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  });

  const [isAdminPortal, setIsAdminPortal] = useState(() => {
    const stored = sessionStorage.getItem('isc_user_session');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.email === 'admin.com';
    }
    return false;
  });

  const [dynamicRates, setDynamicRates] = useState<DynamicRates>(() => {
    const stored = localStorage.getItem('isc_dynamic_rates');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_dynamic_rates', JSON.stringify(INITIAL_RATES));
    return INITIAL_RATES;
  });

  const [eventSettings, setEventSettings] = useState<EventSettings>(() => {
    const stored = localStorage.getItem('isc_event_settings');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_event_settings', JSON.stringify(INITIAL_EVENT_SETTINGS));
    return INITIAL_EVENT_SETTINGS;
  });

  const [regSettings, setRegSettings] = useState<RegistrationSettings>(() => {
    const stored = localStorage.getItem('isc_reg_settings');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_reg_settings', JSON.stringify(INITIAL_REG_SETTINGS));
    return INITIAL_REG_SETTINGS;
  });

  const [categories, setCategories] = useState<RegCategory[]>(() => {
    const stored = localStorage.getItem('isc_categories');
    if (stored) {
      const parsed = JSON.parse(stored) as RegCategory[];
      const filtered = parsed.filter(c => c.id !== 'student');
      localStorage.setItem('isc_categories', JSON.stringify(filtered));
      return filtered;
    }
    localStorage.setItem('isc_categories', JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  });

  const [spousePackages, setSpousePackages] = useState<SpousePackage[]>(() => {
    const stored = localStorage.getItem('isc_spouse_packages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_spouse_packages', JSON.stringify(INITIAL_SPOUSE_PACKAGES));
    return INITIAL_SPOUSE_PACKAGES;
  });

  const [hotelRooms, setHotelRooms] = useState<HotelRoomAdmin[]>(() => {
    const stored = localStorage.getItem('isc_hotel_rooms');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_hotel_rooms', JSON.stringify(INITIAL_HOTEL_ROOMS));
    return INITIAL_HOTEL_ROOMS;
  });

  const [sponsorshipPackages, setSponsorshipPackages] = useState<SponsorshipPackageAdmin[]>(() => {
    const stored = localStorage.getItem('isc_sponsor_packages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_sponsor_packages', JSON.stringify(INITIAL_SPONSOR_PACKAGES));
    return INITIAL_SPONSOR_PACKAGES;
  });

  const [advertisementPackages, setAdvertisementPackages] = useState<AdvertisementPackageAdmin[]>(() => {
    const stored = localStorage.getItem('isc_ad_packages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_ad_packages', JSON.stringify(INITIAL_AD_PACKAGES));
    return INITIAL_AD_PACKAGES;
  });

  const [membershipTypes, setMembershipTypes] = useState<MembershipTypeAdmin[]>(() => {
    const stored = localStorage.getItem('isc_membership_types');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_membership_types', JSON.stringify(INITIAL_MEMBERSHIP_TYPES));
    return INITIAL_MEMBERSHIP_TYPES;
  });

  const [formConfigs, setFormConfigs] = useState<FormSectionConfig[]>(() => {
    const stored = localStorage.getItem('isc_form_configs');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_form_configs', JSON.stringify(INITIAL_FORM_CONFIGS));
    return INITIAL_FORM_CONFIGS;
  });

  const [tables, setTables] = useState<TradingTableAdmin[]>(() => {
    const stored = localStorage.getItem('isc_tables');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_tables', JSON.stringify(INITIAL_TABLES));
    return INITIAL_TABLES;
  });

  const [tableTypes, setTableTypes] = useState<TableTypeAdmin[]>(() => {
    const stored = localStorage.getItem('isc_table_types');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_table_types', JSON.stringify(INITIAL_TABLE_TYPES));
    return INITIAL_TABLE_TYPES;
  });

  const [stalls, setStalls] = useState<ExhibitionStallAdmin[]>(() => {
    const stored = localStorage.getItem('isc_stalls');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_stalls', JSON.stringify(INITIAL_STALLS));
    return INITIAL_STALLS;
  });

  const [stallTypes, setStallTypes] = useState<StallTypeAdmin[]>(() => {
    const stored = localStorage.getItem('isc_stall_types');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_stall_types', JSON.stringify(INITIAL_STALL_TYPES));
    return INITIAL_STALL_TYPES;
  });

  const [sponsorBenefits, setSponsorBenefits] = useState<string[]>(() => {
    const stored = localStorage.getItem('isc_sponsor_benefits');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('isc_sponsor_benefits', JSON.stringify(INITIAL_SPONSOR_BENEFITS));
    return INITIAL_SPONSOR_BENEFITS;
  });

  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    const stored = sessionStorage.getItem('isc_user_session');
    return stored ? JSON.parse(stored) : null;
  });

  const [viewMode, setViewMode] = useState<'dashboard' | 'form' | 'ticket'>(
    userSession ? 'dashboard' : 'form'
  );

  const [appMode, setAppMode] = useState<'mobile' | 'website'>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('view') === 'website' || window.location.hash === '#website' || window.location.hash === '#admin') {
        return 'website';
      }
    }
    return 'mobile';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#website' || window.location.hash === '#admin') {
        setAppMode('website');
      } else if (window.location.hash === '#mobile') {
        setAppMode('mobile');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(userSession !== null);
  const [isMobileVerified, setIsMobileVerified] = useState(userSession !== null);

  const [formData, setFormData] = useState<RegistrationPackageData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  useEffect(() => {
    if (userSession) {
      const activeUser = registeredUsers.find(u => 
        u.delegate.email.trim().toLowerCase() === userSession.email.trim().toLowerCase() ||
        u.registrationId === userSession.registrationId ||
        u.applicationId === userSession.registrationId
      );

      if (activeUser) {
        setFormData(activeUser);
      } else {
        setFormData({
          ...INITIAL_DATA,
          applicationId: generateApplicationId(),
          ticketId: generateTicketId(),
          registrationId: `ISC27-${Math.floor(100000 + Math.random() * 900000)}`,
          delegate: {
            ...INITIAL_DATA.delegate,
            email: userSession.email,
            mobile: userSession.mobile
          }
        });
      }
      setIsEmailVerified(true);
      setIsMobileVerified(true);
    } else {
      setFormData(INITIAL_DATA);
      setIsEmailVerified(false);
      setIsMobileVerified(false);
    }
  }, [userSession, registeredUsers]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { name, designation, mobile, email, organization, address, city, pinCode, stateCountry } = formData.delegate;

    if (!name.trim()) newErrors.name = 'Delegate name is required';
    if (!designation.trim()) newErrors.designation = 'Designation is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (!organization.trim()) newErrors.organization = 'Organization is required';
    if (!address.trim()) newErrors.address = 'Registered address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!pinCode.trim()) newErrors.pinCode = 'PIN code is required';
    if (!stateCountry.trim()) newErrors.stateCountry = 'Please select State / Country';

    if (formData.spouse.enabled) {
      const spouseList = formData.spouse.list || [];
      if (spouseList.length === 0) {
        newErrors.spouse_name = 'Please enter spouse details';
      } else {
        spouseList.forEach((sp, idx) => {
          if (!sp.name.trim()) {
            newErrors[`spouse_name_${idx}`] = `Please enter full name for Spouse ${idx + 1}`;
          }
        });
      }
    }

    if (!formData.termsConfirmed) {
      newErrors.termsConfirmed = 'Please confirm the declaration before submitting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const submittedUser: RegistrationPackageData = {
        ...formData,
        status: 'under_review',
        submissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      let updatedUsers = [...registeredUsers];
      const matchIdx = updatedUsers.findIndex(u => 
        u.delegate.email.trim().toLowerCase() === submittedUser.delegate.email.trim().toLowerCase() ||
        u.registrationId === submittedUser.registrationId ||
        u.applicationId === submittedUser.applicationId
      );

      if (matchIdx >= 0) {
        updatedUsers[matchIdx] = submittedUser;
      } else {
        updatedUsers.push(submittedUser);
      }

      localStorage.setItem('isc_registered_users', JSON.stringify(updatedUsers));
      setRegisteredUsers(updatedUsers);

      const updatedSession: UserSession = {
        email: submittedUser.delegate.email,
        mobile: submittedUser.delegate.mobile,
        registrationId: submittedUser.registrationId || submittedUser.applicationId,
        isEmailVerified: true,
        isMobileVerified: true
      };
      sessionStorage.setItem('isc_user_session', JSON.stringify(updatedSession));
      setUserSession(updatedSession);

      setViewMode('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#0B6B43', '#E89A24', '#08452F'],
      });
    }, 800);
  };

  const handleLoginSuccess = (registrationId: string) => {
    if (registrationId === 'admin') {
      const session: UserSession = {
        email: 'admin.com',
        mobile: '0000000000',
        registrationId: 'admin',
        isEmailVerified: true,
        isMobileVerified: true
      };
      sessionStorage.setItem('isc_user_session', JSON.stringify(session));
      setUserSession(session);
      setIsAdminPortal(true);
      return;
    }
    const matched = registeredUsers.find(u => u.registrationId === registrationId || u.applicationId === registrationId);
    if (matched) {
      const session: UserSession = {
        email: matched.delegate.email,
        mobile: matched.delegate.mobile,
        registrationId: matched.registrationId || matched.applicationId,
        isEmailVerified: true,
        isMobileVerified: true
      };
      sessionStorage.setItem('isc_user_session', JSON.stringify(session));
      setUserSession(session);
      setViewMode('dashboard');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isc_user_session');
    setUserSession(null);
    setIsEmailVerified(false);
    setIsMobileVerified(false);
    setIsAdminPortal(false);
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDropdownAction = (action: 'dashboard' | 'details' | 'payment' | 'ticket') => {
    if (action === 'dashboard') {
      setViewMode('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'details') {
      setViewMode('dashboard');
      setTimeout(() => {
        const el = document.getElementById('section-07');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else if (action === 'payment') {
      setViewMode('dashboard');
      setTimeout(() => {
        const el = document.getElementById('payment-status-block');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else if (action === 'ticket') {
      setViewMode('ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isAdminPortal) {
    return (
      <AdminControlCenter
        registeredUsers={registeredUsers}
        onUpdateUsers={(updated) => {
          setRegisteredUsers(updated);
          localStorage.setItem('isc_registered_users', JSON.stringify(updated));
        }}
        dynamicRates={dynamicRates}
        onUpdateRates={(updatedRates) => {
          setDynamicRates(updatedRates);
          localStorage.setItem('isc_dynamic_rates', JSON.stringify(updatedRates));
        }}
        eventSettings={eventSettings}
        onUpdateEventSettings={(updatedSettings) => {
          setEventSettings(updatedSettings);
          localStorage.setItem('isc_event_settings', JSON.stringify(updatedSettings));
        }}
        regSettings={regSettings}
        onUpdateRegSettings={(updatedReg) => {
          setRegSettings(updatedReg);
          localStorage.setItem('isc_reg_settings', JSON.stringify(updatedReg));
        }}
        categories={categories}
        onUpdateCategories={(updated) => {
          setCategories(updated);
          localStorage.setItem('isc_categories', JSON.stringify(updated));
        }}
        spousePackages={spousePackages}
        onUpdateSpousePackages={(updated) => {
          setSpousePackages(updated);
          localStorage.setItem('isc_spouse_packages', JSON.stringify(updated));
        }}
        hotelRooms={hotelRooms}
        onUpdateHotelRooms={(updated) => {
          setHotelRooms(updated);
          localStorage.setItem('isc_hotel_rooms', JSON.stringify(updated));
        }}
        sponsorshipPackages={sponsorshipPackages}
        onUpdateSponsorshipPackages={(updated) => {
          setSponsorshipPackages(updated);
          localStorage.setItem('isc_sponsor_packages', JSON.stringify(updated));
        }}
        advertisementPackages={advertisementPackages}
        onUpdateAdvertisementPackages={(updated) => {
          setAdvertisementPackages(updated);
          localStorage.setItem('isc_ad_packages', JSON.stringify(updated));
        }}
        membershipTypes={membershipTypes}
        onUpdateMembershipTypes={(updated) => {
          setMembershipTypes(updated);
          localStorage.setItem('isc_membership_types', JSON.stringify(updated));
        }}
        formConfigs={formConfigs}
        onUpdateFormConfigs={(updated) => {
          setFormConfigs(updated);
          localStorage.setItem('isc_form_configs', JSON.stringify(updated));
        }}
        tables={tables}
        onUpdateTables={(updated) => {
          setTables(updated);
          localStorage.setItem('isc_tables', JSON.stringify(updated));
        }}
        tableTypes={tableTypes}
        onUpdateTableTypes={(updated) => {
          setTableTypes(updated);
          localStorage.setItem('isc_table_types', JSON.stringify(updated));
        }}
        stalls={stalls}
        onUpdateStalls={(updated) => {
          setStalls(updated);
          localStorage.setItem('isc_stalls', JSON.stringify(updated));
        }}
        stallTypes={stallTypes}
        onUpdateStallTypes={(updated) => {
          setStallTypes(updated);
          localStorage.setItem('isc_stall_types', JSON.stringify(updated));
        }}
        sponsorBenefits={sponsorBenefits}
        onUpdateSponsorBenefits={(updated) => {
          setSponsorBenefits(updated);
          localStorage.setItem('isc_sponsor_benefits', JSON.stringify(updated));
        }}
        onCloseAdmin={() => setIsAdminPortal(false)}
      />
    );
  }

  if (appMode === 'mobile' && !isAdminPortal) {
    return (
      <MobileApp
        registeredUsers={registeredUsers}
        onUpdateUsers={(updated) => {
          setRegisteredUsers(updated);
          localStorage.setItem('isc_registered_users', JSON.stringify(updated));
        }}
        categories={categories}
        spousePackages={spousePackages}
        hotelRooms={hotelRooms}
        tables={tables}
        stalls={stalls}
        sponsorshipPackages={sponsorshipPackages}
        advertisementPackages={advertisementPackages}
        dynamicRates={dynamicRates}
        onSwitchToWebsite={() => setAppMode('website')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#151A17] relative">
      {/* Discreet floating switcher to test Mobile App */}
      <div className="fixed top-2 right-3 z-50">
        <button
          onClick={() => setAppMode('mobile')}
          className="px-3 py-1.5 bg-[#0B6B43] text-white text-[11px] font-bold rounded-full shadow-lg hover:bg-[#085434] transition-all flex items-center gap-1.5"
        >
          📱 Open Mobile App
        </button>
      </div>
      
      <Header
        onOpenHelp={() => setIsHelpOpen(true)}
        isLoggedIn={userSession !== null}
        userName={formData.delegate.name || userSession?.email || ''}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        onDropdownAction={handleDropdownAction}
        isApproved={formData.status === 'approved'}
      />

      <div className="w-full relative">
        <HeroSection />
      </div>

      <div className="w-full bg-white text-[#151A17] flex-1">
        
        {viewMode === 'form' && (
          <div className="max-w-[1180px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
            <SmartRegistrationForm
              data={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isEmailVerified={isEmailVerified}
              isMobileVerified={isMobileVerified}
              onSetEmailVerified={setIsEmailVerified}
              onSetMobileVerified={setIsMobileVerified}
              dynamicRates={dynamicRates}
              categories={categories}
              spousePackages={spousePackages}
              hotelRooms={hotelRooms}
              sponsorshipPackages={sponsorshipPackages}
              advertisementPackages={advertisementPackages}
              stallTypes={stallTypes}
              tableTypes={tableTypes}
              onUpdateDelegate={(field: keyof SingleDelegate, value: any) => {
                setFormData((p) => ({
                  ...p,
                  delegate: { ...p.delegate, [field]: value },
                }));
                if (errors[field]) {
                  setErrors((p) => {
                    const upd = { ...p };
                    delete upd[field];
                    return upd;
                  });
                }
              }}
              onUpdateSpouse={(upd: Partial<SpouseDetails>) => {
                setFormData((p) => ({ ...p, spouse: { ...p.spouse, ...upd } }));
                if (errors.spouse_name) {
                  setErrors((p) => {
                    const updErr = { ...p };
                    delete updErr.spouse_name;
                    return updErr;
                  });
                }
              }}
              onUpdateStay={(upd) => {
                setFormData((p) => ({ ...p, stay: { ...p.stay, ...upd } }));
              }}
              onUpdateTradingTable={(upd) => {
                setFormData((p) => ({ ...p, tradingTable: { ...p.tradingTable, ...upd } }));
              }}
              onUpdateExhibition={(upd) => {
                setFormData((p) => ({ ...p, exhibition: { ...p.exhibition, ...upd } }));
              }}
              onUpdateSponsorship={(upd) => {
                setFormData((p) => ({ ...p, sponsorship: { ...p.sponsorship, ...upd } }));
              }}
              onUpdateAdvertisement={(upd) => {
                setFormData((p) => ({ ...p, advertisement: { ...p.advertisement, ...upd } }));
              }}
              onUpdatePayment={(upd: Partial<PaymentDetails>) => {
                setFormData((p) => ({ 
                  ...p, 
                  payment: { ...(p.payment || INITIAL_DATA.payment!), ...upd } 
                }));
              }}
              onToggleTerms={(checked) => {
                setFormData((p) => ({ ...p, termsConfirmed: checked }));
                if (errors.termsConfirmed) {
                  setErrors((p) => {
                    const upd = { ...p };
                    delete upd.termsConfirmed;
                    return upd;
                  });
                }
              }}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {viewMode === 'dashboard' && (
          <MyRegistrationDashboard
            data={formData}
            dynamicRates={dynamicRates}
            categories={categories}
            spousePackages={spousePackages}
            hotelRooms={hotelRooms}
            sponsorshipPackages={sponsorshipPackages}
            advertisementPackages={advertisementPackages}
            stallTypes={stallTypes}
            tableTypes={tableTypes}
            onEditRegistration={() => setViewMode('form')}
            onViewTicket={() => setViewMode('ticket')}
            onCompletePayment={() => {
              setViewMode('form');
              setTimeout(() => {
                const el = document.getElementById('section-08');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 150);
            }}
          />
        )}

        {viewMode === 'ticket' && (
          <div className="max-w-[1180px] mx-auto px-6 sm:px-8 py-12 sm:py-16">
            <DigitalEventTicket
              data={formData}
              onBackToStatus={() => {
                setViewMode('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        registeredUsers={registeredUsers}
        onLoginSuccess={handleLoginSuccess}
      />

      <SupportModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <Footer onAdminToggle={() => setIsAdminPortal(true)} />
    </div>
  );
};

export default App;
