import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Award, 
  Table2, 
  Store, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  PieChart, 
  Layers, 
  Printer, 
  Download, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight,
  Sprout,
  BarChart3,
  Globe,
  ArrowRight
} from 'lucide-react';
import { RegistrationPackageData } from '../../types';
import { calculatePricing, formatCurrency } from '../../utils/pricing';
import { 
  INITIAL_DASHBOARD_STATS, 
  DELEGATE_GROWTH_DATA, 
  MEMBERSHIP_SPLIT, 
  SPONSOR_TIER_METRICS, 
  SPONSOR_LOGOS, 
  GENERATE_TRADING_TABLES, 
  GENERATE_EXHIBITION_STALLS, 
  EVENT_PROGRAM_TIMELINE,
  TableNode,
  StallNode
} from '../../data/mockDashboardData';
import { EVENT_DETAILS, SUPPORT_INFO } from '../../data/eventData';

interface EventDashboardProps {
  data: RegistrationPackageData;
  onBackToRegistration: () => void;
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ data, onBackToRegistration }) => {
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [tradingTables] = useState<TableNode[]>(GENERATE_TRADING_TABLES());
  const [stalls] = useState<StallNode[]>(GENERATE_EXHIBITION_STALLS());
  const [hoveredTable, setHoveredTable] = useState<TableNode | null>(null);
  const [hoveredStall, setHoveredStall] = useState<StallNode | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'analytics' | 'floorplans' | 'timeline' | 'my_pass'>('analytics');

  const pricing = calculatePricing(data);

  // Dynamic Countdown to 26 Feb 2026
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 32, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-16 step-enter">
      
      {/* ==================================================== */}
      {/* 1. TOP HERO & COUNTDOWN */}
      {/* ==================================================== */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-emerald-900/40">
        
        {/* Background Visual Composition */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-950/80" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left Hero Content */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                <span>14th Indian Seed Congress 2026</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Duangjitt Resort & Spa, Phuket
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              Seed Innovations — <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Reaching Global
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Welcome to the official event command center for Asia’s foremost seed industry congress. Organized by the <strong>National Seed Association of India (NSAI)</strong>.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-medium">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>26th–28th February 2026</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Phuket, Thailand</span>
              </div>
            </div>
          </div>

          {/* Right Countdown Panel */}
          <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 shadow-xl w-full sm:w-auto flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block mb-3 text-center sm:text-left">
              CONGRESS STARTS IN
            </span>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Days</span>
              </div>
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">
                  {timeLeft.hours < 10 ? '0' + timeLeft.hours : timeLeft.hours}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Hours</span>
              </div>
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white block">
                  {timeLeft.minutes < 10 ? '0' + timeLeft.minutes : timeLeft.minutes}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mins</span>
              </div>
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400 block">
                  {timeLeft.seconds < 10 ? '0' + timeLeft.seconds : timeLeft.seconds}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Secs</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Registration Pass Confirmed
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. REGISTRATION OVERVIEW STATS */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Stat 1: Registered Delegates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delegates</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            {stats.registeredDelegates.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+142 this week</span>
          </div>
        </div>

        {/* Stat 2: Participating Companies */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Companies</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            {stats.participatingCompanies}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Across 18 global countries
          </p>
        </div>

        {/* Stat 3: Confirmed Sponsors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sponsors</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            {stats.confirmedSponsors}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">
            ₹{stats.sponsorshipRevenueCrores} Cr confirmed
          </p>
        </div>

        {/* Stat 4: Trading Tables Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trading Tables</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Table2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              {stats.tradingTablesBooked}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {stats.tradingTablesTotal}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.tradingTablesBooked / stats.tradingTablesTotal) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            32 tables available
          </p>
        </div>

        {/* Stat 5: Exhibition Stalls */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stalls Booked</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
              {stats.stallsBooked}
            </span>
            <span className="text-xs font-bold text-slate-400">/ {stats.stallsTotal}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.stallsBooked / stats.stallsTotal) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">
            18 stalls remaining
          </p>
        </div>

      </div>

      {/* ==================================================== */}
      {/* 3. SECTION TABS */}
      {/* ==================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Event Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('floorplans')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'floorplans'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tables & Exhibition Floor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Congress Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my_pass')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'my_pass'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>My Registration Dossier</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ANALYTICS & SPONSORSHIP */}
      {/* ==================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 step-enter">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Delegate Growth Line / Area Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delegate Registration Velocity</h3>
                  <p className="text-xs text-slate-500">Cumulative delegate enrollments over campaign dates</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  1,284 Registrations
                </span>
              </div>

              {/* Custom SVG Area Chart */}
              <div className="pt-4 h-64 w-full">
                <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="40" y1="30" x2="580" y2="30" stroke="#f1f5f9" strokeDasharray="3" />
                  <line x1="40" y1="80" x2="580" y2="80" stroke="#f1f5f9" strokeDasharray="3" />
                  <line x1="40" y1="130" x2="580" y2="130" stroke="#f1f5f9" strokeDasharray="3" />
                  <line x1="40" y1="170" x2="580" y2="170" stroke="#e2e8f0" />

                  {/* Area Fill */}
                  <polygon
                    points="50,170 50,155 130,135 210,105 300,75 390,45 480,25 560,15 560,170"
                    fill="url(#areaGrad)"
                  />

                  {/* Trend Line */}
                  <polyline
                    points="50,155 130,135 210,105 300,75 390,45 480,25 560,15"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points */}
                  {DELEGATE_GROWTH_DATA.map((item, idx) => {
                    const x = 50 + idx * 85;
                    const y = 170 - (item.count / 1400) * 160;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                        <text x={x} y="190" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">
                          {item.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Donut Chart: Membership Ratio */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-5 flex flex-col justify-between">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Membership Ratio</h3>
                <p className="text-xs text-slate-500">NSAI Members vs Non-Members</p>
              </div>

              {/* Donut Visual */}
              <div className="flex items-center justify-center relative my-2">
                <svg viewBox="0 0 120 120" className="w-40 h-40 transform -rotate-90">
                  {/* NSAI Member Arc: 72% */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="18"
                    strokeDasharray={`${72 * 2.83} ${100 * 2.83}`}
                    strokeLinecap="round"
                  />
                  {/* Non-Member Arc: 28% */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="18"
                    strokeDasharray={`${28 * 2.83} ${100 * 2.83}`}
                    strokeDashoffset={`-${72 * 2.83}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold font-display text-slate-900 block">72%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Members</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-950 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span>NSAI Members</span>
                  </div>
                  <span>924 (72%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-950 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Non-Members</span>
                  </div>
                  <span>360 (28%)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sponsorship Revenue by Tier */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sponsorship Categories & Capacity</h3>
                <p className="text-xs text-slate-500">Live booking status and revenue breakdown across official packages</p>
              </div>
              <div className="text-left sm:text-right bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Confirmed Revenue</span>
                <span className="text-xl font-extrabold font-display text-emerald-900">₹1.84 Crore</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPONSOR_TIER_METRICS.map((item, idx) => {
                const percent = (item.booked / item.capacity) * 100;
                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{item.tier}</span>
                      <span className="font-display font-extrabold text-emerald-800">{item.price}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>{item.booked} of {item.capacity} booked</span>
                      <span>Total: {formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Organic Sponsor Logo Wall */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Industry Leader Partners & Sponsors</h3>
                <p className="text-xs text-slate-500">Prominent agricultural enterprises supporting ISC 2026</p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                32 Global Brands
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {SPONSOR_LOGOS.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all flex flex-col items-center justify-center text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 font-display font-extrabold flex items-center justify-center shadow-xs mb-2 group-hover:scale-105 transition-transform border border-slate-100">
                    {sponsor.name.charAt(0)}
                  </div>
                  <span className="font-bold text-xs text-slate-900 line-clamp-1">{sponsor.name}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{sponsor.tier}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: FLOOR PLANS & AVAILABILITY */}
      {/* ==================================================== */}
      {activeTab === 'floorplans' && (
        <div className="space-y-8 step-enter">
          
          {/* 100-Table Interactive B2B Floor Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-emerald-600" />
                  <span>B2B Trading Lounge Interactive Floor (100 Tables)</span>
                </h3>
                <p className="text-xs text-slate-500">Live seat layout map in the Central Grand Ballroom</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Booked (68)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200" />
                  <span>Available (32)</span>
                </div>
              </div>
            </div>

            {/* Visual 10x10 Grid */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
              <div className="grid grid-cols-10 gap-2 min-w-[500px]">
                {tradingTables.map((table) => {
                  const isBooked = table.status === 'booked';
                  return (
                    <div
                      key={table.id}
                      onMouseEnter={() => setHoveredTable(table)}
                      onMouseLeave={() => setHoveredTable(null)}
                      className={`p-2 rounded-xl text-center transition-all cursor-pointer relative ${
                        isBooked
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="text-[10px] block">{table.number}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hover Tooltip Details */}
            <div className="p-3 rounded-xl bg-slate-100/80 text-xs text-slate-600 flex items-center justify-between">
              <span>
                {hoveredTable ? (
                  <strong>
                    Table {hoveredTable.number}: {hoveredTable.status.toUpperCase()}{' '}
                    {hoveredTable.company && `• Assigned to ${hoveredTable.company}`}
                  </strong>
                ) : (
                  'Hover over any table node above to view real-time reservation status'
                )}
              </span>
              <span className="font-bold text-emerald-800">Tariff: ₹30,000 / Table</span>
            </div>
          </div>

          {/* 60-Stall Exhibition Floor Map */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-600" />
                  <span>Exhibition Arena Matrix (60 Stalls)</span>
                </h3>
                <p className="text-xs text-slate-500">Normal Stalls (3×3 Mtr) & Premium Stalls (4×3 Mtr)</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-500" />
                  <span>Premium (4×3)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-600" />
                  <span>Normal (3×3)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-200" />
                  <span>Available</span>
                </div>
              </div>
            </div>

            {/* Stall Blocks Grid */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5 min-w-[550px]">
                {stalls.map((stall) => {
                  const isBooked = stall.status === 'booked';
                  const isPremium = stall.type === 'premium';

                  return (
                    <div
                      key={stall.id}
                      onMouseEnter={() => setHoveredStall(stall)}
                      onMouseLeave={() => setHoveredStall(null)}
                      className={`p-3 rounded-xl text-center transition-all cursor-pointer ${
                        isBooked
                          ? isPremium
                            ? 'bg-amber-500 text-white font-bold'
                            : 'bg-emerald-700 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold block">{stall.id}</span>
                      <span className="text-[9px] opacity-80 block">{stall.size}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tooltip Details */}
            <div className="p-3 rounded-xl bg-slate-100/80 text-xs text-slate-600 flex items-center justify-between">
              <span>
                {hoveredStall ? (
                  <strong>
                    Stall {hoveredStall.id} ({hoveredStall.size}): {hoveredStall.status.toUpperCase()}{' '}
                    {hoveredStall.company && `• ${hoveredStall.company}`}
                  </strong>
                ) : (
                  'Hover over any booth block to view size and allocation details'
                )}
              </span>
              <span className="font-bold text-slate-800">Includes 1 Complimentary Delegate</span>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: PROGRAM TIMELINE & SCHEDULE */}
      {/* ==================================================== */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6 step-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Official ISC 2026 Congress Programme</h3>
              <p className="text-xs text-slate-500">26th to 28th February 2026 • Duangjitt Resort & Spa, Phuket</p>
            </div>

            {/* Day Switcher */}
            <div className="flex items-center gap-2">
              {EVENT_PROGRAM_TIMELINE.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDay(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDay === idx
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.day} ({item.date.split(' ')[0]} {item.date.split(' ')[1]})
                </button>
              ))}
            </div>
          </div>

          {/* Selected Day Schedule */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {EVENT_PROGRAM_TIMELINE[selectedDay].date} • {EVENT_PROGRAM_TIMELINE[selectedDay].day}
              </span>
              <h4 className="text-base font-bold text-emerald-950 mt-0.5">
                {EVENT_PROGRAM_TIMELINE[selectedDay].title}
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {EVENT_PROGRAM_TIMELINE[selectedDay].items.map((session, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-24 text-xs font-mono font-bold text-slate-500 flex-shrink-0">
                      {session.time}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{session.name}</h5>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    {session.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: MY REGISTRATION DOSSIER & ACTIONS */}
      {/* ==================================================== */}
      {activeTab === 'my_pass' && (
        <div className="space-y-6 step-enter">
          
          {/* Confirmed Pass Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold uppercase tracking-wider">
                    Official Conference Pass
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                    14th Indian Seed Congress 2026
                  </h3>
                  <p className="text-xs text-slate-300">26–28 February 2026 • Phuket, Thailand</p>
                </div>
                <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-xs border border-white/10 text-left sm:text-right">
                  <span className="text-[10px] text-slate-300 uppercase block font-semibold">Registration ID</span>
                  <span className="text-xl font-mono font-extrabold text-amber-300">{data.registrationId}</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase block text-[10px]">Registered Delegate</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{data.delegate.name || 'Delegate'}</span>
                  <span className="text-slate-500 text-[11px] block truncate">{data.delegate.organization}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase block text-[10px]">Membership Status</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {data.delegate.membershipType === 'member' ? 'NSAI Member' : 'Non-Member'}
                  </span>
                  <span className="text-slate-500 text-[11px] block">{data.delegate.nsaiMembershipNo || 'Standard Pass'}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase block text-[10px]">Grand Total Fee</span>
                  <span className="font-display font-extrabold text-emerald-800 text-base mt-0.5 block">
                    {formatCurrency(pricing.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">Package Inclusions</span>
                  <p className="text-sm font-semibold text-slate-900">
                    1 Delegate Pass {data.spouse.enabled && `• 1 Spouse (${data.spouse.name})`} {data.stay.enabled && `• ${data.stay.nights} Nights Room Stay`} {data.tradingTable.enabled && `• ${data.tradingTable.quantity} Trading Tables`}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CONFIRMED</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToRegistration}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Edit Registration Package</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* 5. "FROM INDIAN FIELDS TO GLOBAL INNOVATION" FEATURE */}
      {/* ==================================================== */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-card">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-slate-950/90 to-amber-950/80" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-4 max-w-3xl">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            THEME SPOTLIGHT
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            From Indian Fields to Global Innovation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Indian Seed Congress 2026 brings together seed scientists, industry captains, and international policymakers in Phuket to accelerate climate-resilient hybrid seeds, biotechnology, and cross-border trade networks.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-emerald-300">
            <span>✓ 400+ Enterprise Exhibitors</span>
            <span>•</span>
            <span>✓ 100+ B2B Trading Desks</span>
            <span>•</span>
            <span>✓ Global Seed Trade Network</span>
          </div>
        </div>
      </div>

    </div>
  );
};
