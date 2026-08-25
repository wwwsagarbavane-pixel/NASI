import { 
  RegistrationPackageData, 
  DynamicRates,
  RegCategory,
  SpousePackage,
  HotelRoomAdmin,
  SponsorshipPackageAdmin,
  AdvertisementPackageAdmin,
  TradingTableAdmin
} from '../types';
import { 
  DELEGATE_PRICING, 
  SPOUSE_PRICING, 
  STAY_PRICING, 
  TRADING_TABLE_PRICING, 
  STALL_OPTIONS, 
  SPONSORSHIP_OPTIONS, 
  SOUVENIR_OPTIONS 
} from '../data/eventData';

export interface CalculatedPricing {
  delegateTotal: number;
  spouseTotal: number;
  spouseCount: number;
  stayNights: number;
  stayTotal: number;
  tradingTableCount: number;
  tradingTableTotal: number;
  exhibitionTotal: number;
  sponsorshipTotal: number;
  advertisementTotal: number;
  subtotal: number;
  deductionsTotal: number;
  grandTotal: number;
}

export function calculatePricing(
  data: RegistrationPackageData, 
  dynamicRates?: DynamicRates,
  regCategories?: RegCategory[],
  spousePackages?: SpousePackage[],
  hotelRooms?: HotelRoomAdmin[],
  sponsorshipPackages?: SponsorshipPackageAdmin[],
  advertisementPackages?: AdvertisementPackageAdmin[],
  tradingTables?: TradingTableAdmin[]
): CalculatedPricing {
  // 1. Delegate Total
  let delegateTotal = 0;
  if (regCategories && regCategories.length > 0) {
    const matchedCategory = regCategories.find(c => c.id === data.delegate.membershipType || c.name.toLowerCase().includes(data.delegate.membershipType.toLowerCase()));
    if (matchedCategory) {
      delegateTotal = matchedCategory.price;
    } else {
      delegateTotal = data.delegate.membershipType === 'member' ? 25000 : 30000;
    }
  } else if (dynamicRates) {
    delegateTotal = data.delegate.membershipType === 'member'
      ? dynamicRates.delegateMember
      : dynamicRates.delegateNonMember;
  } else {
    delegateTotal = data.delegate.membershipType === 'member' 
      ? DELEGATE_PRICING.member 
      : DELEGATE_PRICING.non_member;
  }

  // 2. Spouse Total
  let spouseCount = 0;
  if (data.spouse.enabled) {
    if (data.spouse.list && data.spouse.list.length > 0) {
      spouseCount = data.spouse.list.length;
    } else {
      spouseCount = 1;
    }
  }
  let spouseFeeRate = SPOUSE_PRICING.fee;
  if (spousePackages && spousePackages.length > 0) {
    const activeSpouse = spousePackages.find(s => s.status === 'active');
    if (activeSpouse) spouseFeeRate = activeSpouse.price;
  } else if (dynamicRates) {
    spouseFeeRate = dynamicRates.spouseFee;
  }
  const spouseTotal = data.spouse.enabled ? spouseCount * spouseFeeRate : 0;

  // 3. Stay Total
  const stayNights = data.stay.enabled ? (data.stay.nights || 2) : 0;
  let stayPerNightRate = STAY_PRICING.perNight;
  if (hotelRooms && hotelRooms.length > 0) {
    // If double room is checked or similar
    const matchedRoom = hotelRooms.find(r => r.status === 'available');
    if (matchedRoom) stayPerNightRate = matchedRoom.pricePerNight;
  } else if (dynamicRates) {
    stayPerNightRate = dynamicRates.stayPerNight;
  }
  const stayTotal = data.stay.enabled ? stayNights * stayPerNightRate : 0;

  // 4. Sponsorship & inclusions
  let sponsorshipTotal = 0;
  let sponsorIncludedTable = false;
  let sponsorIncludedAd = false;

  if (data.sponsorship.enabled && data.sponsorship.tier) {
    if (sponsorshipPackages && sponsorshipPackages.length > 0) {
      const matchedSponsor = sponsorshipPackages.find(s => s.id === data.sponsorship.tier || s.shortName.toLowerCase() === data.sponsorship.tier.toLowerCase());
      if (matchedSponsor) {
        sponsorshipTotal = matchedSponsor.price;
        sponsorIncludedTable = matchedSponsor.includedTables > 0;
        sponsorIncludedAd = matchedSponsor.includedAds > 0;
      }
    } else {
      const matchedSponsor = SPONSORSHIP_OPTIONS.find((s) => s.id === data.sponsorship.tier);
      if (matchedSponsor) {
        sponsorIncludedTable = matchedSponsor.includesTable;
        sponsorIncludedAd = matchedSponsor.includesAd !== 'none';
        
        if (dynamicRates) {
          const sponsorKey = `sponsor_${data.sponsorship.tier}` as keyof DynamicRates;
          sponsorshipTotal = (dynamicRates[sponsorKey] as number) ?? matchedSponsor.price;
        } else {
          sponsorshipTotal = matchedSponsor.price;
        }
      }
    }
  }

  // 5. Trading Table Total
  let tradingTableCount = data.tradingTable.enabled ? (data.tradingTable.quantity || 1) : 0;
  let billableTables = tradingTableCount;
  
  if (data.tradingTable.enabled && sponsorIncludedTable && data.sponsorship.useIncludedTradingTable) {
    billableTables = Math.max(0, tradingTableCount - 1);
  }
  let tablePerTableRate = TRADING_TABLE_PRICING.perTable;
  if (tradingTables && tradingTables.length > 0) {
    const activeTable = tradingTables.find(t => t.status === 'available') || tradingTables[0];
    if (activeTable && activeTable.price) {
      tablePerTableRate = activeTable.price;
    }
  } else if (dynamicRates) {
    tablePerTableRate = dynamicRates.tradingTablePerTable;
  }
  const tradingTableTotal = data.tradingTable.enabled ? billableTables * tablePerTableRate : 0;

  // 6. Exhibition Stall Total
  let exhibitionTotal = 0;
  if (data.exhibition.enabled && data.exhibition.stallType) {
    const matchedStall = STALL_OPTIONS.find((s) => s.id === data.exhibition.stallType);
    if (matchedStall) {
      if (dynamicRates) {
        const stallKey = `stall_${data.exhibition.stallType}` as keyof DynamicRates;
        exhibitionTotal = (dynamicRates[stallKey] as number) ?? matchedStall.price;
      } else {
        exhibitionTotal = matchedStall.price;
      }
    }
  }

  // 7. Advertisement Total
  let advertisementTotal = 0;
  if (data.advertisement.enabled && data.advertisement.placement) {
    if (sponsorIncludedAd && data.advertisement.useIncludedWithSponsor) {
      advertisementTotal = 0;
    } else {
      if (advertisementPackages && advertisementPackages.length > 0) {
        const matchedAd = advertisementPackages.find(a => a.id === data.advertisement.placement || a.placement === data.advertisement.placement);
        if (matchedAd) {
          advertisementTotal = matchedAd.price;
        }
      } else {
        const matchedAd = SOUVENIR_OPTIONS.find((a) => a.id === data.advertisement.placement);
        if (matchedAd) {
          if (dynamicRates) {
            const adKey = `ad_${data.advertisement.placement}` as keyof DynamicRates;
            advertisementTotal = (dynamicRates[adKey] as number) ?? matchedAd.price;
          } else {
            advertisementTotal = matchedAd.price;
          }
        }
      }
    }
  }

  const grandTotal = 
    delegateTotal + 
    spouseTotal + 
    stayTotal + 
    tradingTableTotal + 
    exhibitionTotal + 
    sponsorshipTotal + 
    advertisementTotal;

  return {
    delegateTotal,
    spouseTotal,
    spouseCount,
    stayNights,
    stayTotal,
    tradingTableCount,
    tradingTableTotal,
    exhibitionTotal,
    sponsorshipTotal,
    advertisementTotal,
    subtotal: grandTotal,
    deductionsTotal: 0,
    grandTotal,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateApplicationId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ISC27-${randomNum}`;
}

export function generateTicketId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ISC27-TKT-${randomNum}`;
}

