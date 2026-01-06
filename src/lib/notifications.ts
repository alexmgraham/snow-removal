import type { Job, Operator, Customer } from '@/types';

export type NotificationType = 
  | 'job_started'
  | 'job_completed'
  | 'eta_update'
  | 'weather_alert'
  | 'message'
  | 'photo_uploaded'
  | 'priority_changed'
  | 'operator_assigned';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: {
    jobId?: string;
    operatorId?: string;
    customerId?: string;
    imageUrl?: string;
    eta?: number;
  };
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderType: 'customer' | 'operator' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
  read: boolean;
}

// Mock notifications for different roles
export const getNotificationsForCustomer = (customerId: string): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: 'notif-c-001',
      type: 'operator_assigned',
      title: 'Operator Assigned',
      message: 'Tom Bradley has been assigned to your service today.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'notif-c-002',
      type: 'eta_update',
      title: 'ETA Updated',
      message: 'Your plow will arrive in approximately 45 minutes.',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      read: true,
      data: { eta: 45 },
    },
    {
      id: 'notif-c-003',
      type: 'weather_alert',
      title: 'Winter Storm Warning',
      message: 'Heavy snow expected. Service times may be extended.',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'notif-c-004',
      type: 'message',
      title: 'Message from Tom',
      message: 'On my way to your location now!',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
      read: false,
      data: { operatorId: 'op-001' },
    },
  ];
};

export const getNotificationsForOperator = (operatorId: string): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: 'notif-o-001',
      type: 'weather_alert',
      title: 'Winter Storm Warning',
      message: 'Heavy snow expected. Plan for extended service times.',
      timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'notif-o-002',
      type: 'priority_changed',
      title: 'Priority Job Added',
      message: 'Robert Kim upgraded to Priority service.',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      read: false,
      data: { jobId: 'job-008', customerId: 'cust-008' },
    },
    {
      id: 'notif-o-003',
      type: 'message',
      title: 'Message from Emily',
      message: 'Can you also clear the path to my side door?',
      timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
      read: false,
      data: { customerId: 'cust-003', jobId: 'job-003' },
    },
  ];
};

export const getNotificationsForOwner = (): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: 'notif-ow-001',
      type: 'weather_alert',
      title: 'Winter Storm Warning',
      message: 'Heavy snow expected. Auto-dispatch activated.',
      timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'notif-ow-002',
      type: 'job_completed',
      title: 'Job Completed',
      message: 'Tom Bradley completed job for Sarah Mitchell.',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      read: true,
      data: { jobId: 'job-001', operatorId: 'op-001' },
    },
    {
      id: 'notif-ow-003',
      type: 'priority_changed',
      title: 'Priority Upgrade',
      message: 'Robert Kim upgraded to Priority service (+$30).',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      read: false,
      data: { jobId: 'job-008' },
    },
    {
      id: 'notif-ow-004',
      type: 'operator_assigned',
      title: 'Operator Status Change',
      message: 'Jessica Wong is now offline.',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      read: false,
      data: { operatorId: 'op-004' },
    },
  ];
};

// Mock chat messages for a job
export const getChatMessages = (jobId: string): ChatMessage[] => {
  const now = new Date();
  
  const messages: Record<string, ChatMessage[]> = {
    'job-003': [
      {
        id: 'msg-001',
        jobId: 'job-003',
        senderId: 'system',
        senderType: 'system',
        senderName: 'System',
        content: 'Chat started for your snow removal service.',
        timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
        type: 'system',
        read: true,
      },
      {
        id: 'msg-002',
        jobId: 'job-003',
        senderId: 'op-001',
        senderType: 'operator',
        senderName: 'Tom Bradley',
        content: 'Hi! I\'m on my way to your location. Should be there in about 20 minutes.',
        timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        type: 'text',
        read: true,
      },
      {
        id: 'msg-003',
        jobId: 'job-003',
        senderId: 'cust-003',
        senderType: 'customer',
        senderName: 'Emily Rodriguez',
        content: 'Great! Can you also clear the path to my side door? I use that entrance.',
        timestamp: new Date(now.getTime() - 40 * 60 * 1000).toISOString(),
        type: 'text',
        read: true,
      },
      {
        id: 'msg-004',
        jobId: 'job-003',
        senderId: 'op-001',
        senderType: 'operator',
        senderName: 'Tom Bradley',
        content: 'Of course! I\'ll make sure to clear that as well.',
        timestamp: new Date(now.getTime() - 38 * 60 * 1000).toISOString(),
        type: 'text',
        read: true,
      },
      {
        id: 'msg-005',
        jobId: 'job-003',
        senderId: 'system',
        senderType: 'system',
        senderName: 'System',
        content: 'Tom Bradley has arrived and started clearing.',
        timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
        type: 'system',
        read: true,
      },
    ],
  };
  
  return messages[jobId] || [
    {
      id: `msg-default-${jobId}`,
      jobId,
      senderId: 'system',
      senderType: 'system',
      senderName: 'System',
      content: 'Chat started for your snow removal service.',
      timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      type: 'system',
      read: true,
    },
  ];
};

// Format notification time
export const formatNotificationTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get notification icon
export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    job_started: '🚀',
    job_completed: '✅',
    eta_update: '🕐',
    weather_alert: '⚠️',
    message: '💬',
    photo_uploaded: '📷',
    priority_changed: '⚡',
    operator_assigned: '👷',
  };
  return icons[type];
};

