// src/context/NotificationContext.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    if (notification.showToast !== false) {
      const toastType = notification.type || 'info';
      toast[toastType](notification.message || notification.title);
    }

    return newNotification;
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const success = useCallback((message) => {
    return addNotification({ type: 'success', title: 'Thành công', message });
  }, [addNotification]);

  const error = useCallback((message) => {
    return addNotification({ type: 'error', title: 'Lỗi', message });
  }, [addNotification]);

  const warning = useCallback((message) => {
    return addNotification({ type: 'warning', title: 'Cảnh báo', message });
  }, [addNotification]);

  const info = useCallback((message) => {
    return addNotification({ type: 'info', title: 'Thông báo', message });
  }, [addNotification]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
