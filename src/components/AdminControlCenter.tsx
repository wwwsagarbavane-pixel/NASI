import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  BedDouble, 
  Table2, 
  Store, 
  Award, 
  BookOpen, 
  CreditCard, 
  CheckSquare, 
  Settings, 
  ShieldAlert, 
  Search, 
  Download, 
  Plus, 
  XCircle,
  Check,
  Calendar,
  LogOut,
  Sparkles,
  UserCheck,
  Layers,
  Copy,
  Trash2,
  AlertTriangle,
  Grid
} from 'lucide-react';
import { 
  RegistrationPackageData, 
  DynamicRates, 
  EventSettings, 
  RegistrationSettings, 
  AuditLogEntry, 
  AdminUser, 
  ExhibitionStallAdmin, 
  TradingTableAdmin,
  RegCategory,
  SpousePackage,
  HotelRoomAdmin,
  SponsorshipPackageAdmin,
  AdvertisementPackageAdmin,
  MembershipTypeAdmin,
  FormSectionConfig,
  TableTypeAdmin,
  StallTypeAdmin
} from '../types';
import { calculatePricing, formatCurrency } from '../utils/pricing';

interface AdminControlCenterProps {
  registeredUsers: RegistrationPackageData[];
  onUpdateUsers: (users: RegistrationPackageData[]) => void;
  dynamicRates: DynamicRates;
  onUpdateRates: (rates: DynamicRates) => void;
  eventSettings: EventSettings;
  onUpdateEventSettings: (settings: EventSettings) => void;
  regSettings: RegistrationSettings;
  onUpdateRegSettings: (settings: RegistrationSettings) => void;
  categories: RegCategory[];
  onUpdateCategories: (categories: RegCategory[]) => void;
  spousePackages: SpousePackage[];
  onUpdateSpousePackages: (packages: SpousePackage[]) => void;
  hotelRooms: HotelRoomAdmin[];
  onUpdateHotelRooms: (rooms: HotelRoomAdmin[]) => void;
  sponsorshipPackages: SponsorshipPackageAdmin[];
  onUpdateSponsorshipPackages: (packages: SponsorshipPackageAdmin[]) => void;
  advertisementPackages: AdvertisementPackageAdmin[];
  onUpdateAdvertisementPackages: (packages: AdvertisementPackageAdmin[]) => void;
  membershipTypes: MembershipTypeAdmin[];
  onUpdateMembershipTypes: (types: MembershipTypeAdmin[]) => void;
  formConfigs: FormSectionConfig[];
  onUpdateFormConfigs: (configs: FormSectionConfig[]) => void;
  
  // Connected database states passed from parent
  tables: TradingTableAdmin[];
  onUpdateTables: (tables: TradingTableAdmin[]) => void;
  tableTypes: TableTypeAdmin[];
  onUpdateTableTypes: (types: TableTypeAdmin[]) => void;
  stalls: ExhibitionStallAdmin[];
  onUpdateStalls: (stalls: ExhibitionStallAdmin[]) => void;
  stallTypes: StallTypeAdmin[];
  onUpdateStallTypes: (types: StallTypeAdmin[]) => void;
  sponsorBenefits: string[];
  onUpdateSponsorBenefits: (benefits: string[]) => void;
  
  onCloseAdmin: () => void;
}

type AdminTab = 
  | 'overview' 
  | 'registrations' 
  | 'members' 
  | 'approvals' 
  | 'payments' 
  | 'regSetup'
  | 'spouseStay'
  | 'tables' 
  | 'stalls' 
  | 'sponsorships' 
  | 'advertisements' 
  | 'allocation'
  | 'reports' 
  | 'settings' 
  | 'users' 
  | 'logs';

