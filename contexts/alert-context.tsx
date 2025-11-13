"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertType, AlertContextType } from '@/types/alert';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((alert: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newAlert: Alert = {
      id,
      dismissible: true,
      duration: 0,
      ...alert,
    };

    setAlerts((prev) => [...prev, newAlert]);

    // Auto-dismiss if duration is set
    if (newAlert.duration && newAlert.duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, newAlert.duration);
    }
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
