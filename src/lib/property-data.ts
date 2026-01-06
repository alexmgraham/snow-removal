import type { PropertyDetails, PropertyPhoto, PropertyObstacle } from '@/types/property';

// Mock property photos - using placeholder images
const mockPhotos: Record<string, PropertyPhoto[]> = {
  'cust-001': [
    {
      id: 'photo-001-1',
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      caption: 'Front view of driveway',
      type: 'overview',
      uploadedAt: '2025-12-01T10:00:00Z',
    },
    {
      id: 'photo-001-2',
      url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop',
      caption: 'Driveway entrance',
      type: 'driveway',
      uploadedAt: '2025-12-01T10:00:00Z',
    },
  ],
  'cust-002': [
    {
      id: 'photo-002-1',
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      caption: 'Long driveway overview',
      type: 'overview',
      uploadedAt: '2025-12-02T10:00:00Z',
    },
  ],
  'cust-003': [
    {
      id: 'photo-003-1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
      caption: 'Corner lot overview',
      type: 'overview',
      uploadedAt: '2025-12-03T10:00:00Z',
    },
    {
      id: 'photo-003-2',
      url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop',
      caption: 'Sidewalk to clear',
      type: 'access',
      uploadedAt: '2025-12-03T10:00:00Z',
    },
  ],
};

// Mock property details for each customer
export const mockPropertyDetails: PropertyDetails[] = [
  {
    customerId: 'cust-001',
    drivewayType: 'concrete',
    drivewayShape: 'straight',
    dimensions: {
      length: 40,
      width: 12,
      area: 480,
      isSloped: false,
    },
    obstacles: [],
    photos: mockPhotos['cust-001'] || [],
    access: {
      parkingInstructions: 'Can pull into driveway to turn around',
    },
    preferences: {
      saltUsage: 'yes',
      pileLocation: 'left',
      clearSidewalk: true,
      clearPathToMailbox: true,
      clearPathToDoor: true,
      preferredTime: 'early_morning',
    },
    difficultyRating: 1,
    estimatedClearTime: 12,
    lastServiceDate: '2025-01-05T07:30:00Z',
    notes: 'Regular customer, straightforward driveway',
  },
  {
    customerId: 'cust-002',
    drivewayType: 'asphalt',
    drivewayShape: 'curved',
    dimensions: {
      length: 80,
      width: 14,
      area: 1120,
      isSloped: true,
      slopeDirection: 'up',
      slopeGrade: 'mild',
    },
    obstacles: [
      {
        id: 'obs-002-1',
        type: 'light_post',
        description: 'Solar light post at curve',
        location: 'Midway, left side',
      },
    ],
    photos: mockPhotos['cust-002'] || [],
    access: {
      accessNotes: 'Long driveway with turnaround area at top',
      parkingInstructions: 'Turnaround area at top of driveway',
    },
    preferences: {
      saltUsage: 'eco-friendly',
      pileLocation: 'end',
      clearSidewalk: false,
      clearPathToMailbox: true,
      clearPathToDoor: true,
      preferredTime: 'morning',
    },
    difficultyRating: 3,
    estimatedClearTime: 18,
    lastServiceDate: '2025-01-05T06:50:00Z',
    notes: 'Long driveway, takes extra time. Watch for light post.',
  },
  {
    customerId: 'cust-003',
    drivewayType: 'paved',
    drivewayShape: 'l-shaped',
    dimensions: {
      length: 50,
      width: 12,
      area: 600,
      isSloped: false,
    },
    obstacles: [
      {
        id: 'obs-003-1',
        type: 'planter',
        description: 'Stone planters along edge',
        location: 'Both sides of driveway',
      },
    ],
    photos: mockPhotos['cust-003'] || [],
    access: {
      accessNotes: 'Corner lot with extra sidewalk',
      parkingInstructions: 'Street parking only',
    },
    preferences: {
      saltUsage: 'yes',
      pileLocation: 'right',
      clearSidewalk: true,
      clearPathToMailbox: true,
      clearPathToDoor: true,
      specialInstructions: 'Please clear sidewalk on both street sides',
      preferredTime: 'flexible',
    },
    difficultyRating: 2,
    estimatedClearTime: 20,
    lastServiceDate: '2025-01-05T07:15:00Z',
    notes: 'Corner lot - extra sidewalk clearing required',
  },
  {
    customerId: 'cust-004',
    drivewayType: 'concrete',
    drivewayShape: 'straight',
    dimensions: {
      length: 35,
      width: 10,
      area: 350,
      isSloped: false,
    },
    obstacles: [],
    photos: [],
    access: {},
    preferences: {
      saltUsage: 'yes',
      pileLocation: 'left',
      clearSidewalk: true,
      clearPathToMailbox: false,
      clearPathToDoor: true,
      preferredTime: 'early_morning',
    },
    difficultyRating: 1,
    estimatedClearTime: 10,
    notes: 'Simple, straightforward job',
  },
  {
    customerId: 'cust-005',
    drivewayType: 'gravel',
    drivewayShape: 'straight',
    dimensions: {
      length: 45,
      width: 12,
      area: 540,
      isSloped: true,
      slopeDirection: 'down',
      slopeGrade: 'mild',
    },
    obstacles: [],
    photos: [],
    access: {
      accessNotes: 'Gravel driveway - use caution to avoid scraping',
    },
    preferences: {
      saltUsage: 'no',
      pileLocation: 'left',
      clearSidewalk: false,
      clearPathToMailbox: true,
      clearPathToDoor: false,
      specialInstructions: 'DO NOT use salt - damages gravel. Keep blade slightly raised.',
      preferredTime: 'afternoon',
    },
    difficultyRating: 2,
    estimatedClearTime: 14,
    notes: 'Gravel driveway - be careful with plow height',
  },
  {
    customerId: 'cust-006',
    drivewayType: 'concrete',
    drivewayShape: 'circular',
    dimensions: {
      length: 60,
      width: 12,
      area: 720,
      isSloped: false,
    },
    obstacles: [
      {
        id: 'obs-006-1',
        type: 'basketball_hoop',
        description: 'Portable basketball hoop',
        location: 'Left side of driveway',
      },
      {
        id: 'obs-006-2',
        type: 'decorations',
        description: 'Garden gnomes along edge',
        location: 'Right side near house',
      },
    ],
    photos: [],
    access: {
      accessNotes: 'Circular driveway - enter from either side',
      parkingInstructions: 'Plenty of space in circular area',
    },
    preferences: {
      saltUsage: 'yes',
      pileLocation: 'custom',
      customPileLocation: 'Center island of circular driveway',
      clearSidewalk: true,
      clearPathToMailbox: true,
      clearPathToDoor: true,
      preferredTime: 'morning',
    },
    difficultyRating: 3,
    estimatedClearTime: 18,
    notes: 'Watch for basketball hoop - moveable but heavy. Gnomes should be moved by owner.',
  },
  {
    customerId: 'cust-007',
    drivewayType: 'asphalt',
    drivewayShape: 'straight',
    dimensions: {
      length: 30,
      width: 10,
      area: 300,
      isSloped: false,
    },
    obstacles: [],
    photos: [],
    access: {},
    preferences: {
      saltUsage: 'yes',
      pileLocation: 'right',
      clearSidewalk: true,
      clearPathToMailbox: true,
      clearPathToDoor: true,
      preferredTime: 'early_morning',
    },
    difficultyRating: 1,
    estimatedClearTime: 10,
    notes: 'Small, easy driveway',
  },
  {
    customerId: 'cust-008',
    drivewayType: 'concrete',
    drivewayShape: 'straight',
    dimensions: {
      length: 38,
      width: 12,
      area: 456,
      isSloped: true,
      slopeDirection: 'up',
      slopeGrade: 'moderate',
    },
    obstacles: [
      {
        id: 'obs-008-1',
        type: 'vehicle',
        description: 'May have car parked',
        location: 'Top of driveway near garage',
      },
    ],
    photos: [],
    access: {
      accessNotes: 'Elderly homeowner - please be extra careful and thorough',
      parkingInstructions: 'Check if car is in driveway before starting',
    },
    preferences: {
      saltUsage: 'yes',
      pileLocation: 'left',
      clearSidewalk: true,
      clearPathToMailbox: true,
      clearPathToDoor: true,
      specialInstructions: 'Please ensure path to front door is completely clear and salted',
      preferredTime: 'morning',
    },
    difficultyRating: 2,
    estimatedClearTime: 15,
    notes: 'Elderly homeowner - prioritize safety. Make sure all walking paths are clear and salted.',
  },
];

