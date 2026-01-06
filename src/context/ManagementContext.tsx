'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { 
  Customer, 
  Operator, 
  PricingTier, 
  ServiceZone, 
  Subscription,
  CustomerWithSubscription,
  OperatorWithSchedule,
  WeeklySchedule,
  Job
} from '@/types';
import { mockCustomers, mockOperators, pricingTiers as defaultPricingTiers, mockJobs } from '@/lib/mock-data';

const STORAGE_KEY = 'snowclear-management';

// Default service zones for Tahoe area
const defaultZones: ServiceZone[] = [
  { id: 'zone-1', name: 'North Tahoe', description: 'Tahoe City, Kings Beach, Incline Village' },
  { id: 'zone-2', name: 'South Lake', description: 'South Lake Tahoe, Stateline' },
  { id: 'zone-3', name: 'Truckee', description: 'Downtown Truckee, Donner Lake' },
  { id: 'zone-4', name: 'West Shore', description: 'Homewood, Tahoma, Meeks Bay' },
];

// Default weekly schedule (Mon-Fri)
const defaultSchedule: WeeklySchedule = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

interface ManagementState {
  customers: CustomerWithSubscription[];
  operators: OperatorWithSchedule[];
  pricingTiers: PricingTier[];
  zones: ServiceZone[];
  jobs: Job[];
}

interface ManagementContextType {
  // State
  customers: CustomerWithSubscription[];
  operators: OperatorWithSchedule[];
  pricingTiers: PricingTier[];
  zones: ServiceZone[];
  jobs: Job[];
  isLoaded: boolean;

  // Customer actions
  addCustomer: (customer: Omit<CustomerWithSubscription, 'id'>) => void;
  updateCustomer: (id: string, updates: Partial<CustomerWithSubscription>) => void;
  deleteCustomer: (id: string) => void;
  toggleSubscription: (customerId: string) => void;

  // Operator actions
  addOperator: (operator: Omit<OperatorWithSchedule, 'id'>) => void;
  updateOperator: (id: string, updates: Partial<OperatorWithSchedule>) => void;
  deleteOperator: (id: string) => void;
  assignZone: (operatorId: string, zoneId: string | undefined) => void;
  updateSchedule: (operatorId: string, schedule: WeeklySchedule) => void;

  // Pricing actions
  updatePricingTier: (tierId: string, updates: Partial<PricingTier>) => void;
  resetPricing: () => void;

  // Zone actions
  addZone: (zone: Omit<ServiceZone, 'id'>) => void;
  updateZone: (id: string, updates: Partial<ServiceZone>) => void;
  deleteZone: (id: string) => void;

  // Utility
  getCustomerById: (id: string) => CustomerWithSubscription | undefined;
  getOperatorById: (id: string) => OperatorWithSchedule | undefined;
  getZoneById: (id: string) => ServiceZone | undefined;
  getJobsForCustomer: (customerId: string) => Job[];
  getJobsForOperator: (operatorId: string) => Job[];
}

const ManagementContext = createContext<ManagementContextType | undefined>(undefined);

// Initialize customers with subscription data
function initializeCustomers(): CustomerWithSubscription[] {
  return mockCustomers.map((customer, index) => ({
    ...customer,
    subscription: index < 3 ? {
      active: true,
      plan: 'seasonal',
      seasonalPrice: 2000,
      startDate: '2025-11-01',
      endDate: '2026-04-30',
    } : undefined,
    totalSpent: Math.floor(Math.random() * 2000) + 500,
  }));
}

// Initialize operators with zone and schedule data
function initializeOperators(): OperatorWithSchedule[] {
  return mockOperators.map((operator, index) => ({
    ...operator,
    zoneId: defaultZones[index % defaultZones.length].id,
    schedule: { ...defaultSchedule },
  }));
}

