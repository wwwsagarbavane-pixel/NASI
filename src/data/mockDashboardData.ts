export interface DashboardStats {
  registeredDelegates: number;
  participatingCompanies: number;
  confirmedSponsors: number;
  tradingTablesBooked: number;
  tradingTablesTotal: number;
  stallsBooked: number;
  stallsTotal: number;
  premiumStallsAvailable: number;
  sponsorshipRevenueCrores: number;
}

export const INITIAL_DASHBOARD_STATS: DashboardStats = {
  registeredDelegates: 1284,
  participatingCompanies: 428,
  confirmedSponsors: 32,
  tradingTablesBooked: 68,
  tradingTablesTotal: 100,
  stallsBooked: 42,
  stallsTotal: 60,
  premiumStallsAvailable: 7,
  sponsorshipRevenueCrores: 1.84,
};

export const DELEGATE_GROWTH_DATA = [
  { date: '15 Jan', count: 120 },
  { date: '22 Jan', count: 280 },
  { date: '30 Jan', count: 490 },
  { date: '08 Feb', count: 740 },
  { date: '15 Feb', count: 980 },
  { date: '22 Feb', count: 1190 },
  { date: '24 Feb', count: 1284 },
];

export const MEMBERSHIP_SPLIT = {
  memberPercent: 72,
  nonMemberPercent: 28,
  memberCount: 924,
  nonMemberCount: 360,
};

export const SPONSOR_TIER_METRICS = [
  { tier: 'Event Sponsor', price: '₹9.0L', booked: 1, capacity: 1, revenue: 900000 },
  { tier: 'Platinum Sponsor', price: '₹7.0L', booked: 3, capacity: 4, revenue: 2100000 },
  { tier: 'Welcome Dinner', price: '₹6.0L', booked: 1, capacity: 1, revenue: 600000 },
  { tier: 'Gala Dinner', price: '₹6.0L', booked: 1, capacity: 1, revenue: 600000 },
  { tier: 'Gold Sponsor', price: '₹5.0L', booked: 5, capacity: 6, revenue: 2500000 },
  { tier: 'Lunch Sponsor', price: '₹5.0L', booked: 3, capacity: 3, revenue: 1500000 },
  { tier: 'Conference Kit', price: '₹5.0L', booked: 1, capacity: 1, revenue: 500000 },
  { tier: 'Badge & Lanyard', price: '₹4.0L', booked: 1, capacity: 1, revenue: 400000 },
  { tier: 'Silver Sponsor', price: '₹3.0L', booked: 8, capacity: 10, revenue: 2400000 },
  { tier: 'Bronze Sponsor', price: '₹2.0L', booked: 8, capacity: 12, revenue: 1600000 },
];

export const SPONSOR_LOGOS = [
  { name: "Advanta Seeds", tag: "Principal Partner", tier: "Event" },
  { name: "Nuziveedu Seeds", tag: "Platinum Partner", tier: "Platinum" },
  { name: "Mahyco Innovations", tag: "Platinum Partner", tier: "Platinum" },
  { name: "Kaveri Seeds", tag: "Platinum Partner", tier: "Platinum" },
  { name: "Rasi Seeds Pvt Ltd", tag: "Gala Dinner Partner", tier: "Gala Dinner" },
  { name: "Bayer CropScience", tag: "Welcome Dinner Partner", tier: "Welcome Dinner" },
  { name: "Syngenta India", tag: "Gold Partner", tier: "Gold" },
  { name: "Corteva Agriscience", tag: "Gold Partner", tier: "Gold" },
  { name: "UPL OpenAg", tag: "Gold Partner", tier: "Gold" },
  { name: "Godrej Agrovet", tag: "Gold Partner", tier: "Gold" },
  { name: "Bioseed Technologies", tag: "Conference Kit", tier: "Kit" },
  { name: "JK Agri Genetics", tag: "Badge & Lanyard", tier: "Lanyard" },
];

