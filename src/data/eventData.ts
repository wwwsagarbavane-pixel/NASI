export const EVENT_DETAILS = {
  title: "Indian Seed Congress 2027 Ramoji Film City, Hyderabad",
  shortTitle: "ISC 2027",
  dates: "February 2027",
  venue: "Ramoji Film City, Hyderabad",
  organizer: "National Seed Association of India (NSAI)",
  currencySymbol: "₹",
};

export const DELEGATE_PRICING = {
  member: 25000,
  non_member: 30000,
};

export const SPOUSE_PRICING = {
  fee: 20000,
};

export const STAY_PRICING = {
  perNight: 15000,
};

export const TRADING_TABLE_PRICING = {
  perTable: 30000,
};

export const PRICING_RATES = {
  delegateMember: 25000,
  delegateNonMember: 30000,
  spouse: 20000,
  accommodationPerNight: 15000,
  tradingTablePerUnit: 30000,
  stallNormal: 120000,
  stallPremium: 150000,
};

export const SUPPORT_INFO = {
  phone: "+91-11-43533241-43",
  whatsapp: "+91-9311957851",
  whatsappLink: "https://wa.me/919311957851",
  email: "isc2027@nsai.co.in",
  nsaiWebsite: "http://www.nsai.co.in",
  iscWebsite: "https://isc.nsai.co.in",
};

export const BANK_DETAILS = {
  accountName: "National Seed Association of India",
  accountNumber: "36261440426",
  bankName: "State Bank of India",
  branch: "Kasturba Gandhi Marg, 23 Himalya House K.G. Marg, New Delhi - 110001",
  ifsc: "SBIN0050191",
  swift: "SBININBB701",
  ddInFavourOf: "National Seed Association of India",
  payableAt: "New Delhi",
};

export const UPI_DETAILS = {
  upiId: "nsai.isc2027@sbi",
  payeeName: "National Seed Association of India",
  merchantCode: "NSAI-ISC2027",
};

export const STALL_OPTIONS = [
  {
    id: "normal",
    name: "Normal Stall",
    size: "3 × 3 Mtr",
    price: 120000,
    formattedPrice: "₹1,20,000",
    features: [
      "Standard Octanorm Modular Stall (3 × 3 Mtr)",
      "1 complimentary delegate registration included",
      "1 Table, 2 Chairs, 3 Spotlights & 5A Power Point",
      "Fascia board with company name",
    ],
  },
  {
    id: "premium",
    name: "Premium Stall",
    size: "4 × 3 Mtr",
    price: 150000,
    formattedPrice: "₹1,50,000",
    isPopular: true,
    features: [
      "Enhanced Corner / Prime Stall (4 × 3 Mtr)",
      "1 complimentary delegate registration included",
      "Prime floor traffic location with higher visibility",
      "2 Tables, 4 Chairs, 4 Spotlights & 15A Power Socket",
      "Custom branded fascia board",
    ],
  },
];

export const SOUVENIR_OPTIONS = [
  {
    id: "back_page",
    name: "Back Page (Outer Cover)",
    price: 200000,
    formattedPrice: "₹2,00,000",
    dimensions: "Full Page Color (A4)",
    highlight: "Highest visibility position",
  },
  {
    id: "front_inside",
    name: "Front Inside Page (Cover 2)",
    price: 100000,
    formattedPrice: "₹1,00,000",
    dimensions: "Full Page Color (A4)",
    highlight: "First spread after front cover",
  },
  {
    id: "back_inner",
    name: "Back Inner Page (Cover 3)",
    price: 100000,
    formattedPrice: "₹1,00,000",
    dimensions: "Full Page Color (A4)",
    highlight: "Facing inside back cover",
  },
  {
    id: "back_inner_facing",
    name: "Back Inner Facing Page",
    price: 100000,
    formattedPrice: "₹1,00,000",
    dimensions: "Full Page Color (A4)",
    highlight: "Adjacent to back inner cover",
  },
  {
    id: "regular_full",
    name: "Regular Full Page",
    price: 30000,
    formattedPrice: "₹30,000",
    dimensions: "Full Page Color (A4)",
    highlight: "Within congress souvenir body",
  },
  {
    id: "regular_half",
    name: "Regular Half Page",
    price: 20000,
    formattedPrice: "₹20,000",
    dimensions: "Half Page Color (Horizontal)",
    highlight: "Compact high-value placement",
  },
];

export interface SponsorOption {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  tag: string;
  includesTable: boolean;
  includesAd: string; // 'back_cover' | 'full_page' | 'half_page' | 'none'
  includesDelegates: number;
  includesStalls: string;
  benefits: string[];
}

