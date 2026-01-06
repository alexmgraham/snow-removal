export type DrivewayType = 'paved' | 'gravel' | 'concrete' | 'asphalt';
export type DrivewayShape = 'straight' | 'curved' | 'circular' | 'l-shaped';
export type SaltPreference = 'yes' | 'no' | 'eco-friendly';
export type PileLocation = 'left' | 'right' | 'end' | 'custom';

export interface PropertyObstacle {
  id: string;
  type: 'basketball_hoop' | 'decorations' | 'vehicle' | 'planter' | 'mailbox' | 'light_post' | 'other';
  description: string;
  location: string; // e.g., "left side", "end of driveway"
}

export interface PropertyDimensions {
  length: number; // feet
  width: number; // feet
  area: number; // square feet
  isSloped: boolean;
  slopeDirection?: 'up' | 'down';
  slopeGrade?: 'mild' | 'moderate' | 'steep';
}

export interface PropertyPhoto {
  id: string;
  url: string;
  caption: string;
  type: 'driveway' | 'obstacle' | 'overview' | 'access';
  uploadedAt: string;
}

export interface AccessInstructions {
  gateCode?: string;
  accessNotes?: string;
  preferredEntrance?: string;
  parkingInstructions?: string;
}

export interface CustomerPreferences {
  saltUsage: SaltPreference;
  pileLocation: PileLocation;
  customPileLocation?: string;
  clearSidewalk: boolean;
  clearPathToMailbox: boolean;
  clearPathToDoor: boolean;
  specialInstructions?: string;
  preferredTime?: 'early_morning' | 'morning' | 'afternoon' | 'flexible';
}

export interface PropertyDetails {
  customerId: string;
  drivewayType: DrivewayType;
  drivewayShape: DrivewayShape;
  dimensions: PropertyDimensions;
  obstacles: PropertyObstacle[];
  photos: PropertyPhoto[];
  access: AccessInstructions;
  preferences: CustomerPreferences;
  difficultyRating: 1 | 2 | 3 | 4 | 5; // 1 = easy, 5 = very difficult
  estimatedClearTime: number; // minutes
  lastServiceDate?: string;
  notes: string;
}

