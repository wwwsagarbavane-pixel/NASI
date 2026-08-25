export type MembershipType = 'member' | 'non_member';

export interface SingleDelegate {
  name: string;
  designation: string;
  mobile: string;
  email: string;
  organization: string;
  address: string;
  city: string;
  pinCode: string;
  stateCountry: string;
  nsaiMembershipNo: string;
  membershipType: MembershipType;
}

export interface SpouseItem {
  id: string;
  name: string;
  mobile: string;
  email: string;
}

export interface SpouseDetails {
  enabled: boolean;
  list: SpouseItem[];
  // For backward compatibility
  name?: string;
  mobile?: string;
  email?: string;
}

export interface StayDetails {
  enabled: boolean;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
}

export interface TradingTableDetails {
  enabled: boolean;
  quantity: number;
}

export type StallType = 'normal' | 'premium';

export interface ExhibitionDetails {
  enabled: boolean;
  stallType: StallType;
}

export type SponsorshipTier = 
  | 'event'
  | 'platinum'
  | 'welcome_dinner'
  | 'gala_dinner'
  | 'gold'
  | 'lunch'
  | 'conference_kit'
  | 'badge_lanyard'
  | 'silver'
  | 'bronze';

export interface SponsorshipDetails {
  enabled: boolean;
  tier: SponsorshipTier;
  useIncludedTradingTable: boolean;
  useIncludedAd: boolean;
}

export type SouvenirPlacement = 
  | 'back_page'
  | 'front_inside'
  | 'back_inner'
  | 'back_inner_facing'
  | 'regular_full'
  | 'regular_half';