// Generate 100 Trading Table Nodes (68 Booked, 32 Available)
export interface TableNode {
  id: number;
  number: string;
  status: 'booked' | 'available' | 'reserved';
  company?: string;
}

export const GENERATE_TRADING_TABLES = (): TableNode[] => {
  const tables: TableNode[] = [];
  const companies = ["Syngenta", "Advanta", "Mahyco", "Rasi", "Kaveri", "Bayer", "Bioseed", "JK Agri", "Nuziveedu", "Corteva", "UPL", "Shakti Vardhan"];
  
  for (let i = 1; i <= 100; i++) {
    const isBooked = i <= 68;
    const isReserved = i > 68 && i <= 72;
    tables.push({
      id: i,
      number: `T-${i < 10 ? '0' + i : i}`,
      status: isBooked ? 'booked' : isReserved ? 'reserved' : 'available',
      company: isBooked ? companies[(i - 1) % companies.length] : undefined,
    });
  }
  return tables;
};

// Generate 60 Exhibition Stalls
export interface StallNode {
  id: string;
  size: '3x3 Mtr' | '4x3 Mtr';
  type: 'normal' | 'premium';
  status: 'booked' | 'available' | 'reserved';
  company?: string;
}

export const GENERATE_EXHIBITION_STALLS = (): StallNode[] => {
  const stalls: StallNode[] = [];
  const companies = ["Advanta Global", "Mahyco Biotech", "Kaveri Research", "Rasi Seed Tech", "Bayer Agri", "Syngenta Crop", "UPL Technologies", "Nuziveedu Hybrid"];
  
  for (let i = 1; i <= 60; i++) {
    const isPremium = i <= 20;
    const isBooked = i <= 42;
    const isReserved = i > 42 && i <= 46;
    stalls.push({
      id: isPremium ? `P-${i}` : `N-${i - 20}`,
      size: isPremium ? '4x3 Mtr' : '3x3 Mtr',
      type: isPremium ? 'premium' : 'normal',
      status: isBooked ? 'booked' : isReserved ? 'reserved' : 'available',
      company: isBooked ? companies[(i - 1) % companies.length] : undefined,
    });
  }
  return stalls;
};

export const EVENT_PROGRAM_TIMELINE = [
  {
    date: "26 FEB 2026",
    day: "Day 1",
    title: "Executive Leadership & Inauguration",
    items: [
      { time: "14:00 - 18:00", name: "Executive CEO Conclave & Round Table", badge: "Exclusive" },
      { time: "18:30 - 20:00", name: "Inaugural Ceremony & Presidential Keynote", badge: "Plenary" },
      { time: "20:00 Onwards", name: "Welcome Networking Reception & Dinner", badge: "Social" },
    ]
  },
  {
    date: "27 FEB 2026",
    day: "Day 2",
    title: "Global Seed Innovations & Trade Exchange",
    items: [
      { time: "09:00 - 10:30", name: "Plenary Session: Global Seed Policy & Regulatory Frameworks", badge: "Technical" },
      { time: "10:30 - 18:00", name: "Exhibition Hall & B2B Trading Lounge Live", badge: "Trade" },
      { time: "11:00 - 13:30", name: "Biotech & Gene Editing Innovations in Agriculture", badge: "Innovation" },
      { time: "14:30 - 17:00", name: "Seed Treatment, Quality Enhancement & Logistics", badge: "Session" },
      { time: "19:30 Onwards", name: "ISC 2026 Grand Gala Dinner & Cultural Evening", badge: "Gala" },
    ]
  },
  {
    date: "28 FEB 2026",
    day: "Day 3",
    title: "Climate Resilience, Valedictory & Future Roadmap",
    items: [
      { time: "09:30 - 12:00", name: "Climate-Smart Seeds & Food Security in Asia-Pacific", badge: "Strategy" },
      { time: "12:00 - 14:00", name: "Valedictory Ceremony, Awards & Phuket Declaration", badge: "Ceremony" },
      { time: "14:00 - 16:00", name: "Networking Lunch & International Delegation Farewell", badge: "Farewell" },
    ]
  }
];