export function ManagementProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ManagementState>({
    customers: [],
    operators: [],
    pricingTiers: [],
    zones: [],
    jobs: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage or initialize with defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          customers: parsed.customers || initializeCustomers(),
          operators: parsed.operators || initializeOperators(),
          pricingTiers: parsed.pricingTiers || [...defaultPricingTiers],
          zones: parsed.zones || [...defaultZones],
          jobs: parsed.jobs || [...mockJobs],
        });
      } else {
        setState({
          customers: initializeCustomers(),
          operators: initializeOperators(),
          pricingTiers: [...defaultPricingTiers],
          zones: [...defaultZones],
          jobs: [...mockJobs],
        });
      }
    } catch (e) {
      console.error('Failed to load management data:', e);
      setState({
        customers: initializeCustomers(),
        operators: initializeOperators(),
        pricingTiers: [...defaultPricingTiers],
        zones: [...defaultZones],
        jobs: [...mockJobs],
      });
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save management data:', e);
      }
    }
  }, [state, isLoaded]);

  // Generate unique IDs
  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Customer actions
  const addCustomer = useCallback((customer: Omit<CustomerWithSubscription, 'id'>) => {
    const newCustomer: CustomerWithSubscription = {
      ...customer,
      id: generateId('cust'),
      totalSpent: 0,
    };
    setState(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
  }, []);

  const updateCustomer = useCallback((id: string, updates: Partial<CustomerWithSubscription>) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== id),
    }));
  }, []);

  const toggleSubscription = useCallback((customerId: string) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.map(c => {
        if (c.id !== customerId) return c;
        const currentSub = c.subscription;
        if (currentSub?.active) {
          return { ...c, subscription: { ...currentSub, active: false } };
        } else {
          return {
            ...c,
            subscription: {
              active: true,
              plan: 'seasonal',
              seasonalPrice: 2000,
              startDate: new Date().toISOString().split('T')[0],
              endDate: '2026-04-30',
            },
          };
        }
      }),
    }));
  }, []);

  // Operator actions
  const addOperator = useCallback((operator: Omit<OperatorWithSchedule, 'id'>) => {
    const newOperator: OperatorWithSchedule = {
      ...operator,
      id: generateId('op'),
      schedule: operator.schedule || { ...defaultSchedule },
    };
    setState(prev => ({ ...prev, operators: [...prev.operators, newOperator] }));
  }, []);

  const updateOperator = useCallback((id: string, updates: Partial<OperatorWithSchedule>) => {
    setState(prev => ({
      ...prev,
      operators: prev.operators.map(o => o.id === id ? { ...o, ...updates } : o),
    }));
  }, []);

  const deleteOperator = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      operators: prev.operators.filter(o => o.id !== id),
    }));
  }, []);

  const assignZone = useCallback((operatorId: string, zoneId: string | undefined) => {
    setState(prev => ({
      ...prev,
      operators: prev.operators.map(o => o.id === operatorId ? { ...o, zoneId } : o),
    }));
  }, []);

  const updateSchedule = useCallback((operatorId: string, schedule: WeeklySchedule) => {
    setState(prev => ({
      ...prev,
      operators: prev.operators.map(o => o.id === operatorId ? { ...o, schedule } : o),
    }));
  }, []);

  // Pricing actions
  const updatePricingTier = useCallback((tierId: string, updates: Partial<PricingTier>) => {
    setState(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map(t => t.id === tierId ? { ...t, ...updates } : t),
    }));
  }, []);

  const resetPricing = useCallback(() => {
    setState(prev => ({ ...prev, pricingTiers: [...defaultPricingTiers] }));
  }, []);

  // Zone actions
  const addZone = useCallback((zone: Omit<ServiceZone, 'id'>) => {
    const newZone: ServiceZone = { ...zone, id: generateId('zone') };
    setState(prev => ({ ...prev, zones: [...prev.zones, newZone] }));
  }, []);

  const updateZone = useCallback((id: string, updates: Partial<ServiceZone>) => {
    setState(prev => ({
      ...prev,
      zones: prev.zones.map(z => z.id === id ? { ...z, ...updates } : z),
    }));
  }, []);

  const deleteZone = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      zones: prev.zones.filter(z => z.id !== id),
      // Clear zone assignment from operators
      operators: prev.operators.map(o => o.zoneId === id ? { ...o, zoneId: undefined } : o),
    }));
  }, []);

  // Utility functions
  const getCustomerById = useCallback((id: string) => {
    return state.customers.find(c => c.id === id);
  }, [state.customers]);

  const getOperatorById = useCallback((id: string) => {
    return state.operators.find(o => o.id === id);
  }, [state.operators]);

  const getZoneById = useCallback((id: string) => {
    return state.zones.find(z => z.id === id);
  }, [state.zones]);

  const getJobsForCustomer = useCallback((customerId: string) => {
    return state.jobs.filter(j => j.customerId === customerId);
  }, [state.jobs]);

  const getJobsForOperator = useCallback((operatorId: string) => {
    return state.jobs.filter(j => j.operatorId === operatorId);
  }, [state.jobs]);

  const value: ManagementContextType = {
    customers: state.customers,
    operators: state.operators,
    pricingTiers: state.pricingTiers,
    zones: state.zones,
    jobs: state.jobs,
    isLoaded,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleSubscription,
    addOperator,
    updateOperator,
    deleteOperator,
    assignZone,
    updateSchedule,
    updatePricingTier,
    resetPricing,
    addZone,
    updateZone,
    deleteZone,
    getCustomerById,
    getOperatorById,
    getZoneById,
    getJobsForCustomer,
    getJobsForOperator,
  };

  return (
    <ManagementContext.Provider value={value}>
      {children}
    </ManagementContext.Provider>
  );
}

export function useManagement(): ManagementContextType {
  const context = useContext(ManagementContext);
  if (context === undefined) {
    throw new Error('useManagement must be used within a ManagementProvider');
  }
  return context;
}

