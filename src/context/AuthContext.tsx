'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole, Customer, Operator } from '@/types';
import { mockCustomers, mockOperators } from '@/lib/mock-data';

interface AuthContextType {
  role: UserRole | null;
  currentCustomer: Customer | null;
  currentOperator: Operator | null;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    
    if (newRole === 'customer') {
      // For demo, use Michael Thompson who has an en_route job
      setCurrentCustomer(mockCustomers[3]);
      setCurrentOperator(null);
    } else if (newRole === 'operator') {
      // For demo, use Tom Bradley who has active jobs
      setCurrentOperator(mockOperators[0]);
      setCurrentCustomer(null);
    } else if (newRole === 'owner') {
      // Owner doesn't need a specific customer/operator
      setCurrentCustomer(null);
      setCurrentOperator(null);
    }
  }, []);

  const logout = useCallback(() => {
    setRoleState(null);
    setCurrentCustomer(null);
    setCurrentOperator(null);
  }, []);

  const value: AuthContextType = {
    role,
    currentCustomer,
    currentOperator,
    setRole,
    logout,
    isAuthenticated: role !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
