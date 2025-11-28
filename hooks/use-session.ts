"use client"

import { useState, useEffect, useCallback } from 'react';
import { SessionUser } from '@/types';

interface UseSessionOptions {
  autoFetch?: boolean;
  onSessionChange?: (user: SessionUser | null) => void;
}

/**
 * Custom hook to manage session data
 * Provides session user data and methods to refresh specific fields
 */
export function useSession(options: UseSessionOptions = {}) {
  const { autoFetch = true, onSessionChange } = options;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/verify');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        onSessionChange?.(data.user);
        return data.user;
      } else {
        setUser(null);
        onSessionChange?.(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('خطا در دریافت اطلاعات کاربر');
      setUser(null);
      onSessionChange?.(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onSessionChange]);

  const refreshSession = useCallback(async (refreshFields?: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/refresh-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshFields }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        onSessionChange?.(data.user);
        return data.user;
      } else {
        setError('خطا در به‌روزرسانی اطلاعات');
        return null;
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
      setError('خطا در به‌روزرسانی اطلاعات');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onSessionChange]);

  useEffect(() => {
    if (autoFetch) {
      fetchSession();
    }
  }, [autoFetch, fetchSession]);

  return {
    user,
    isLoading,
    error,
    fetchSession,
    refreshSession,
    // Convenience getters
    accountTask: user?.accountTask,
    processParticipation: user?.processParticipation,
    contractorId: user?.contractorId,
  };
}
