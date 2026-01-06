'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Snowflake, LogOut, User, Truck, Building2 } from 'lucide-react';
import NotificationCenter from '@/components/communication/NotificationCenter';

export default function Header() {
  const router = useRouter();
  const { role, currentCustomer, currentOperator, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Get user info based on role
  const getUserInfo = () => {
    if (role === 'customer' && currentCustomer) {
      return {
        name: currentCustomer.name,
        avatarUrl: currentCustomer.avatarUrl,
      };
    }
    if (role === 'operator' && currentOperator) {
      return {
        name: currentOperator.name,
        avatarUrl: currentOperator.avatarUrl,
      };
    }
    if (role === 'owner') {
      return {
        name: 'Admin',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      };
    }
    return { name: 'User', avatarUrl: undefined };
  };

  const { name: userName, avatarUrl } = getUserInfo();
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('');

  const getRoleIcon = () => {
    switch (role) {
      case 'customer':
        return <User className="w-4 h-4" />;
      case 'operator':
        return <Truck className="w-4 h-4" />;
      case 'owner':
        return <Building2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'customer':
        return 'Customer';
      case 'operator':
        return 'Operator';
      case 'owner':
        return 'Owner';
      default:
        return '';
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'customer':
        return 'bg-[var(--color-teal)]/10 text-[var(--color-teal)]';
      case 'operator':
        return 'bg-[var(--color-amber)]/10 text-[var(--color-amber)]';
      case 'owner':
        return 'bg-[var(--color-navy)]/10 text-[var(--color-navy)]';
      default:
        return '';
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-navy)] flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-[var(--color-deep-navy)]">
              SnowClear
            </span>
          </div>

          {/* Role Badge & User */}
          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <div
              className={`
                hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                ${getRoleColor()}
              `}
            >
              {getRoleIcon()}
              {getRoleLabel()}
            </div>

            {/* Notifications */}
            <NotificationCenter />

            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-[var(--color-border)]">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-[var(--color-secondary)] text-[var(--color-foreground)] text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-[var(--color-foreground)]">
                {userName}
              </span>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