// Get property details by customer ID
export const getPropertyDetails = (customerId: string): PropertyDetails | undefined => {
  return mockPropertyDetails.find((p) => p.customerId === customerId);
};

// Get formatted difficulty label
export const getDifficultyLabel = (rating: 1 | 2 | 3 | 4 | 5): string => {
  const labels = {
    1: 'Easy',
    2: 'Moderate',
    3: 'Challenging',
    4: 'Difficult',
    5: 'Very Difficult',
  };
  return labels[rating];
};

// Get difficulty color
export const getDifficultyColor = (rating: 1 | 2 | 3 | 4 | 5): string => {
  const colors = {
    1: 'text-green-600 bg-green-100',
    2: 'text-emerald-600 bg-emerald-100',
    3: 'text-amber-600 bg-amber-100',
    4: 'text-orange-600 bg-orange-100',
    5: 'text-red-600 bg-red-100',
  };
  return colors[rating];
};

// Format obstacle type for display
export const formatObstacleType = (type: PropertyObstacle['type']): string => {
  const labels: Record<PropertyObstacle['type'], string> = {
    basketball_hoop: 'Basketball Hoop',
    decorations: 'Yard Decorations',
    vehicle: 'Parked Vehicle',
    planter: 'Planter',
    mailbox: 'Mailbox',
    light_post: 'Light Post',
    other: 'Other',
  };
  return labels[type];
};

// Format salt preference for display
export const formatSaltPreference = (pref: PropertyDetails['preferences']['saltUsage']): string => {
  const labels = {
    yes: 'Use Salt',
    no: 'No Salt',
    'eco-friendly': 'Eco-Friendly Salt Only',
  };
  return labels[pref];
};

// Format pile location for display
export const formatPileLocation = (
  location: PropertyDetails['preferences']['pileLocation'],
  custom?: string
): string => {
  if (location === 'custom' && custom) return custom;
  const labels = {
    left: 'Left Side',
    right: 'Right Side',
    end: 'End of Driveway',
    custom: 'Custom Location',
  };
  return labels[location];
};

