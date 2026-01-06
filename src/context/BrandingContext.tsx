'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface BrandingConfig {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  companyName: 'SnowClear',
  logoUrl: null,
  primaryColor: '#0891b2', // teal-600
  accentColor: '#f59e0b',  // amber-500
};

const STORAGE_KEY = 'snowclear-branding';

interface BrandingContextType {
  branding: BrandingConfig;
  updateBranding: (updates: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
  isLoaded: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// Convert hex to oklch (simplified conversion for CSS injection)
function hexToOklch(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Convert to linear RGB
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  
  // Convert to XYZ
  const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
  const y = 0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb;
  const z = 0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb;
  
  // Convert to Lab
  const xn = 0.95047, yn = 1.0, zn = 1.08883;
  const f = (t: number) => t > 0.008856 ? Math.pow(t, 1/3) : (903.3 * t + 16) / 116;
  const L = 116 * f(y / yn) - 16;
  const a = 500 * (f(x / xn) - f(y / yn));
  const bLab = 200 * (f(y / yn) - f(z / zn));
  
  // Convert Lab to OKLab (approximate)
  const l = L / 100;
  const c = Math.sqrt(a * a + bLab * bLab) / 100;
  const h = Math.atan2(bLab, a) * 180 / Math.PI;
  const hNormalized = h < 0 ? h + 360 : h;
  
  return `oklch(${(l * 0.7 + 0.15).toFixed(2)} ${(c * 0.2).toFixed(2)} ${Math.round(hNormalized)})`;
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load branding from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBranding({ ...DEFAULT_BRANDING, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load branding from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Inject CSS custom properties when branding changes
  useEffect(() => {
    if (!isLoaded) return;

    const styleId = 'branding-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Generate color variations
    const primaryOklch = hexToOklch(branding.primaryColor);
    const accentOklch = hexToOklch(branding.accentColor);
    
    styleEl.textContent = `
      :root {
        --color-teal: ${primaryOklch};
        --color-teal-light: ${primaryOklch.replace(/oklch\(([0-9.]+)/, (_, l) => `oklch(${(parseFloat(l) + 0.13).toFixed(2)}`)};
        --ring: ${primaryOklch};
        --color-amber: ${accentOklch};
        --color-amber-bright: ${accentOklch.replace(/oklch\(([0-9.]+)/, (_, l) => `oklch(${(parseFloat(l) + 0.07).toFixed(2)}`)};
        --accent: ${accentOklch};
      }
    `;
  }, [branding, isLoaded]);

  const updateBranding = useCallback((updates: Partial<BrandingConfig>) => {
    setBranding((prev) => {
      const newBranding = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newBranding));
      } catch (e) {
        console.error('Failed to save branding to localStorage:', e);
      }
      return newBranding;
    });
  }, []);

  const resetBranding = useCallback(() => {
    setBranding(DEFAULT_BRANDING);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove branding from localStorage:', e);
    }
  }, []);

  const value: BrandingContextType = {
    branding,
    updateBranding,
    resetBranding,
    isLoaded,
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding(): BrandingContextType {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}

export { DEFAULT_BRANDING };
