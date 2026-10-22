import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types/notification';
import { dbService } from '../services/storage/databaseService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifications = useCallback(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const list = dbService.getNotifications(user.uid);
    setNotifications(list);
  }, [user]);

  useEffect(() => {
    refreshNotifications();
    // Periodically refresh notifications
    const interval = setInterval(refreshNotifications, 8000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = (notificationId: string) => {
    dbService.markNotificationAsRead(notificationId);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    if (!user) return;
    dbService.markAllNotificationsAsRead(user.uid);
    refreshNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
