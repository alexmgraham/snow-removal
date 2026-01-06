'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import {
  Notification,
  formatNotificationTime,
  getNotificationIcon,
  getNotificationsForCustomer,
  getNotificationsForOperator,
  getNotificationsForOwner,
} from '@/lib/notifications';
import { useAuth } from '@/context/AuthContext';

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const { role, currentCustomer, currentOperator } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications based on role
  useEffect(() => {
    let notifs: Notification[] = [];
    
    if (role === 'customer' && currentCustomer) {
      notifs = getNotificationsForCustomer(currentCustomer.id);
    } else if (role === 'operator' && currentOperator) {
      notifs = getNotificationsForOperator(currentOperator.id);
    } else if (role === 'owner') {
      notifs = getNotificationsForOwner();
    }
    
    setNotifications(notifs);
  }, [role, currentCustomer, currentOperator]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    onNotificationClick?.(notification);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-[var(--color-foreground)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[var(--color-card)] glass border border-[var(--color-border)] rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCheck className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-[var(--color-muted-foreground)]">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border)]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        p-3 cursor-pointer transition-colors
                        ${!notification.read ? 'bg-[var(--color-primary)]/5' : 'hover:bg-[var(--color-secondary)]/50'}
                      `}
                      onClick={() => handleClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="text-xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-medium text-sm ${!notification.read ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)]'}`}>
                              {notification.title}
                            </span>
                            <span className="text-xs text-[var(--color-muted-foreground)] flex-shrink-0">
                              {formatNotificationTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