const ADMIN_USERS: AdminUser[] = [
  { id: '1', username: 'superadmin', role: 'super_admin', email: 'admin@nsai.co.in' },
  { id: '2', username: 'finance_head', role: 'finance_manager', email: 'finance@nsai.co.in' },
  { id: '3', username: 'event_manager', role: 'event_manager', email: 'events@nsai.co.in' },
];

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  registeredUsers,
  onUpdateUsers,
  dynamicRates,
  onUpdateRates,
  eventSettings,
  onUpdateEventSettings,
  regSettings,
  onUpdateRegSettings,
  categories,
  onUpdateCategories,
  spousePackages,
  onUpdateSpousePackages,
  hotelRooms,
  onUpdateHotelRooms,
  sponsorshipPackages,
  onUpdateSponsorshipPackages,
  advertisementPackages,
  onUpdateAdvertisementPackages,
  membershipTypes,
  onUpdateMembershipTypes,
  formConfigs,
  onUpdateFormConfigs,
  tables,
  onUpdateTables,
  tableTypes,
  onUpdateTableTypes,
  stalls,
  onUpdateStalls,
  stallTypes,
  onUpdateStallTypes,
  sponsorBenefits,
  onUpdateSponsorBenefits,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [activeAdmin, setActiveAdmin] = useState<AdminUser>(ADMIN_USERS[0]); 

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const stored = localStorage.getItem('isc_audit_logs');
    return stored ? JSON.parse(stored) : [];
  });

  const saveAuditLog = (action: string, target: string, oldVal: string, newVal: string) => {
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      adminName: activeAdmin.username,
      action,
      target,
      oldValue: oldVal,
      newValue: newVal
    };
    const newLogs = [log, ...auditLogs];
    setAuditLogs(newLogs);
    localStorage.setItem('isc_audit_logs', JSON.stringify(newLogs));
  };

  // State controllers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<RegistrationPackageData | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Payment details mismatch / transaction not found');
  const [rejectingUser, setRejectingUser] = useState<RegistrationPackageData | null>(null);

  // Pagination & Filtering state
  const [regFilterStatus, setRegFilterStatus] = useState<'all' | 'approved' | 'under_review' | 'changes_required'>('all');
  const [regPage, setRegPage] = useState(1);
  const itemsPerPage = 8;

  // Forms states for creation modals
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RegCategory | null>(null);
  const [catName, setCatName] = useState('');
  const [catPrice, setCatPrice] = useState(25000);
  const [catTax, setCatTax] = useState(18);
  const [catMax, setCatMax] = useState(500);
  const [catDesc, setCatDesc] = useState('');

  const [showSpouseModal, setShowSpouseModal] = useState(false);
  const [editingSpousePkg, setEditingSpousePkg] = useState<SpousePackage | null>(null);
  const [spouseNameInput, setSpouseNameInput] = useState('Spouse / Accompanying Person');
  const [spousePriceInput, setSpousePriceInput] = useState(20000);
  const [spouseMaxInput, setSpouseMaxInput] = useState(5);
  const [spouseBenefitsList, setSpouseBenefitsList] = useState('Conference Access, Lunch, Dinner');

  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotelRoom, setEditingHotelRoom] = useState<HotelRoomAdmin | null>(null);
  const [hotelNameInput, setHotelNameInput] = useState('');
  const [roomTypeInput, setRoomTypeInput] = useState('Deluxe Room');
  const [roomPriceInput, setRoomPriceInput] = useState(12000);
  const [roomTaxInput, setRoomTaxInput] = useState(18);
  const [roomMaxRoomsInput, setRoomMaxRoomsInput] = useState(50);
  const [roomOccupancyInput, setRoomOccupancyInput] = useState(2);
  const [roomAmenitiesInput, setRoomAmenitiesInput] = useState('WiFi, Breakfast, Swimming Pool');

  // Stalls and Tables creation states
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState<TradingTableAdmin | null>(null);
  const [tableNoInput, setTableNoInput] = useState('');
  const [tableZoneInput, setTableZoneInput] = useState('Hall A');
  const [tableLocationInput, setTableLocationInput] = useState('North Wing');
  const [tableTypeInput, setTableTypeInput] = useState<'standard' | 'premium' | 'vip'>('standard');
  const [tablePriceInput, setTablePriceInput] = useState(30000);
  const [tableBenefitsInput, setTableBenefitsInput] = useState('2 Chairs, 1 Power Socket, WiFi');

  const [showStallModal, setShowStallModal] = useState(false);
  const [editingStall, setEditingStall] = useState<ExhibitionStallAdmin | null>(null);
  const [stallNoInput, setStallNoInput] = useState('');
  const [stallZoneInput, setStallZoneInput] = useState('Hall A');
  const [stallTypeInput, setStallTypeInput] = useState<'normal' | 'premium'>('normal');
  const [stallSizeInput, setStallSizeInput] = useState('3 × 3 Meter');
  const [stallPriceInput, setStallPriceInput] = useState(120000);

  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [editingSponsorship, setEditingSponsorship] = useState<SponsorshipPackageAdmin | null>(null);
  const [sponsorNameInput, setSponsorNameInput] = useState('');
  const [sponsorShortInput, setSponsorShortInput] = useState('');
  const [sponsorPriceInput, setSponsorPriceInput] = useState(500000);
  const [sponsorTaxInput, setSponsorTaxInput] = useState(18);
  const [sponsorSlotsInput, setSponsorSlotsInput] = useState(5);
  const [sponsorDelegatesCount, setSponsorDelegatesCount] = useState(2);
  const [sponsorStallsCount, setSponsorStallsCount] = useState(1);
  const [sponsorTablesCount, setSponsorTablesCount] = useState(1);
  const [sponsorAdsCount, setSponsorAdsCount] = useState(1);
  const [sponsorBenefitsSelected, setSponsorBenefitsSelected] = useState<string[]>([]);
  const [customBenefitInput, setCustomBenefitInput] = useState('');

  const [showAdModal, setShowAdModal] = useState(false);
  const [editingAdPackage, setEditingAdPackage] = useState<AdvertisementPackageAdmin | null>(null);
  const [adNameInput, setAdNameInput] = useState('');
  const [adSizeInput, setAdSizeInput] = useState('A4 Full Page');
  const [adPriceInput, setAdPriceInput] = useState(30000);
  const [adTaxInput, setAdTaxInput] = useState(18);
  const [adPlacementInput, setAdPlacementInput] = useState<'front_cover' | 'back_cover' | 'inside_front' | 'inside_back' | 'regular_full' | 'regular_half'>('regular_full');
  const [adColorInput, setAdColorInput] = useState<'color' | 'bw'>('color');
  const [adMaxBookingsInput, setAdMaxBookingsInput] = useState(20);

  // Bulk Generator inputs
  const [bulkPrefix, setBulkPrefix] = useState('T');
  const [bulkStart, setBulkStart] = useState(1);
  const [bulkEnd, setBulkEnd] = useState(10);
  const [bulkZone, setBulkZone] = useState('Hall A');
  const [bulkPrice, setBulkPrice] = useState(30000);

  const [bulkStallPrefix, setBulkStallPrefix] = useState('A');
  const [bulkStallStart, setBulkStallStart] = useState(1);
  const [bulkStallEnd, setBulkStallEnd] = useState(20);
  const [bulkStallZone, setBulkStallZone] = useState('Zone A');
  const [bulkStallPrice, setBulkStallPrice] = useState(120000);

  // Allocation desk state
  const [allocationSearch, setAllocationSearch] = useState('');
  const [allocatedStallNo, setAllocatedStallNo] = useState('');
  const [allocatedTableNo, setAllocatedTableNo] = useState('');
  const [allocatedRoomNo, setAllocatedRoomNo] = useState('');

  // Role permissions
  const canModifySettings = activeAdmin.role === 'super_admin' || activeAdmin.role === 'content_manager';
  const canVerifyPayments = activeAdmin.role === 'super_admin' || activeAdmin.role === 'finance_manager';
  const canAllocateResources = activeAdmin.role === 'super_admin' || activeAdmin.role === 'event_manager';

  // Overall calculations
  const totalRegistrations = registeredUsers.length;
  const pendingApprovalsCount = registeredUsers.filter(u => u.status === 'under_review').length;
  const approvedCount = registeredUsers.filter(u => u.status === 'approved').length;
  const rejectedCount = registeredUsers.filter(u => u.status === 'changes_required').length;
  const paymentPendingCount = registeredUsers.filter(u => !u.payment || (!u.payment.transactionRef && !u.payment.ddChequeNumber)).length;
  const paymentVerifiedCount = registeredUsers.filter(u => u.status === 'approved').length;

  const totalRevenueExpected = registeredUsers.reduce((sum, u) => sum + calculatePricing(u, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages).grandTotal, 0);
  const totalRevenueReceived = registeredUsers
    .filter(u => u.status === 'approved' || (u.payment && u.payment.transactionRef))
    .reduce((sum, u) => sum + calculatePricing(u, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages).grandTotal, 0);

  // CRUD Gating handlers

  // 1. Categories
  const handleCreateCategory = () => {
    if (!catName.trim()) return;
    const finalPrice = Math.round(catPrice * (1 + catTax / 100));
    
    if (editingCategory) {
      // Update
      const list = categories.map(c => c.id === editingCategory.id ? {
        ...c,
        name: catName,
        price: catPrice,
        tax: catTax,
        finalPrice,
        maxRegistrations: catMax,
        description: catDesc
      } : c);
      onUpdateCategories(list);
      saveAuditLog('Category Updated', catName, JSON.stringify(editingCategory), `${catPrice} INR`);
    } else {
      // Create
      const newCat: RegCategory = {
        id: `cat-${Date.now()}`,
        name: catName,
        price: catPrice,
        tax: catTax,
        finalPrice,
        maxRegistrations: catMax,
        booked: 0,
        availableFrom: '2026-10-01',
        availableUntil: '2027-02-15',
        status: 'active',
        description: catDesc
      };
      onUpdateCategories([...categories, newCat]);
      saveAuditLog('Category Created', newCat.name, 'None', `${newCat.price} INR`);
    }

    setShowCategoryModal(false);
    setEditingCategory(null);
    setCatName('');
  };

  const handleDuplicateCategory = (cat: RegCategory) => {
    const duplicated: RegCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      name: `${cat.name} (Copy)`
    };
    onUpdateCategories([...categories, duplicated]);
    saveAuditLog('Category Duplicated', duplicated.name, cat.name, 'Duplicated');
  };

  const handleDeleteCategory = (id: string) => {
    const filtered = categories.filter(c => c.id !== id);
    onUpdateCategories(filtered);
    saveAuditLog('Category Deleted', id, 'Exist', 'Deleted');
  };

  const handleDeactivateCategory = (id: string) => {
    const list = categories.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' as const : 'active' as const } : c);
    onUpdateCategories(list);
    const cat = categories.find(c => c.id === id);
    saveAuditLog('Category Status Toggled', cat?.name || id, cat?.status || '', cat?.status === 'active' ? 'inactive' : 'active');
  };

  // 2. Spouse Options
  const handleCreateSpousePackage = () => {
    if (editingSpousePkg) {
      const list = spousePackages.map(pkg => pkg.id === editingSpousePkg.id ? {
        ...pkg,
        name: spouseNameInput,
        price: spousePriceInput,
        maxPersons: spouseMaxInput,
        includedBenefits: spouseBenefitsList.split(',').map(b => b.trim())
      } : pkg);
      onUpdateSpousePackages(list);
      saveAuditLog('Spouse Option Updated', spouseNameInput, JSON.stringify(editingSpousePkg), `${spousePriceInput} INR`);
    } else {
      const newPkg: SpousePackage = {
        id: `spouse-${Date.now()}`,
        name: spouseNameInput,
        price: spousePriceInput,
        includedBenefits: spouseBenefitsList.split(',').map(b => b.trim()),
        maxPersons: spouseMaxInput,
        status: 'active'
      };
      onUpdateSpousePackages([...spousePackages, newPkg]);
      saveAuditLog('Spouse Package Created', newPkg.name, 'None', formatCurrency(newPkg.price));
    }
    setShowSpouseModal(false);
    setEditingSpousePkg(null);
  };

  // 3. Hotel Stay Room Type
  const handleCreateHotelRoom = () => {
    if (!hotelNameInput.trim()) return;
    const totalPerNight = Math.round(roomPriceInput * (1 + roomTaxInput / 100));
    
    if (editingHotelRoom) {
      const list = hotelRooms.map(r => r.id === editingHotelRoom.id ? {
        ...r,
        hotelName: hotelNameInput,
        roomType: roomTypeInput,
        occupancy: roomOccupancyInput,
        pricePerNight: roomPriceInput,
        tax: roomTaxInput,
        totalPerNight,
        availableRooms: roomMaxRoomsInput,
        amenities: roomAmenitiesInput.split(',').map(a => a.trim())
      } : r);
      onUpdateHotelRooms(list);
      saveAuditLog('Hotel Stay Room Updated', hotelNameInput, JSON.stringify(editingHotelRoom), `${roomPriceInput} INR`);
    } else {
      const newRoom: HotelRoomAdmin = {
        id: `room-${Date.now()}`,
        hotelName: hotelNameInput,
        roomType: roomTypeInput,
        occupancy: roomOccupancyInput,
        pricePerNight: roomPriceInput,
        tax: roomTaxInput,
        totalPerNight,
        availableRooms: roomMaxRoomsInput,
        booked: 0,
        maxNights: 5,
        status: 'available',
        amenities: roomAmenitiesInput.split(',').map(a => a.trim())
      };
      onUpdateHotelRooms([...hotelRooms, newRoom]);
      saveAuditLog('Hotel Room Created', `${newRoom.hotelName} (${newRoom.roomType})`, 'None', formatCurrency(newRoom.pricePerNight));
    }
    setShowHotelModal(false);
    setEditingHotelRoom(null);
    setHotelNameInput('');
  };

  // 4. Trading Tables CRUD & Bulk Generator
  const handleCreateTradingTable = () => {
    if (!tableNoInput.trim()) return;
    
    if (editingTable) {
      const list = tables.map(t => t.tableNumber === editingTable.tableNumber ? {
        ...t,
        tableNumber: tableNoInput.toUpperCase(),
        location: tableLocationInput,
        price: tablePriceInput,
        status: 'available' as const
      } : t);
      onUpdateTables(list);
      saveAuditLog('Table Updated', tableNoInput, JSON.stringify(editingTable), 'available');
    } else {
      const newT: TradingTableAdmin = {
        tableNumber: tableNoInput.toUpperCase(),
        location: tableLocationInput,
        price: tablePriceInput || 30000,
        status: 'available' as const
      };
      onUpdateTables([...tables, newT]);
      saveAuditLog('Single Table Created', newT.tableNumber, 'None', 'Available');
    }
    setShowTableModal(false);
    setEditingTable(null);
    setTableNoInput('');
  };

  const handleBulkCreateTables = () => {
    const generated: TradingTableAdmin[] = [];
    for (let i = bulkStart; i <= bulkEnd; i++) {
      const tableNo = `${bulkPrefix}${i < 10 ? '0' + i : i}`;
      if (!tables.some(t => t.tableNumber === tableNo)) {
        generated.push({
          tableNumber: tableNo,
          location: bulkZone,
          price: bulkPrice || 30000,
          status: 'available'
        });
      }
    }
    const newList = [...tables, ...generated];
    onUpdateTables(newList);
    saveAuditLog('Tables Bulk Generated', `${bulkPrefix}${bulkStart}..${bulkPrefix}${bulkEnd}`, 'None', `${generated.length} Tables Created`);
    alert(`${generated.length} trading tables generated successfully in ${bulkZone}.`);
  };

  const handleBlockTable = (tableNo: string) => {
    const list = tables.map(t => t.tableNumber === tableNo ? { ...t, status: 'blocked' as const } : t);
    onUpdateTables(list);
    saveAuditLog('Table Blocked', tableNo, 'available', 'blocked');
  };

  const handleReleaseTable = (tableNo: string) => {
    const list = tables.map(t => t.tableNumber === tableNo ? { ...t, companyName: undefined, registrationId: undefined, status: 'available' as const } : t);
    onUpdateTables(list);
    saveAuditLog('Table Released', tableNo, 'occupied', 'available');
  };

  // 5. Exhibition Stalls CRUD & Bulk Generator
  const handleCreateStall = () => {
    if (!stallNoInput.trim()) return;
    
    if (editingStall) {
      const list = stalls.map(s => s.stallNumber === editingStall.stallNumber ? {
        ...s,
        stallNumber: stallNoInput.toUpperCase(),
        stallType: stallTypeInput,
        size: stallSizeInput,
        price: stallPriceInput
      } : s);
      onUpdateStalls(list);
      saveAuditLog('Stall Updated', stallNoInput, JSON.stringify(editingStall), 'Stall Updated');
    } else {
      const newS: ExhibitionStallAdmin = {
        stallNumber: stallNoInput.toUpperCase(),
        stallType: stallTypeInput,
        size: stallSizeInput,
        price: stallPriceInput,
        status: 'available'
      };
      onUpdateStalls([...stalls, newS]);
      saveAuditLog('Single Stall Created', newS.stallNumber, 'None', 'Available');
    }
    setShowStallModal(false);
    setEditingStall(null);
    setStallNoInput('');
  };

  const handleBulkCreateStalls = () => {
    const generated: ExhibitionStallAdmin[] = [];
    for (let i = bulkStallStart; i <= bulkStallEnd; i++) {
      const stallNo = `${bulkStallPrefix}${i < 10 ? '0' + i : i}`;
      if (!stalls.some(s => s.stallNumber === stallNo)) {
        generated.push({
          stallNumber: stallNo,
          stallType: 'normal',
          size: '3 × 3 M',
          price: bulkStallPrice,
          status: 'available'
        });
      }
    }
    const newList = [...stalls, ...generated];
    onUpdateStalls(newList);
    saveAuditLog('Stalls Bulk Generated', `${bulkStallPrefix}${bulkStallStart}..${bulkStallPrefix}${bulkStallEnd}`, 'None', `${generated.length} Stalls Created`);
    alert(`${generated.length} exhibition modular stalls generated successfully in ${bulkStallZone}.`);
  };

  const handleBlockStall = (stallNo: string) => {
    const list = stalls.map(s => s.stallNumber === stallNo ? { ...s, status: 'blocked' as const } : s);
    onUpdateStalls(list);
    saveAuditLog('Stall Blocked', stallNo, 'available', 'blocked');
  };

  const handleReleaseStall = (stallNo: string) => {
    const list = stalls.map(s => s.stallNumber === stallNo ? { ...s, companyName: undefined, registrationId: undefined, status: 'available' as const } : s);
    onUpdateStalls(list);
    saveAuditLog('Stall Released', stallNo, 'occupied', 'available');
  };

  // 6. Sponsorship packages Builder CRUD
  const handleCreateSponsorship = () => {
    if (!sponsorNameInput.trim()) return;
    const finalPrice = Math.round(sponsorPriceInput * (1 + sponsorTaxInput / 100));
    
    if (editingSponsorship) {
      const list = sponsorshipPackages.map(s => s.id === editingSponsorship.id ? {
        ...s,
        name: sponsorNameInput,
        shortName: sponsorShortInput.toUpperCase(),
        price: sponsorPriceInput,
        tax: sponsorTaxInput,
        finalPrice,
        slotsLimit: sponsorSlotsInput,
        includedDelegates: sponsorDelegatesCount,
        includedStalls: sponsorStallsCount,
        includedTables: sponsorTablesCount,
        includedAds: sponsorAdsCount,
        benefits: sponsorBenefitsSelected
      } : s);
      onUpdateSponsorshipPackages(list);
      saveAuditLog('Sponsorship Package Updated', sponsorNameInput, JSON.stringify(editingSponsorship), `${sponsorPriceInput} INR`);
    } else {
      const newSponsor: SponsorshipPackageAdmin = {
        id: sponsorShortInput.toLowerCase() || `sponsor-${Date.now()}`,
        name: sponsorNameInput,
        shortName: sponsorShortInput.toUpperCase() || 'SPONSOR',
        price: sponsorPriceInput,
        tax: sponsorTaxInput,
        discount: 0,
        finalPrice,
        slotsLimit: sponsorSlotsInput,
        bookedSlots: 0,
        maxPerCompany: 1,
        status: 'available',
        benefits: sponsorBenefitsSelected,
        includedDelegates: sponsorDelegatesCount,
        includedTables: sponsorTablesCount,
        includedStalls: sponsorStallsCount,
        includedAds: sponsorAdsCount
      };
      onUpdateSponsorshipPackages([...sponsorshipPackages, newSponsor]);
      saveAuditLog('Sponsorship Package Created', newSponsor.name, 'None', formatCurrency(newSponsor.price));
    }
    setShowSponsorModal(false);
    setEditingSponsorship(null);
    setSponsorNameInput('');
  };

  const handleAddCustomBenefit = () => {
    if (!customBenefitInput.trim()) return;
    if (!sponsorBenefits.includes(customBenefitInput)) {
      const newList = [...sponsorBenefits, customBenefitInput];
      onUpdateSponsorBenefits(newList);
      setSponsorBenefitsSelected([...sponsorBenefitsSelected, customBenefitInput]);
      saveAuditLog('Custom Sponsor Benefit Created', customBenefitInput, 'None', 'Created');
    }
    setCustomBenefitInput('');
  };

  const handleToggleSponsorBenefit = (benefit: string) => {
    if (sponsorBenefitsSelected.includes(benefit)) {
      setSponsorBenefitsSelected(sponsorBenefitsSelected.filter(b => b !== benefit));
    } else {
      setSponsorBenefitsSelected([...sponsorBenefitsSelected, benefit]);
    }
  };

  // 7. Advertisements Souvenir CRUD
  const handleCreateAdvertisement = () => {
    if (!adNameInput.trim()) return;
    
    if (editingAdPackage) {
      const list = advertisementPackages.map(ad => ad.id === editingAdPackage.id ? {
        ...ad,
        name: adNameInput,
        size: adSizeInput,
        price: adPriceInput,
        tax: adTaxInput,
        placement: adPlacementInput,
        color: adColorInput,
        maxBookings: adMaxBookingsInput
      } : ad);
      onUpdateAdvertisementPackages(list);
      saveAuditLog('Ad Package Updated', adNameInput, JSON.stringify(editingAdPackage), `${adPriceInput} INR`);
    } else {
      const newAd: AdvertisementPackageAdmin = {
        id: `ad-${Date.now()}`,
        name: adNameInput,
        size: adSizeInput,
        price: adPriceInput,
        tax: adTaxInput,
        placement: adPlacementInput,
        color: adColorInput,
        maxBookings: adMaxBookingsInput,
        booked: 0,
        status: 'active'
      };
      onUpdateAdvertisementPackages([...advertisementPackages, newAd]);
      saveAuditLog('Advertisement Package Created', newAd.name, 'None', formatCurrency(newAd.price));
    }
    setShowAdModal(false);
    setEditingAdPackage(null);
    setAdNameInput('');
  };

  // 8. Approvals & Registrations Actions
  const handleApproveRegistration = (reg: RegistrationPackageData) => {
    const updated = registeredUsers.map(u => {
      if (u.applicationId === reg.applicationId || u.registrationId === reg.registrationId) {
        return {
          ...u,
          status: 'approved' as const,
          registrationId: u.registrationId || `ISC27-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    saveAuditLog('Registration Approved', reg.delegate.name, 'under_review', 'approved');
    alert(`Registration for ${reg.delegate.name} approved. Digital Ticket is now downloadable.`);
    if (selectedUser?.applicationId === reg.applicationId) {
      setSelectedUser({ ...reg, status: 'approved' });
    }
  };

  const handleRejectRegistration = (reg: RegistrationPackageData) => {
    const updated = registeredUsers.map(u => {
      if (u.applicationId === reg.applicationId || u.registrationId === reg.registrationId) {
        return {
          ...u,
          status: 'changes_required' as const
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    saveAuditLog('Registration Action Needed / Rejected', `${reg.delegate.name} (Reason: ${rejectionReason})`, 'under_review', 'changes_required');
    alert(`Registration marked as Action Required.`);
    setRejectingUser(null);
    if (selectedUser?.applicationId === reg.applicationId) {
      setSelectedUser({ ...reg, status: 'changes_required' });
    }
  };

  // 9. Manual Resource Allocation Desk
  const handleManualAllocation = (regId: string) => {
    const user = registeredUsers.find(u => u.registrationId === regId || u.applicationId === regId);
    if (!user) {
      alert('Valid registration ID not found.');
      return;
    }

    // Allocate Stall
    if (allocatedStallNo) {
      const stall = stalls.find(s => s.stallNumber === allocatedStallNo);
      if (stall && stall.status !== 'available') {
        alert(`Stall ${allocatedStallNo} is already occupied or blocked.`);
        return;
      }
      const updatedStalls = stalls.map(s => s.stallNumber === allocatedStallNo ? { ...s, companyName: user.delegate.organization, registrationId: user.registrationId, status: 'booked' as const } : s);
      onUpdateStalls(updatedStalls);
      saveAuditLog('Stall Manually Allocated', `${allocatedStallNo} to ${user.delegate.organization}`, 'available', 'booked');
    }

    // Allocate Table
    if (allocatedTableNo) {
      const table = tables.find(t => t.tableNumber === allocatedTableNo);
      if (table && table.status !== 'available') {
        alert(`Table ${allocatedTableNo} is already occupied.`);
        return;
      }
      const updatedTables = tables.map(t => t.tableNumber === allocatedTableNo ? { ...t, companyName: user.delegate.organization, registrationId: user.registrationId, status: 'allocated' as const } : t);
      onUpdateTables(updatedTables);
      saveAuditLog('Table Manually Allocated', `${allocatedTableNo} to ${user.delegate.organization}`, 'available', 'allocated');
    }

    // Allocate Hotel Room
    if (allocatedRoomNo) {
      const room = hotelRooms.find(r => r.id === allocatedRoomNo);
      if (room && room.status === 'sold_out') {
        alert(`Room category is sold out.`);
        return;
      }
      const updatedRooms = hotelRooms.map(r => r.id === allocatedRoomNo ? { ...r, booked: r.booked + 1 } : r);
      onUpdateHotelRooms(updatedRooms);
      saveAuditLog('Hotel Stay Category Allocated', `${allocatedRoomNo} to ${user.delegate.name}`, 'available', 'booked');
    }

    alert('Allocation completed successfully.');
    setAllocatedStallNo('');
    setAllocatedTableNo('');
    setAllocatedRoomNo('');
  };

  // Reports CSV Export
  const handleExportCSV = (reportType: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (reportType === 'registrations') {
      csvContent += 'Registration ID,Name,Company,Email,Mobile,Membership,Amount,Status\n';
      registeredUsers.forEach(u => {
        csvContent += `"${u.registrationId || u.applicationId}","${u.delegate.name}","${u.delegate.organization}","${u.delegate.email}","${u.delegate.mobile}","${u.delegate.membershipType}",${calculatePricing(u, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages).grandTotal},"${u.status}"\n`;
      });
    } else {
      csvContent += 'Inventory Item,Total Units,Occupied,Available,Blocked\n';
      csvContent += `"Exhibition Stalls",${stalls.length},${stalls.filter(s=>s.status==='booked').length},${stalls.filter(s=>s.status==='available').length},${stalls.filter(s=>s.status==='blocked').length}\n`;
      csvContent += `"Trading Tables",${tables.length},${tables.filter(t=>t.status==='allocated').length},${tables.filter(t=>t.status==='available').length},${tables.filter(t=>t.status==='blocked').length}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `isc2027_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    saveAuditLog('Report Exported', `${reportType} CSV downloaded`, 'None', 'Completed');
  };

  // Searching and Filtering Registrations List
  const filteredUsers = registeredUsers.filter(u => {
    const query = searchQuery.toLowerCase().trim();
    const statusMatch = regFilterStatus === 'all' || u.status === regFilterStatus;
    if (!query) return statusMatch;
    
    const textMatch = 
      u.delegate.name.toLowerCase().includes(query) ||
      u.delegate.organization.toLowerCase().includes(query) ||
      u.delegate.email.toLowerCase().includes(query) ||
      (u.registrationId && u.registrationId.toLowerCase().includes(query)) ||
      u.applicationId.toLowerCase().includes(query);

    return statusMatch && textMatch;
  });

  const paginatedUsers = filteredUsers.slice((regPage - 1) * itemsPerPage, regPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-slate-50 flex text-[#151A17] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#08452F] text-slate-100 flex flex-col justify-between select-none">
        <div>
          <div className="p-6 border-b border-[#0B6B43]/50 flex items-center gap-3">
            <img 
              src="/images/nsai_logo.png" 
              alt="NSAI logo" 
              className="h-9 w-auto object-contain bg-white rounded-full p-1"
            />
            <div>
              <span className="font-extrabold tracking-wider text-sm block">NSAI ERP</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">Master Panel</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 text-xs font-bold uppercase tracking-wider overflow-y-auto max-h-[70vh]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'overview' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Overview
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'registrations' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Users className="w-4 h-4" /> Registrations
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'members' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Members
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'approvals' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <CheckSquare className="w-4 h-4" /> Approvals
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'payments' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Payments
            </button>

            <div className="h-px bg-[#0B6B43]/30 my-2" />

            <button
              onClick={() => setActiveTab('regSetup')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'regSetup' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Layers className="w-4 h-4" /> Registration Setup
            </button>

            <button
              onClick={() => setActiveTab('spouseStay')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'spouseStay' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <BedDouble className="w-4 h-4" /> Spouse & Stay
            </button>

            <button
              onClick={() => setActiveTab('tables')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'tables' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Table2 className="w-4 h-4" /> Trading Tables
            </button>

            <button
              onClick={() => setActiveTab('stalls')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'stalls' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Store className="w-4 h-4" /> Exhibition Stalls
            </button>

            <button
              onClick={() => setActiveTab('sponsorships')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'sponsorships' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Award className="w-4 h-4" /> Sponsorships
            </button>

            <button
              onClick={() => setActiveTab('advertisements')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'advertisements' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Advertisements
            </button>

            <button
              onClick={() => setActiveTab('allocation')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'allocation' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Allocation Center
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'reports' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Download className="w-4 h-4" /> Reports
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'settings' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Settings className="w-4 h-4" /> Event Settings
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'users' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <Settings className="w-4 h-4" /> Admin Users
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition-colors ${
                activeTab === 'logs' ? 'bg-[#0B6B43] text-white' : 'hover:bg-[#0B6B43]/30 text-slate-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Audit Log
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-[#0B6B43]/30 space-y-4 text-xs">
          <div>
            <span className="text-[#7A847E] block text-[10px] uppercase font-bold tracking-wider mb-1">Acting Role</span>
            <select
              value={activeAdmin.id}
              onChange={(e) => {
                const found = ADMIN_USERS.find(au => au.id === e.target.value);
                if (found) setActiveAdmin(found);
              }}
              className="w-full bg-[#0B6B43] border border-[#0B6B43]/50 p-2 rounded text-white font-bold"
            >
              {ADMIN_USERS.map(au => (
                <option key={au.id} value={au.id}>{au.username} ({au.role.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          <button
            onClick={onCloseAdmin}
            className="w-full flex items-center justify-center gap-2 p-2 bg-rose-900 hover:bg-rose-950 text-white font-bold rounded uppercase tracking-wider text-[10px]"
          >
            <LogOut className="w-3.5 h-3.5" /> Close Panel
          </button>
        </div>
      </aside>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* MASTER HEADER */}
        <header className="h-14 bg-white border-b border-[#DDE5DF] px-8 flex items-center justify-between z-10 select-none">
          <div className="flex items-center gap-2 text-xs font-bold text-[#59635D]">
            <Calendar className="w-4 h-4 text-[#0B6B43]" />
            <span>ISC 2027 Secretariat System</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-2" />
          </div>

          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A847E]" />
            <input
              type="text"
              placeholder="Search delegate, company, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-[#DDE5DF] rounded text-xs focus:outline-none focus:border-[#0B6B43]"
            />
          </div>

          <div className="text-xs font-bold flex items-center gap-2">
            <span className="text-[#0B6B43] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase font-mono">
              {activeAdmin.role.replace('_', ' ')}
            </span>
          </div>
        </header>

        {/* CONTENT CANVAS */}
        <div className="flex-1 p-8 space-y-6 max-w-[1300px] w-full mx-auto">
          
          {/* TAB 1: OVERVIEW SCREEN */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">ISC 2027 Admin Dashboard</h2>
              
              {/* Widgets matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#DDE5DF] p-3.5 rounded text-xs">
                  <span className="text-[#7A847E] font-bold uppercase tracking-wider block">Total Registrations</span>
                  <span className="text-xl font-mono font-bold block mt-1">{totalRegistrations}</span>
                </div>
                <div className="bg-white border border-[#DDE5DF] p-3.5 rounded text-xs">
                  <span className="text-[#E59A24] font-bold uppercase tracking-wider block">Pending Approval</span>
                  <span className="text-xl font-mono font-bold text-[#E59A24] block mt-1">{pendingApprovalsCount}</span>
                </div>
                <div className="bg-white border border-[#DDE5DF] p-3.5 rounded text-xs">
                  <span className="text-[#0B6B43] font-bold uppercase tracking-wider block">Approved</span>
                  <span className="text-xl font-mono font-bold text-[#0B6B43] block mt-1">{approvedCount}</span>
                </div>
                <div className="bg-white border border-[#DDE5DF] p-3.5 rounded text-xs">
                  <span className="text-rose-600 font-bold uppercase tracking-wider block">Rejected / Corrections</span>
                  <span className="text-xl font-mono font-bold text-rose-600 block mt-1">{rejectedCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTRATION DIRECTORY */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Registration directory</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={regFilterStatus}
                    onChange={(e) => setRegFilterStatus(e.target.value as any)}
                    className="border p-1.5 text-xs rounded bg-white font-semibold"
                  >
                    <option value="all">All Registrations</option>
                    <option value="approved">Approved</option>
                    <option value="under_review">Under Review</option>
                    <option value="changes_required">Corrections Required</option>
                  </select>
                  <button
                    onClick={() => handleExportCSV('registrations')}
                    className="px-3 py-1.5 bg-white border text-xs font-bold rounded flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#DDE5DF] rounded overflow-x-auto">
                <table className="min-w-full text-xs divide-y text-left">
                  <thead className="bg-slate-50 uppercase tracking-wider text-[10px] font-bold text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3">Registration ID</th>
                      <th className="px-6 py-3">Delegate Name</th>
                      <th className="px-6 py-3">Company</th>
                      <th className="px-6 py-3">Email / Mobile</th>
                      <th className="px-6 py-3">Membership</th>
                      <th className="px-6 py-3">Total Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-[#151A17]">
                    {paginatedUsers.map(user => (
                      <tr key={user.applicationId} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono font-bold text-[#0B6B43]">{user.registrationId || user.applicationId}</td>
                        <td className="px-6 py-4 font-bold">{user.delegate.name}</td>
                        <td className="px-6 py-4">{user.delegate.organization}</td>
                        <td className="px-6 py-4">
                          <span className="block font-mono">{user.delegate.email}</span>
                          <span className="block font-mono text-[#7A847E] text-[10px]">{user.delegate.mobile}</span>
                        </td>
                        <td className="px-6 py-4 capitalize">{user.delegate.membershipType.replace('_', ' ')}</td>
                        <td className="px-6 py-4 font-bold font-mono-num">{formatCurrency(calculatePricing(user, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages).grandTotal)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            user.status === 'approved' ? 'bg-emerald-50 text-[#0B6B43] border-emerald-200' :
                            user.status === 'under_review' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                            'bg-rose-50 text-rose-600 border-rose-200'
                          }`}>{user.status.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 text-center space-x-1.5">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-[#DDE5DF] rounded font-bold cursor-pointer"
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERS SETUP */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Membership manual verification portal</h2>
              <div className="bg-white border p-6 rounded space-y-4 text-xs">
                <span className="font-bold text-sm block border-b pb-2">Verification Control Rules</span>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Require NSAI membership code check</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateRegSettings({ ...regSettings, requireMemberVerification: true })}
                        className={`px-3 py-1 rounded font-bold border ${regSettings.requireMemberVerification ? 'bg-[#0B6B43] text-white border-[#0B6B43]' : 'bg-white'}`}
                      >
                        YES
                      </button>
                      <button
                        onClick={() => onUpdateRegSettings({ ...regSettings, requireMemberVerification: false })}
                        className={`px-3 py-1 rounded font-bold border ${!regSettings.requireMemberVerification ? 'bg-[#0B6B43] text-white border-[#0B6B43]' : 'bg-white'}`}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REGISTRATION SETUP (CRUD EVENT CATEGORIES) */}
          {activeTab === 'regSetup' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Registration Categories setup</h2>
                {canModifySettings && (
                  <button
                    onClick={() => { setEditingCategory(null); setCatName(''); setCatPrice(25000); setShowCategoryModal(true); }}
                    className="px-3 py-1.5 bg-[#0B6B43] hover:bg-[#08452F] text-white text-xs font-bold rounded flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Create Category
                  </button>
                )}
              </div>

              <div className="bg-white border border-[#DDE5DF] rounded">
                <table className="min-w-full text-xs divide-y text-left">
                  <thead className="bg-slate-50 font-bold text-[#7A847E] uppercase text-[10px]">
                    <tr>
                      <th className="px-6 py-3.5">Category Name</th>
                      <th className="px-6 py-3.5">Base Price</th>
                      <th className="px-6 py-3.5">Tax (GST)</th>
                      <th className="px-6 py-3.5">Final Calculated Price</th>
                      <th className="px-6 py-3.5">Max Registrations</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium">
                    {categories.map(cat => (
                      <tr key={cat.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#151A17] block">{cat.name}</span>
                          <span className="text-[10px] text-[#7A847E]">{cat.description}</span>
                        </td>
                        <td className="px-6 py-4 font-mono">{formatCurrency(cat.price)}</td>
                        <td className="px-6 py-4 font-mono">{cat.tax}%</td>
                        <td className="px-6 py-4 font-bold text-[#0B6B43] font-mono">{formatCurrency(cat.finalPrice)}</td>
                        <td className="px-6 py-4 font-mono">{cat.maxRegistrations}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cat.status === 'active' ? 'bg-emerald-50 text-[#0B6B43]' : 'bg-slate-100 text-slate-500'
                          }`}>{cat.status}</span>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCatName(cat.name);
                              setCatPrice(cat.price);
                              setCatTax(cat.tax);
                              setCatMax(cat.maxRegistrations);
                              setCatDesc(cat.description);
                              setShowCategoryModal(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateCategory(cat)}
                            className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SPOUSE & HOTEL SETUP */}
          {activeTab === 'spouseStay' && (
            <div className="space-y-8">
              
              {/* Spouse block */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Spouse Options Gating</h3>
                  <button
                    onClick={() => { setEditingSpousePkg(null); setSpouseNameInput('Spouse / Accompanying Person'); setSpousePriceInput(20000); setShowSpouseModal(true); }}
                    className="px-3 py-1.5 bg-[#0B6B43] text-white text-xs font-bold rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Spouse Option
                  </button>
                </div>

                <div className="bg-white border rounded">
                  <table className="min-w-full text-xs divide-y text-left">
                    <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                      <tr>
                        <th className="px-6 py-3">Option Name</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Max Accompaniments</th>
                        <th className="px-6 py-3">Included Deliverables</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium">
                      {spousePackages.map(pkg => (
                        <tr key={pkg.id}>
                          <td className="px-6 py-4 font-bold text-[#151A17]">{pkg.name}</td>
                          <td className="px-6 py-4 font-mono">{formatCurrency(pkg.price)}</td>
                          <td className="px-6 py-4 font-mono">{pkg.maxPersons} Persons</td>
                          <td className="px-6 py-4 text-[#59635D]">{pkg.includedBenefits.join(', ')}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setEditingSpousePkg(pkg);
                                setSpouseNameInput(pkg.name);
                                setSpousePriceInput(pkg.price);
                                setSpouseMaxInput(pkg.maxPersons);
                                setSpouseBenefitsList(pkg.includedBenefits.join(', '));
                                setShowSpouseModal(true);
                              }}
                              className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hotel block */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Hotel Stay Accommodation Setup</h3>
                  <button
                    onClick={() => { setEditingHotelRoom(null); setHotelNameInput(''); setRoomPriceInput(12000); setShowHotelModal(true); }}
                    className="px-3 py-1.5 bg-[#0B6B43] text-white text-xs font-bold rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Room Type
                  </button>
                </div>

                <div className="bg-white border rounded">
                  <table className="min-w-full text-xs divide-y text-left">
                    <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                      <tr>
                        <th className="px-6 py-3">Hotel & Room Category</th>
                        <th className="px-6 py-3">Max Occupancy</th>
                        <th className="px-6 py-3">Price / Night</th>
                        <th className="px-6 py-3">GST Tax</th>
                        <th className="px-6 py-3">Total / Night</th>
                        <th className="px-6 py-3">Available Rooms</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium">
                      {hotelRooms.map(room => (
                        <tr key={room.id}>
                          <td className="px-6 py-4">
                            <span className="font-bold text-[#151A17] block">{room.hotelName}</span>
                            <span className="text-[10px] text-[#7A847E]">{room.roomType} ({room.amenities.slice(0,3).join(', ')})</span>
                          </td>
                          <td className="px-6 py-4 font-mono">{room.occupancy} Persons</td>
                          <td className="px-6 py-4 font-mono">{formatCurrency(room.pricePerNight)}</td>
                          <td className="px-6 py-4 font-mono">{room.tax}%</td>
                          <td className="px-6 py-4 font-bold text-[#0B6B43] font-mono">{formatCurrency(room.totalPerNight)}</td>
                          <td className="px-6 py-4 font-mono">{room.availableRooms} rooms</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setEditingHotelRoom(room);
                                setHotelNameInput(room.hotelName);
                                setRoomTypeInput(room.roomType);
                                setRoomPriceInput(room.pricePerNight);
                                setRoomTaxInput(room.tax);
                                setRoomMaxRoomsInput(room.availableRooms);
                                setRoomOccupancyInput(room.occupancy);
                                setRoomAmenitiesInput(room.amenities.join(', '));
                                setShowHotelModal(true);
                              }}
                              className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: TRADING TABLES INVENTORY & GENERATOR */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Trading Tables Master setup</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Generator panel */}
                <div className="bg-white border p-5 rounded space-y-4 text-xs">
                  <div className="border-b pb-2">
                    <span className="font-bold block">Bulk Create Tables Grid</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">Prefix</label>
                        <input type="text" value={bulkPrefix} onChange={e=>setBulkPrefix(e.target.value)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">Price (₹)</label>
                        <input type="number" value={bulkPrice} onChange={e=>setBulkPrice(parseInt(e.target.value)||0)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">Start ID</label>
                        <input type="number" value={bulkStart} onChange={e=>setBulkStart(parseInt(e.target.value)||1)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">End ID</label>
                        <input type="number" value={bulkEnd} onChange={e=>setBulkEnd(parseInt(e.target.value)||10)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-[#59635D]">Zone / Location</label>
                      <input type="text" value={bulkZone} onChange={e=>setBulkZone(e.target.value)} className="border p-1 rounded w-full bg-white" />
                    </div>
                    <button
                      onClick={handleBulkCreateTables}
                      className="w-full py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded"
                    >
                      Generate Master Tables
                    </button>
                  </div>
                </div>

                {/* Stalls layout matrix mapping */}
                <div className="lg:col-span-2 bg-white border p-5 rounded space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-xs uppercase tracking-wider">Tables Layout Grid (Color Coded status)</span>
                    <button
                      onClick={() => { setEditingTable(null); setTableNoInput(''); setShowTableModal(true); }}
                      className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                    >
                      + Create Table
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-3 pt-2">
                    {tables.map(t => {
                      let colorClass = 'bg-emerald-50 border-emerald-300 text-[#0B6B43]'; // Available
                      if (t.status === 'allocated') colorClass = 'bg-[#08452F] text-white border-[#08452F]'; // Allocated
                      if (t.status === 'blocked') colorClass = 'bg-slate-200 text-slate-500 border-slate-300'; // Blocked

                      return (
                        <div key={t.tableNumber} className={`p-2 border rounded text-center text-xs font-mono font-bold shadow-xs cursor-pointer select-none flex flex-col justify-between h-14 ${colorClass}`}>
                          <span>{t.tableNumber}</span>
                          {t.status === 'allocated' ? (
                            <button onClick={()=>handleReleaseTable(t.tableNumber)} className="text-[8px] underline text-rose-300">Release</button>
                          ) : t.status === 'blocked' ? (
                            <button onClick={() => {
                              const list = tables.map(tb => tb.tableNumber === t.tableNumber ? { ...tb, status: 'available' as const } : tb);
                              onUpdateTables(list);
                            }} className="text-[8px] underline text-blue-600">Unblock</button>
                          ) : (
                            <button onClick={()=>handleBlockTable(t.tableNumber)} className="text-[8px] underline text-slate-400">Block</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: EXHIBITION STALLS GENERATOR */}
          {activeTab === 'stalls' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Exhibition Modular Stalls Master setup</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bulk stall creation form */}
                <div className="bg-white border p-5 rounded space-y-4 text-xs">
                  <div className="border-b pb-2">
                    <span className="font-bold block">Bulk Stalls Creator</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">Stall Prefix</label>
                        <input type="text" value={bulkStallPrefix} onChange={e=>setBulkStallPrefix(e.target.value)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">Price (₹)</label>
                        <input type="number" value={bulkStallPrice} onChange={e=>setBulkStallPrice(parseInt(e.target.value)||0)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">Start ID</label>
                        <input type="number" value={bulkStallStart} onChange={e=>setBulkStallStart(parseInt(e.target.value)||1)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-[#59635D]">End ID</label>
                        <input type="number" value={bulkStallEnd} onChange={e=>setBulkStallEnd(parseInt(e.target.value)||10)} className="border p-1 rounded w-full bg-white font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-[#59635D]">Zone</label>
                      <input type="text" value={bulkStallZone} onChange={e=>setBulkStallZone(e.target.value)} className="border p-1 rounded w-full bg-white" />
                    </div>
                    <button
                      onClick={handleBulkCreateStalls}
                      className="w-full py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded"
                    >
                      Generate Master Stalls
                    </button>
                  </div>
                </div>

                {/* Stalls map arrangement grid */}
                <div className="lg:col-span-2 bg-white border p-5 rounded space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-xs uppercase tracking-wider">Stalls Layout Grid Matrix</span>
                    <button
                      onClick={() => { setEditingStall(null); setStallNoInput(''); setShowStallModal(true); }}
                      className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                    >
                      + Create Stall
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-3 pt-2">
                    {stalls.map(s => {
                      let colorClass = 'bg-emerald-50 border-emerald-300 text-[#0B6B43]'; // Available
                      if (s.status === 'booked') colorClass = 'bg-[#08452F] text-white border-[#08452F]'; // Occupied
                      if (s.status === 'blocked') colorClass = 'bg-slate-200 text-slate-500 border-slate-300'; // Blocked

                      return (
                        <div key={s.stallNumber} className={`p-2 border rounded text-center text-xs font-mono font-bold shadow-xs cursor-pointer select-none flex flex-col justify-between h-16 ${colorClass}`}>
                          <span>{s.stallNumber}</span>
                          <span className="text-[8px] font-sans font-bold text-slate-400 block">{s.size}</span>
                          {s.status === 'booked' ? (
                            <button onClick={()=>handleReleaseStall(s.stallNumber)} className="text-[8px] underline text-rose-300">Release</button>
                          ) : s.status === 'blocked' ? (
                            <button onClick={() => {
                              const list = stalls.map(st => st.stallNumber === s.stallNumber ? { ...st, status: 'available' as const } : st);
                              onUpdateStalls(list);
                            }} className="text-[8px] underline text-blue-600">Unblock</button>
                          ) : (
                            <button onClick={()=>handleBlockStall(s.stallNumber)} className="text-[8px] underline text-slate-400">Block</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: SPONSORSHIPS PACKAGES BUILDER */}
          {activeTab === 'sponsorships' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Sponsorship Tiers & Benefits Builder</h2>
                <button
                  onClick={() => { setEditingSponsorship(null); setSponsorNameInput(''); setSponsorPriceInput(500000); setSponsorBenefitsSelected([]); setShowSponsorModal(true); }}
                  className="px-3 py-1.5 bg-[#0B6B43] text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Sponsorship Package
                </button>
              </div>

              <div className="bg-white border rounded text-xs">
                <table className="min-w-full divide-y text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3.5">Package</th>
                      <th className="px-6 py-3.5">Base Price</th>
                      <th className="px-6 py-3.5">GST Tax</th>
                      <th className="px-6 py-3.5">Slots (Booked/Limit)</th>
                      <th className="px-6 py-3.5">Included Allocations</th>
                      <th className="px-6 py-3.5">Benefits</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-[#151A17]">
                    {sponsorshipPackages.map(sponsor => (
                      <tr key={sponsor.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <span className="font-bold block text-sm">{sponsor.name}</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">tag: {sponsor.shortName}</span>
                        </td>
                        <td className="px-6 py-4 font-mono">{formatCurrency(sponsor.price)}</td>
                        <td className="px-6 py-4 font-mono">{sponsor.tax}%</td>
                        <td className="px-6 py-4 font-mono">{sponsor.bookedSlots} / {sponsor.slotsLimit} slots</td>
                        <td className="px-6 py-4">
                          <span className="block">Delegates: {sponsor.includedDelegates}</span>
                          <span className="block">Stalls: {sponsor.includedStalls} | Tables: {sponsor.includedTables}</span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-[#59635D]">{sponsor.benefits.join(', ')}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setEditingSponsorship(sponsor);
                              setSponsorNameInput(sponsor.name);
                              setSponsorShortInput(sponsor.shortName);
                              setSponsorPriceInput(sponsor.price);
                              setSponsorTaxInput(sponsor.tax);
                              setSponsorSlotsInput(sponsor.slotsLimit);
                              setSponsorDelegatesCount(sponsor.includedDelegates);
                              setSponsorStallsCount(sponsor.includedStalls);
                              setSponsorTablesCount(sponsor.includedTables);
                              setSponsorAdsCount(sponsor.includedAds);
                              setSponsorBenefitsSelected(sponsor.benefits);
                              setShowSponsorModal(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: ADVERTISEMENT PACKAGES */}
          {activeTab === 'advertisements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Souvenir advertisement packages</h2>
                <button
                  onClick={() => { setEditingAdPackage(null); setAdNameInput(''); setAdPriceInput(30000); setShowAdModal(true); }}
                  className="px-3 py-1.5 bg-[#0B6B43] text-white text-xs font-bold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Ad Package
                </button>
              </div>

              <div className="bg-white border rounded text-xs">
                <table className="min-w-full divide-y text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3.5">Ad Package</th>
                      <th className="px-6 py-3.5">Price</th>
                      <th className="px-6 py-3.5">GST Tax</th>
                      <th className="px-6 py-3.5">Placement Position</th>
                      <th className="px-6 py-3.5">Max Slots</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-[#151A17]">
                    {advertisementPackages.map(ad => (
                      <tr key={ad.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <span className="font-bold block text-sm">{ad.name}</span>
                          <span className="text-[10px] text-[#7A847E] font-mono">{ad.size} ({ad.color === 'color' ? 'Colored' : 'B&W'})</span>
                        </td>
                        <td className="px-6 py-4 font-mono">{formatCurrency(ad.price)}</td>
                        <td className="px-6 py-4 font-mono">{ad.tax}%</td>
                        <td className="px-6 py-4 capitalize">{ad.placement.replace('_', ' ')}</td>
                        <td className="px-6 py-4 font-mono">{ad.maxBookings} bookings</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setEditingAdPackage(ad);
                              setAdNameInput(ad.name);
                              setAdSizeInput(ad.size);
                              setAdPriceInput(ad.price);
                              setAdTaxInput(ad.tax);
                              setAdPlacementInput(ad.placement);
                              setAdColorInput(ad.color);
                              setAdMaxBookingsInput(ad.maxBookings);
                              setShowAdModal(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-50 border text-[10px] font-bold rounded"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: ALLOCATION CENTER */}
          {activeTab === 'allocation' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Event Allocation desk</h2>
              
              <div className="bg-white border p-6 rounded space-y-6 text-xs max-w-[700px]">
                <div className="space-y-3">
                  <span className="font-bold block uppercase border-b pb-1 text-[#7A847E]">1. Search Delegate registration</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter Registration ID (e.g. ISC27-849102)"
                      value={allocationSearch}
                      onChange={e=>setAllocationSearch(e.target.value)}
                      className="border p-2 rounded flex-1 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block font-bold">Allocate Exhibition Stall ID</label>
                    <select
                      value={allocatedStallNo}
                      onChange={e=>setAllocatedStallNo(e.target.value)}
                      className="border p-2 rounded w-full bg-white font-mono"
                    >
                      <option value="">-- Select Available Stall --</option>
                      {stalls.filter(s => s.status === 'available').map(s => (
                        <option key={s.stallNumber} value={s.stallNumber}>{s.stallNumber} ({s.stallType} - {s.size})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold">Allocate Trading Table ID</label>
                    <select
                      value={allocatedTableNo}
                      onChange={e=>setAllocatedTableNo(e.target.value)}
                      className="border p-2 rounded w-full bg-white font-mono"
                    >
                      <option value="">-- Select Available Table --</option>
                      {tables.filter(t => t.status === 'available').map(t => (
                        <option key={t.tableNumber} value={t.tableNumber}>{t.tableNumber} ({t.location})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold">Allocate Hotel stay room</label>
                    <select
                      value={allocatedRoomNo}
                      onChange={e=>setAllocatedRoomNo(e.target.value)}
                      className="border p-2 rounded w-full bg-white"
                    >
                      <option value="">-- Select Hotel stay room --</option>
                      {hotelRooms.filter(r => r.status === 'available').map(r => (
                        <option key={r.id} value={r.id}>{r.hotelName} ({r.roomType})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleManualAllocation(allocationSearch)}
                  className="w-full py-2.5 bg-[#0B6B43] text-white font-bold rounded uppercase tracking-wider"
                >
                  Allocate Selected Resources
                </button>
              </div>
            </div>
          )}

          {/* TAB 11: AUDIT TRAILS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">System Audit Log</h2>

              <div className="bg-white border rounded overflow-hidden">
                <table className="min-w-full text-xs divide-y text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3.5">Date / Time</th>
                      <th className="px-6 py-3.5">Admin</th>
                      <th className="px-6 py-3.5">Action Triggered</th>
                      <th className="px-6 py-3.5">Target Scope</th>
                      <th className="px-6 py-3.5">Old Value</th>
                      <th className="px-6 py-3.5">New Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px] text-[#59635D]">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 whitespace-nowrap font-bold text-[#151A17]">{log.date} {log.time}</td>
                        <td className="px-6 py-3 text-[#0B6B43] font-bold">{log.adminName}</td>
                        <td className="px-6 py-3 font-sans font-bold text-[#151A17]">{log.action}</td>
                        <td className="px-6 py-3 font-sans">{log.target}</td>
                        <td className="px-6 py-3 max-w-xs truncate">{log.oldValue}</td>
                        <td className="px-6 py-3 max-w-xs truncate">{log.newValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Reports Desk</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="bg-white border p-5 rounded space-y-3">
                  <h3 className="font-bold text-sm border-b pb-2">Registrant Masters report</h3>
                  <p className="text-[#59635D]">Downloads complete registry list containing delegate name, company, email, categories, and totals.</p>
                  <button onClick={() => handleExportCSV('registrations')} className="px-4 py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded flex items-center gap-1 font-sans">
                    <Download className="w-3.5 h-3.5" /> Export Registrations (CSV)
                  </button>
                </div>

                <div className="bg-white border p-5 rounded space-y-3">
                  <h3 className="font-bold text-sm border-b pb-2">Allocations Master report</h3>
                  <p className="text-[#59635D]">Downloads tables and exhibition stalls allocations grid summary containing booking assignees.</p>
                  <button onClick={() => handleExportCSV('allocations')} className="px-4 py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded flex items-center gap-1 font-sans">
                    <Download className="w-3.5 h-3.5" /> Export Allocations (CSV)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Pending Approvals</h2>

              <div className="bg-white border rounded">
                <table className="min-w-full text-xs divide-y text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3.5">Registration ID</th>
                      <th className="px-6 py-3.5">Delegate / Organization</th>
                      <th className="px-6 py-3.5">Submitted Date</th>
                      <th className="px-6 py-3.5">Membership</th>
                      <th className="px-6 py-3.5">Total Price</th>
                      <th className="px-6 py-3.5 text-center">Desk action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium">
                    {registeredUsers.filter(u=>u.status==='under_review').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">No registrations waiting for approval.</td>
                      </tr>
                    ) : (
                      registeredUsers.filter(u=>u.status==='under_review').map(u => (
                        <tr key={u.applicationId} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono font-bold text-[#0B6B43]">{u.registrationId || u.applicationId}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-[#151A17] block">{u.delegate.name}</span>
                            <span className="text-[10px] text-[#7A847E]">{u.delegate.organization}</span>
                          </td>
                          <td className="px-6 py-4">{u.submissionDate || 'Today'}</td>
                          <td className="px-6 py-4 capitalize">{u.delegate.membershipType}</td>
                          <td className="px-6 py-4 font-bold font-mono-num">{formatCurrency(calculatePricing(u, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages).grandTotal)}</td>
                          <td className="px-6 py-4 text-center space-x-2">
                            <button onClick={()=>handleApproveRegistration(u)} className="px-2.5 py-1.5 bg-[#0B6B43] text-white rounded font-bold hover:bg-[#08452F]">Approve</button>
                            <button onClick={()=>{setRejectingUser(u); setRejectionReason('Payment mismatch');}} className="px-2.5 py-1.5 bg-rose-900 text-white rounded font-bold hover:bg-rose-950">Reject</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 14: PAYMENTS DESK */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Payments Wire Transfers Desk</h2>

              <div className="bg-white border rounded">
                <table className="min-w-full text-xs divide-y text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3.5">Registration ID</th>
                      <th className="px-6 py-3.5">Company</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Transaction Ref / Cheque</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium">
                    {registeredUsers.filter(u=>u.payment && (u.payment.transactionRef || u.payment.ddChequeNumber)).map(u => (
                      <tr key={u.applicationId} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono font-bold text-[#0B6B43]">{u.registrationId || u.applicationId}</td>
                        <td className="px-6 py-4 font-bold">{u.delegate.organization}</td>
                        <td className="px-6 py-4 font-bold font-mono-num">{formatCurrency(calculatePricing(u, dynamicRates, categories, spousePackages, hotelRooms, sponsorshipPackages, advertisementPackages).grandTotal)}</td>
                        <td className="px-6 py-4 font-mono font-bold text-amber-700">{u.payment?.transactionRef || u.payment?.ddChequeNumber}</td>
                        <td className="px-6 py-4 font-mono">{u.payment?.date}</td>
                        <td className="px-6 py-4 text-center">
                          {u.status !== 'approved' && (
                            <button onClick={()=>handleApproveRegistration(u)} className="px-3 py-1 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded">Verify Payment</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 15: EVENT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Event Settings Configuration</h2>
              <div className="bg-white border p-6 rounded space-y-4 text-xs max-w-[650px]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Event Name</label>
                    <input type="text" value={eventSettings.eventName} onChange={e=>onUpdateEventSettings({...eventSettings, eventName: e.target.value})} className="border p-2 rounded w-full bg-white" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Location / Venue</label>
                    <input type="text" value={eventSettings.eventLocation} onChange={e=>onUpdateEventSettings({...eventSettings, eventLocation: e.target.value})} className="border p-2 rounded w-full bg-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Contact Email</label>
                    <input type="text" value={eventSettings.contactEmail} onChange={e=>onUpdateEventSettings({...eventSettings, contactEmail: e.target.value})} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Contact Number</label>
                    <input type="text" value={eventSettings.contactNumber} onChange={e=>onUpdateEventSettings({...eventSettings, contactNumber: e.target.value})} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                </div>
                <button onClick={()=>{saveAuditLog('Event Settings Updated', 'Secretariat details', 'Previous', 'Saved'); alert('Settings updated.');}} className="px-4 py-2 bg-[#0B6B43] text-white font-bold rounded font-sans">Save Settings</button>
              </div>
            </div>
          )}

          {/* TAB 16: ADMIN USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Admin Users Management</h2>
              <div className="bg-white border rounded">
                <table className="min-w-full text-xs divide-y text-left">
                  <thead className="bg-slate-50 font-bold uppercase text-[10px] text-[#7A847E]">
                    <tr>
                      <th className="px-6 py-3.5">Username</th>
                      <th className="px-6 py-3.5">Email Address</th>
                      <th className="px-6 py-3.5">Assigned Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-[#151A17]">
                    {ADMIN_USERS.map(au => (
                      <tr key={au.id}>
                        <td className="px-6 py-4 font-bold">{au.username}</td>
                        <td className="px-6 py-4 font-mono">{au.email}</td>
                        <td className="px-6 py-4 capitalize font-mono text-[#0B6B43]">{au.role.replace('_', ' ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* CREATE REGISTRATION CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">{editingCategory ? 'Edit Category' : 'Create Registration Category'}</span>
              <button onClick={()=>setShowCategoryModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Category Name</label>
                <input type="text" value={catName} onChange={e=>setCatName(e.target.value)} className="border p-2 rounded w-full bg-white" placeholder="NSAI Member" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Price (₹)</label>
                  <input type="number" value={catPrice} onChange={e=>setCatPrice(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Tax (GST %)</label>
                  <input type="number" value={catTax} onChange={e=>setCatTax(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Max Registrations</label>
                <input type="number" value={catMax} onChange={e=>setCatMax(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Description</label>
                <textarea value={catDesc} onChange={e=>setCatDesc(e.target.value)} className="border p-2 rounded w-full bg-white h-16" />
              </div>
              <button onClick={handleCreateCategory} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SPOUSE OPTION MODAL */}
      {showSpouseModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">Create Spouse Option</span>
              <button onClick={()=>setShowSpouseModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Option Name</label>
                <input type="text" value={spouseNameInput} onChange={e=>setSpouseNameInput(e.target.value)} className="border p-2 rounded w-full bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Price (₹)</label>
                  <input type="number" value={spousePriceInput} onChange={e=>setSpousePriceInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Max Persons</label>
                  <input type="number" value={spouseMaxInput} onChange={e=>setSpouseMaxInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Included Deliverables (comma separated)</label>
                <input type="text" value={spouseBenefitsList} onChange={e=>setSpouseBenefitsList(e.target.value)} className="border p-2 rounded w-full bg-white" />
              </div>
              <button onClick={handleCreateSpousePackage} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Option</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE HOTEL STAY MODAL */}
      {showHotelModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">{editingHotelRoom ? 'Edit Room Type' : 'Create Room Type'}</span>
              <button onClick={()=>setShowHotelModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Hotel Name</label>
                <input type="text" value={hotelNameInput} onChange={e=>setHotelNameInput(e.target.value)} className="border p-2 rounded w-full bg-white" placeholder="Hotel Ramoji (5 Star)" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Room Type Name</label>
                <input type="text" value={roomTypeInput} onChange={e=>setRoomTypeInput(e.target.value)} className="border p-2 rounded w-full bg-white" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Price / Night</label>
                  <input type="number" value={roomPriceInput} onChange={e=>setRoomPriceInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Tax (%)</label>
                  <input type="number" value={roomTaxInput} onChange={e=>setRoomTaxInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Max Rooms</label>
                  <input type="number" value={roomMaxRoomsInput} onChange={e=>setRoomMaxRoomsInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
              </div>
              <button onClick={handleCreateHotelRoom} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Room Type</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SINGLE TABLE MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">{editingTable ? 'Edit Table' : 'Create Table'}</span>
              <button onClick={()=>setShowTableModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Table Number</label>
                <input type="text" value={tableNoInput} onChange={e=>setTableNoInput(e.target.value)} className="border p-2 rounded w-full bg-white font-mono" placeholder="T25" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Location / Zone</label>
                <input type="text" value={tableLocationInput} onChange={e=>setTableLocationInput(e.target.value)} className="border p-2 rounded w-full bg-white" placeholder="Hall A" />
              </div>
              <button onClick={handleCreateTradingTable} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Table</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SINGLE STALL MODAL */}
      {showStallModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">{editingStall ? 'Edit Stall' : 'Create Stall'}</span>
              <button onClick={()=>setShowStallModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Stall Number</label>
                <input type="text" value={stallNoInput} onChange={e=>setStallNoInput(e.target.value)} className="border p-2 rounded w-full bg-white font-mono" placeholder="A15" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Stall Type</label>
                  <select value={stallTypeInput} onChange={e=>setStallTypeInput(e.target.value as any)} className="border p-2 rounded w-full bg-white">
                    <option value="normal">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Price (₹)</label>
                  <input type="number" value={stallPriceInput} onChange={e=>setStallPriceInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Size</label>
                <input type="text" value={stallSizeInput} onChange={e=>setStallSizeInput(e.target.value)} className="border p-2 rounded w-full bg-white" placeholder="3 × 3 Meter" />
              </div>
              <button onClick={handleCreateStall} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Stall</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SPONSORSHIP BUILDER MODAL */}
      {showSponsorModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-lg w-full space-y-4 text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">{editingSponsorship ? 'Edit Sponsorship' : 'Create Sponsorship Package Builder'}</span>
              <button onClick={()=>setShowSponsorModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="font-bold text-[#0B6B43]">Basic Information</span>
                <div>
                  <label className="block mb-1 font-semibold">Sponsor Name</label>
                  <input type="text" value={sponsorNameInput} onChange={e=>setSponsorNameInput(e.target.value)} className="border p-2 rounded w-full bg-white" placeholder="Gold Sponsor" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Short tag ID</label>
                  <input type="text" value={sponsorShortInput} onChange={e=>setSponsorShortInput(e.target.value)} className="border p-2 rounded w-full bg-white font-mono" placeholder="GOLD" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#0B6B43]">Pricing & Availability</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block mb-1 font-semibold">Base Price</label>
                    <input type="number" value={sponsorPriceInput} onChange={e=>setSponsorPriceInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">GST (%)</label>
                    <input type="number" value={sponsorTaxInput} onChange={e=>setSponsorTaxInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Slots limit</label>
                    <input type="number" value={sponsorSlotsInput} onChange={e=>setSponsorSlotsInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#0B6B43]">Included Resources</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block mb-1 font-semibold">Delegates</label>
                    <input type="number" value={sponsorDelegatesCount} onChange={e=>setSponsorDelegatesCount(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Stalls</label>
                    <input type="number" value={sponsorStallsCount} onChange={e=>setSponsorStallsCount(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Tables</label>
                    <input type="number" value={sponsorTablesCount} onChange={e=>setSponsorTablesCount(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold">Ads</label>
                    <input type="number" value={sponsorAdsCount} onChange={e=>setSponsorAdsCount(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#0B6B43] block">Select Deliverable Benefits</span>
                <div className="grid grid-cols-2 gap-2 font-semibold">
                  {sponsorBenefits.map(b => (
                    <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={sponsorBenefitsSelected.includes(b)} onChange={()=>handleToggleSponsorBenefit(b)} className="w-3.5 h-3.5 text-[#0B6B43]" />
                      {b}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={customBenefitInput}
                    onChange={e=>setCustomBenefitInput(e.target.value)}
                    placeholder="Add Custom Benefit (e.g. Stage banner)"
                    className="border p-2 rounded flex-1 bg-white text-xs"
                  />
                  <button type="button" onClick={handleAddCustomBenefit} className="px-3 py-2 bg-[#0B6B43] text-white rounded font-bold cursor-pointer font-sans">Add</button>
                </div>
              </div>

              <button onClick={handleCreateSponsorship} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Sponsorship Package</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ADVERTISEMENT PACKAGE MODAL */}
      {showAdModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-lg p-6 max-w-md w-full space-y-4 text-xs shadow-2xl">
            <div className="border-b pb-2 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#08452F]">{editingAdPackage ? 'Edit Ad Package' : 'Create Advertisement Package'}</span>
              <button onClick={()=>setShowAdModal(false)} className="cursor-pointer"><XCircle className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Ad Name</label>
                <input type="text" value={adNameInput} onChange={e=>setAdNameInput(e.target.value)} className="border p-2 rounded w-full bg-white" placeholder="Regular Full Page" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Price (₹)</label>
                  <input type="number" value={adPriceInput} onChange={e=>setAdPriceInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">GST (%)</label>
                  <input type="number" value={adTaxInput} onChange={e=>setAdTaxInput(parseInt(e.target.value)||0)} className="border p-2 rounded w-full bg-white font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">Ad Size</label>
                  <input type="text" value={adSizeInput} onChange={e=>setAdSizeInput(e.target.value)} className="border p-2 rounded w-full bg-white" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Placement Type</label>
                  <select value={adPlacementInput} onChange={e=>setAdPlacementInput(e.target.value as any)} className="border p-2 rounded w-full bg-white">
                    <option value="back_cover">Back Cover</option>
                    <option value="inside_front">Inside Front Cover</option>
                    <option value="regular_full">Regular Full Page</option>
                    <option value="regular_half">Regular Half Page</option>
                  </select>
                </div>
              </div>
              <button onClick={handleCreateAdvertisement} className="w-full py-2 bg-[#0B6B43] text-white font-bold rounded cursor-pointer font-sans">Save Ad Package</button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION DETAIL EXPANDED OVERLAY */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border rounded-lg p-8 max-w-[850px] w-full space-y-6 text-xs relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={()=>setSelectedUser(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"><XCircle className="w-6 h-6" /></button>
            
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-bold">Registration Profile Master Workspace</h3>
                <span className="font-mono text-[#0B6B43] font-bold text-sm block mt-0.5">{selectedUser.registrationId || selectedUser.applicationId}</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold capitalize ${
                selectedUser.status === 'approved' ? 'bg-emerald-50 text-[#0B6B43]' : 'bg-amber-50 text-[#E59A24]'
              }`}>{selectedUser.status.replace('_', ' ')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded border">
              <div>
                <span className="text-[#7A847E] font-bold block">Delegate Name</span>
                <span className="font-bold text-sm text-[#151A17]">{selectedUser.delegate.name} ({selectedUser.delegate.designation})</span>
              </div>
              <div>
                <span className="text-[#7A847E] font-bold block">Organization</span>
                <span className="font-bold text-[#151A17]">{selectedUser.delegate.organization}</span>
              </div>
              <div>
                <span className="text-[#7A847E] font-bold block">Email Contact</span>
                <span className="font-bold font-mono text-[#151A17]">{selectedUser.delegate.email}</span>
              </div>
              <div>
                <span className="text-[#7A847E] font-bold block">Mobile Phone</span>
                <span className="font-bold font-mono text-[#151A17]">{selectedUser.delegate.mobile}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border rounded space-y-1 bg-white">
                <span className="font-bold block text-slate-400">Accompaniment Spouse Pass</span>
                <span className="font-bold">{selectedUser.spouse.enabled ? `${selectedUser.spouse.list?.length || 1} Persons` : 'Not Added'}</span>
              </div>
              <div className="p-3 border rounded space-y-1 bg-white">
                <span className="font-bold block text-slate-400">Stay Accommodation Nights</span>
                <span className="font-bold">{selectedUser.stay.enabled ? `${selectedUser.stay.nights} Nights` : 'Not Added'}</span>
              </div>
              <div className="p-3 border rounded space-y-1 bg-white">
                <span className="font-bold block text-slate-400">Trading Table booked</span>
                <span className="font-bold">{selectedUser.tradingTable.enabled ? `${selectedUser.tradingTable.quantity} Table(s)` : 'Not Added'}</span>
              </div>
              <div className="p-3 border rounded space-y-1 bg-white">
                <span className="font-bold block text-slate-400">Exhibition Stall booked</span>
                <span className="font-bold">{selectedUser.exhibition.enabled ? `${selectedUser.exhibition.stallType} Stall` : 'Not Added'}</span>
              </div>
              <div className="p-3 border rounded space-y-1 bg-white">
                <span className="font-bold block text-slate-400">Sponsorship Partnership tier</span>
                <span className="font-bold capitalize">{selectedUser.sponsorship.enabled ? `${selectedUser.sponsorship.tier} Partner` : 'Not Partnered'}</span>
              </div>
              <div className="p-3 border rounded space-y-1 bg-white">
                <span className="font-bold block text-slate-400">Souvenir Advertisement placement</span>
                <span className="font-bold capitalize">{selectedUser.advertisement.enabled ? `${selectedUser.advertisement.placement.replace('_', ' ')}` : 'Not Booked'}</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end gap-2">
              {selectedUser.status !== 'approved' && (
                <>
                  <button onClick={()=>{handleApproveRegistration(selectedUser); setSelectedUser(null);}} className="px-4 py-2 bg-[#0B6B43] hover:bg-[#08452F] text-white font-bold rounded cursor-pointer font-sans">Approve Registration</button>
                  <button onClick={()=>{setRejectingUser(selectedUser); setSelectedUser(null);}} className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white font-bold rounded cursor-pointer font-sans">Reject / Corrections</button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* REJECTION REASON CONFIRMATION */}
      {rejectingUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <span className="font-extrabold text-xs uppercase block text-[#08452F]">Enter Rejection Remarks</span>
            <select value={rejectionReason} onChange={e=>setRejectionReason(e.target.value)} className="w-full border p-2 text-xs rounded bg-white">
              <option value="Payment details mismatch / transaction not found">Payment mismatch</option>
              <option value="Incomplete delegate information / organization invalid">Incomplete details</option>
              <option value="NSAI Membership number unverified">Invalid NSAI membership No</option>
            </select>
            <div className="flex gap-2 justify-end text-xs">
              <button onClick={()=>setRejectingUser(null)} className="px-3 py-1.5 border rounded cursor-pointer font-sans">Cancel</button>
              <button onClick={()=>handleRejectRegistration(rejectingUser)} className="px-3 py-1.5 bg-rose-900 text-white font-bold rounded cursor-pointer font-sans">Reject Registration</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