export interface AdvertisementDetails {
  enabled: boolean;
  placement: SouvenirPlacement;
  useIncludedWithSponsor: boolean;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'changes_required' | 'cancelled';

export interface PaymentDetails {
  method: 'bank_transfer' | 'dd_cheque' | 'upi_qr';
  bankName: string;
  ddChequeNumber: string;
  branch: string;
  date: string;
  amount: number;
  transactionRef: string;
  upiId?: string;
}

export interface RegistrationPackageData {
  applicationId: string;
  ticketId: string;
  registrationId?: string;
  status: ApplicationStatus;
  submissionDate: string;
  delegate: SingleDelegate;
  spouse: SpouseDetails;
  stay: StayDetails;
  tradingTable: TradingTableDetails;
  exhibition: ExhibitionDetails;
  sponsorship: SponsorshipDetails;
  advertisement: AdvertisementDetails;
  payment?: PaymentDetails;
  termsConfirmed: boolean;
}

export interface PricingSummary {
  delegateTotal: number;
  spouseTotal: number;
  spouseCount: number;
  stayTotal: number;
  stayNights: number;
  tradingTableTotal: number;
  tradingTableCount: number;
  exhibitionTotal: number;
  sponsorshipTotal: number;
  advertisementTotal: number;
  grandTotal: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface UserSession {
  email: string;
  mobile: string;
  registrationId?: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export interface DynamicRates {
  delegateMember: number;
  delegateNonMember: number;
  spouseFee: number;
  stayPerNight: number;
  tradingTablePerTable: number;
  stall_normal: number;
  stall_premium: number;
  sponsor_event: number;
  sponsor_platinum: number;
  sponsor_welcome_dinner: number;
  sponsor_gala_dinner: number;
  sponsor_gold: number;
  sponsor_lunch: number;
  sponsor_conference_kit: number;
  sponsor_badge_lanyard: number;
  sponsor_silver: number;
  sponsor_bronze: number;
  ad_back_page: number;
  ad_front_inside: number;
  ad_back_inner: number;
  ad_back_inner_facing: number;
  ad_regular_full: number;
  ad_regular_half: number;
}

export interface EventSettings {
  eventName: string;
  eventLocation: string;
  eventDate: string;
  registrationOpeningDate: string;
  registrationClosingDate: string;
  contactEmail: string;
  contactNumber: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  bankBranch: string;
  bankIfsc: string;
  bankSwift: string;
}

export interface RegistrationSettings {
  isRegistrationOpen: boolean;
  allowNewRegistrations: boolean;
  allowEditing: boolean;
  requireEmailOtp: boolean;
  requireMobileOtp: boolean;
  requireMemberVerification: boolean;
  requirePaymentBeforeApproval: boolean;
  enableSponsorship: boolean;
  enableAdvertisement: boolean;
  enableHotelBooking: boolean;
  enableTableBooking: boolean;
  enableStallBooking: boolean;
}

export interface AuditLogEntry {
  id: string;
  date: string;
  time: string;
  adminName: string;
  action: string;
  target: string;
  oldValue: string;
  newValue: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'finance_manager' | 'event_manager' | 'content_manager' | 'viewer';
  email: string;
}

export interface ExhibitionStallAdmin {
  stallNumber: string;
  stallType: 'normal' | 'premium';
  size: string;
  price: number;
  companyName?: string;
  registrationId?: string;
  status: 'available' | 'reserved' | 'booked' | 'blocked';
}

export interface TableAllocationLog {
  date: string;
  action: 'allocated' | 'reassigned' | 'released' | 'blocked' | 'unblocked' | 'price_updated';
  fromUser?: string;
  toUser?: string;
  fromCompany?: string;
  toCompany?: string;
  by: string;
  notes?: string;
}

export interface TradingTableAdmin {
  tableNumber: string;
  location: string;
  price: number;
  status: 'available' | 'reserved' | 'allocated' | 'blocked';
  allocatedTo?: string;
  companyName?: string;
  registrationId?: string;
  allocatedDate?: string;
  allocatedBy?: string;
  paymentStatus?: 'verified' | 'pending' | 'unpaid';
  blockedReason?: string;
  history?: TableAllocationLog[];
}
export interface RegCategory {
  id: string;
  name: string;
  price: number;
  tax: number;
  finalPrice: number;
  maxRegistrations: number;
  booked: number;
  availableFrom: string;
  availableUntil: string;
  status: 'active' | 'inactive';
  description: string;
}

export interface SpousePackage {
  id: string;
  name: string;
  price: number;
  includedBenefits: string[];
  maxPersons: number;
  status: 'active' | 'inactive';
}

export interface HotelRoomAdmin {
  id: string;
  hotelName: string;
  roomType: string;
  occupancy: number;
  pricePerNight: number;
  tax: number;
  totalPerNight: number;
  availableRooms: number;
  booked: number;
  maxNights: number;
  status: 'available' | 'sold_out' | 'inactive';
  amenities: string[];
}

export interface TableTypeAdmin {
  id: string;
  name: string;
  price: number;
  size: string;
  capacity: number;
  benefits: string[];
  status: 'active' | 'inactive';
}

export interface StallTypeAdmin {
  id: string;
  name: string;
  size: string;
  price: number;
  tax: number;
  includedDelegates: number;
  includedTables: number;
  includedChairs: number;
  powerSupply: boolean;
  lighting: boolean;
  branding: boolean;
  furniture: boolean;
  benefits: string[];
  status: 'active' | 'inactive';
}

export interface SponsorshipPackageAdmin {
  id: string;
  name: string;
  shortName: string;
  price: number;
  tax: number;
  discount: number;
  finalPrice: number;
  slotsLimit: number;
  bookedSlots: number;
  maxPerCompany: number;
  status: 'available' | 'sold_out' | 'inactive';
  benefits: string[];
  includedDelegates: number;
  includedTables: number;
  includedStalls: number;
  includedAds: number;
}

export interface AdvertisementPackageAdmin {
  id: string;
  name: string;
  size: string;
  price: number;
  tax: number;
  placement: 'front_cover' | 'back_cover' | 'inside_front' | 'inside_back' | 'regular_full' | 'regular_half';
  color: 'color' | 'bw';
  maxBookings: number;
  booked: number;
  status: 'active' | 'inactive';
}

export interface MembershipTypeAdmin {
  id: string;
  name: string;
  price: number;
  numRequired: boolean;
  verificationRequired: boolean;
  benefits: string[];
  status: 'active' | 'inactive';
}

export interface FormSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  required: boolean;
  displayOrder: number;
  helpText: string;
}