export const SPONSORSHIP_OPTIONS: SponsorOption[] = [
  {
    id: "event",
    name: "Event Sponsor",
    price: 900000,
    formattedPrice: "₹9,00,000",
    tag: "Principal Partner",
    includesTable: false,
    includesAd: "back_cover",
    includesDelegates: 4,
    includesStalls: "2 Premium Stalls",
    benefits: [
      "4 Complimentary Delegate Registrations",
      "2 Premium Exhibition Stalls (4 × 3 Mtr each)",
      "1 Private Meeting Room for exclusive B2B sessions",
      "15-min Business Presentation Slot in main auditorium",
      "Back Cover Ad in official Congress Souvenir",
      "Prominent Venue & Website Branding across all digital assets",
      "Kit Bag Promotional Material insertion",
    ],
  },
  {
    id: "platinum",
    name: "Platinum Sponsor",
    price: 700000,
    formattedPrice: "₹7,00,000",
    tag: "Tier 1 Partner",
    includesTable: true,
    includesAd: "full_page",
    includesDelegates: 2,
    includesStalls: "2 Exhibition Stalls",
    benefits: [
      "2 Complimentary Delegate Registrations",
      "2 Exhibition Stalls",
      "1 Trading Table included",
      "10-min Presentation Slot in plenary session",
      "Full Page Ad in Souvenir",
      "Venue & Website Branding",
      "Kit Bag Promo Material insertion",
    ],
  },
  {
    id: "welcome_dinner",
    name: "Welcome Dinner Sponsor",
    price: 600000,
    formattedPrice: "₹6,00,000",
    tag: "Hospitality Partner",
    includesTable: true,
    includesAd: "full_page",
    includesDelegates: 2,
    includesStalls: "None",
    benefits: [
      "2 Complimentary Delegate Registrations",
      "1 Trading Table included",
      "Full Page Ad in Souvenir",
      "Exclusive Welcome Dinner Area Branding & Stage welcome acknowledgement",
      "Kit Bag Material insertion",
    ],
  },
  {
    id: "gala_dinner",
    name: "Gala Dinner Sponsor",
    price: 600000,
    formattedPrice: "₹6,00,000",
    tag: "Hospitality Partner",
    includesTable: true,
    includesAd: "full_page",
    includesDelegates: 2,
    includesStalls: "None",
    benefits: [
      "2 Complimentary Delegate Registrations",
      "1 Trading Table included",
      "Full Page Ad in Souvenir",
      "Exclusive Gala Dinner Area Branding & Gala evening spotlight",
      "Kit Bag Material insertion",
    ],
  },
  {
    id: "gold",
    name: "Gold Sponsor",
    price: 500000,
    formattedPrice: "₹5,00,000",
    tag: "Tier 2 Partner",
    includesTable: true,
    includesAd: "full_page",
    includesDelegates: 2,
    includesStalls: "None",
    benefits: [
      "2 Complimentary Delegate Registrations",
      "1 Trading Table included",
      "Full Page Ad in Souvenir",
      "Venue & Website Branding",
      "Kit Bag Material insertion",
    ],
  },
  {
    id: "lunch",
    name: "Lunch Sponsor",
    price: 500000,
    formattedPrice: "₹5,00,000",
    tag: "Hospitality Partner",
    includesTable: true,
    includesAd: "full_page",
    includesDelegates: 2,
    includesStalls: "None",
    benefits: [
      "2 Complimentary Delegate Registrations",
      "1 Trading Table included",
      "Full Page Ad in Souvenir",
      "Venue & Website Branding",
      "Kit Bag Material insertion",
      "Exclusive Lunch Area Branding",
    ],
  },
  {
    id: "conference_kit",
    name: "Conference Kit Sponsor",
    price: 500000,
    formattedPrice: "₹5,00,000",
    tag: "Delegate Merchandise",
    includesTable: false,
    includesAd: "full_page",
    includesDelegates: 0,
    includesStalls: "None",
    benefits: [
      "Venue & Website Branding",
      "Exclusive Branding on Conference Delegate Kits / Bags distributed to all attendees",
      "Full Page Ad in Souvenir",
    ],
  },
  {
    id: "badge_lanyard",
    name: "Badge & Lanyard Sponsor",
    price: 400000,
    formattedPrice: "₹4,00,000",
    tag: "High Brand Exposure",
    includesTable: false,
    includesAd: "half_page",
    includesDelegates: 0,
    includesStalls: "None",
    benefits: [
      "Venue & Website Branding",
      "Exclusive Logo Branding on all Delegate Badges & Lanyards worn by all participants",
      "Half Page Ad in Souvenir",
    ],
  },
  {
    id: "silver",
    name: "Silver Sponsor",
    price: 300000,
    formattedPrice: "₹3,00,000",
    tag: "Tier 3 Partner",
    includesTable: false,
    includesAd: "half_page",
    includesDelegates: 2,
    includesStalls: "None",
    benefits: [
      "2 Complimentary Delegate Registrations",
      "Half Page Ad in Souvenir",
      "Venue & Website Branding",
    ],
  },
  {
    id: "bronze",
    name: "Bronze Sponsor",
    price: 200000,
    formattedPrice: "₹2,00,000",
    tag: "Associate Partner",
    includesTable: false,
    includesAd: "half_page",
    includesDelegates: 1,
    includesStalls: "None",
    benefits: [
      "1 Complimentary Delegate Registration",
      "Half Page Ad in Souvenir",
      "Venue & Website Branding",
    ],
  },
];

export const INDIAN_STATES_COUNTRIES = [
  "Andhra Pradesh, India",
  "Arunachal Pradesh, India",
  "Assam, India",
  "Bihar, India",
  "Chhattisgarh, India",
  "Delhi / NCR, India",
  "Goa, India",
  "Gujarat, India",
  "Haryana, India",
  "Himachal Pradesh, India",
  "Jharkhand, India",
  "Karnataka, India",
  "Kerala, India",
  "Madhya Pradesh, India",
  "Maharashtra, India",
  "Manipur, India",
  "Meghalaya, India",
  "Mizoram, India",
  "Nagaland, India",
  "Odisha, India",
  "Punjab, India",
  "Rajasthan, India",
  "Sikkim, India",
  "Tamil Nadu, India",
  "Telangana, India",
  "Tripura, India",
  "Uttar Pradesh, India",
  "Uttarakhand, India",
  "West Bengal, India",
  "Thailand (Host Country)",
  "Bangladesh",
  "China",
  "Germany",
  "Indonesia",
  "Japan",
  "Malaysia",
  "Netherlands",
  "Philippines",
  "Singapore",
  "Switzerland",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other International Country",
];
