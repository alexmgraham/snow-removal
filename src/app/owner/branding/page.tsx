'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBranding, DEFAULT_BRANDING } from '@/context/BrandingContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Type, 
  Image, 
  RotateCcw, 
  Check, 
  Snowflake,
  ArrowLeft,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function BrandingPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const { branding, updateBranding, resetBranding, isLoaded } = useBranding();
  
  // Local state for form (allows preview before save)
  const [localBranding, setLocalBranding] = useState(branding);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Redirect if not authenticated or wrong role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (role !== 'owner') {
      router.push(role === 'customer' ? '/customer' : '/operator');
    }
  }, [isAuthenticated, role, router]);

  // Sync local state with context when loaded
  useEffect(() => {
    if (isLoaded) {
      setLocalBranding(branding);
    }
  }, [branding, isLoaded]);

  // Track changes
  useEffect(() => {
    const changed = 
      localBranding.companyName !== branding.companyName ||
      localBranding.logoUrl !== branding.logoUrl ||
      localBranding.primaryColor !== branding.primaryColor ||
      localBranding.accentColor !== branding.accentColor;
    setHasChanges(changed);
  }, [localBranding, branding]);

  const handleSave = () => {
    updateBranding(localBranding);
    setSaveMessage('Branding saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleReset = () => {
    resetBranding();
    setLocalBranding(DEFAULT_BRANDING);
    setSaveMessage('Branding reset to defaults');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  if (!isAuthenticated || role !== 'owner' || !isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Link */}
        <Link 
          href="/owner" 
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-navy)] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            White Label Branding
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-2">
            Customize your company&apos;s branding across the entire application
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="space-y-6">
            {/* Company Name */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Type className="w-4 h-4 text-[var(--color-teal)]" />
                  Company Name
                </CardTitle>
                <CardDescription>
                  The name displayed in the header and throughout the app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  value={localBranding.companyName}
                  onChange={(e) => setLocalBranding({ ...localBranding, companyName: e.target.value })}
                  placeholder="Your Company Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-all"
                />
              </CardContent>
            </Card>

            {/* Logo URL */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Image className="w-4 h-4 text-[var(--color-teal)]" />
                  Logo
                </CardTitle>
                <CardDescription>
                  Enter a URL to your logo image (leave empty to use default icon)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="url"
                  value={localBranding.logoUrl || ''}
                  onChange={(e) => setLocalBranding({ ...localBranding, logoUrl: e.target.value || null })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-all"
                />
                {localBranding.logoUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-secondary)]">
                    <img 
                      src={localBranding.logoUrl} 
                      alt="Logo preview" 
                      className="w-10 h-10 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <span className="text-sm text-[var(--color-muted-foreground)]">Logo preview</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Colors */}
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[var(--color-teal)]" />
                  Brand Colors
                </CardTitle>
                <CardDescription>
                  Choose your primary and accent colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primary Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-foreground)]">
                    Primary Color
                    <span className="text-[var(--color-muted-foreground)] font-normal ml-2">
                      (buttons, links, highlights)
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={localBranding.primaryColor}
                        onChange={(e) => setLocalBranding({ ...localBranding, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[var(--color-border)] overflow-hidden"
                        style={{ padding: 0 }}
                      />
                    </div>
                    <input
                      type="text"
                      value={localBranding.primaryColor}
                      onChange={(e) => setLocalBranding({ ...localBranding, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-foreground)]">
                    Accent Color
                    <span className="text-[var(--color-muted-foreground)] font-normal ml-2">
                      (warnings, emphasis, icons)
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={localBranding.accentColor}
                        onChange={(e) => setLocalBranding({ ...localBranding, accentColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[var(--color-border)] overflow-hidden"
                        style={{ padding: 0 }}
                      />
                    </div>
                    <input
                      type="text"
                      value={localBranding.accentColor}
                      onChange={(e) => setLocalBranding({ ...localBranding, accentColor: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex-1 bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-[var(--color-border)]"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className="p-3 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] text-sm font-medium text-center animate-in fade-in slide-in-from-bottom-2">
                {saveMessage}
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card className="glass border-[var(--color-border)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[var(--color-teal)]" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your branding will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Header Preview */}
                <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                  <div className="bg-white/60 backdrop-blur-sm border-b border-[var(--color-border)] px-4 py-3">
                    <div className="flex items-center gap-3">
                      {localBranding.logoUrl ? (
                        <img 
                          src={localBranding.logoUrl} 
                          alt="Logo" 
                          className="w-9 h-9 object-contain rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div 
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: localBranding.primaryColor }}
                        >
                          <Snowflake className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                      )}
                      <span className="text-xl font-semibold text-[var(--color-deep-navy)]">
                        {localBranding.companyName || 'Company Name'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--color-background)]">
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
                      Sample content preview
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        style={{ backgroundColor: localBranding.primaryColor }}
                        className="text-white"
                      >
                        Primary Button
                      </Button>
                      <Badge 
                        style={{ 
                          backgroundColor: `${localBranding.accentColor}20`,
                          color: localBranding.accentColor
                        }}
                      >
                        Accent Badge
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-[var(--color-border)]">
                    <div 
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ backgroundColor: localBranding.primaryColor }}
                    />
                    <p className="text-xs font-medium text-[var(--color-foreground)]">Primary</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] font-mono">
                      {localBranding.primaryColor}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--color-border)]">
                    <div 
                      className="w-full h-12 rounded-lg mb-2"
                      style={{ backgroundColor: localBranding.accentColor }}
                    />
                    <p className="text-xs font-medium text-[var(--color-foreground)]">Accent</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] font-mono">
                      {localBranding.accentColor}
                    </p>
                  </div>
                </div>

                {/* Usage Examples */}
                <div className="p-4 rounded-lg bg-[var(--color-secondary)]">
                  <p className="text-sm font-medium text-[var(--color-foreground)] mb-3">
                    Color Usage Examples
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: localBranding.primaryColor }}
                      />
                      <span className="text-[var(--color-muted-foreground)]">
                        Buttons, links, active states
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: localBranding.accentColor }}
                      />
                      <span className="text-[var(--color-muted-foreground)]">
                        Warnings, plow icons, emphasis
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
