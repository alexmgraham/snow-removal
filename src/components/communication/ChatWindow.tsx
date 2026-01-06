'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  X, 
  Image as ImageIcon,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { ChatMessage, getChatMessages, formatNotificationTime } from '@/lib/notifications';
import { useAuth } from '@/context/AuthContext';

interface ChatWindowProps {
  jobId: string;
  recipientName: string;
  recipientAvatar?: string;
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function ChatWindow({
  jobId,
  recipientName,
  recipientAvatar,
  onClose,
  minimized = false,
  onToggleMinimize,
}: ChatWindowProps) {
  const { role, currentCustomer, currentOperator } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    const chatMessages = getChatMessages(jobId);
    setMessages(chatMessages);
  }, [jobId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, minimized]);

  const getCurrentSender = () => {
    if (role === 'customer' && currentCustomer) {
      return {
        id: currentCustomer.id,
        name: currentCustomer.name,
        type: 'customer' as const,
      };
    }
    if (role === 'operator' && currentOperator) {
      return {
        id: currentOperator.id,
        name: currentOperator.name,
        type: 'operator' as const,
      };
    }
    return { id: 'unknown', name: 'Unknown', type: 'customer' as const };
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const sender = getCurrentSender();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      jobId,
      senderId: sender.id,
      senderType: sender.type,
      senderName: sender.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');

    // Simulate response after a delay
    setIsLoading(true);
    setTimeout(() => {
      const responseMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        jobId,
        senderId: 'system',
        senderType: sender.type === 'customer' ? 'operator' : 'customer',
        senderName: recipientName,
        content: getAutoResponse(newMessage.trim()),
        timestamp: new Date().toISOString(),
        type: 'text',
        read: false,
      };
      setMessages((prev) => [...prev, responseMsg]);
      setIsLoading(false);
    }, 2000);
  };

  const getAutoResponse = (message: string): string => {
    const responses = [
      "Got it! I'll take care of that.",
      "Thanks for letting me know!",
      "No problem, I'm on it.",
      "Sounds good, I'll make sure to do that.",
      "Understood!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sender = getCurrentSender();

  if (minimized) {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 bg-[var(--color-primary)] text-white rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
        onClick={onToggleMinimize}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{recipientName}</span>
          {messages.filter((m) => !m.read && m.senderId !== sender.id).length > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 z-50 shadow-2xl border-[var(--color-border)] flex flex-col max-h-[500px]">
      {/* Header */}
      <CardHeader className="p-3 border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recipientAvatar} alt={recipientName} />
              <AvatarFallback>{recipientName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-semibold">{recipientName}</CardTitle>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {role === 'customer' ? 'Operator' : 'Customer'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onToggleMinimize && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onToggleMinimize}>
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-3 overflow-y-auto min-h-[250px] max-h-[300px] space-y-3 bg-[var(--color-background)]">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === sender.id;
          const isSystem = message.senderType === 'system';

          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center">
                <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)]/50 px-3 py-1 rounded-full">
                  {message.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${isOwnMessage ? 'order-2' : ''}`}>
                <div
                  className={`
                    p-3 rounded-2xl text-sm
                    ${isOwnMessage
                      ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                      : 'bg-[var(--color-secondary)] rounded-bl-md'
                    }
                  `}
                >
                  {message.type === 'image' && message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Shared image"
                      className="rounded-lg mb-2 max-w-full"
                    />
                  )}
                  <p>{message.content}</p>
                </div>
                <p className={`text-[10px] text-[var(--color-muted-foreground)] mt-1 ${isOwnMessage ? 'text-right' : ''}`}>
                  {formatNotificationTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-secondary)] rounded-2xl rounded-bl-md p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--color-muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[var(--color-muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[var(--color-muted-foreground)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 flex-shrink-0">
            <ImageIcon className="w-4 h-4 text-[var(--color-muted-foreground)]" />
          </Button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm bg-[var(--color-secondary)] rounded-full border-none outline-none placeholder:text-[var(--color-muted-foreground)]"
          />
          <Button
            size="sm"
            className="h-9 w-9 p-0 rounded-full bg-[var(--color-primary)]"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

