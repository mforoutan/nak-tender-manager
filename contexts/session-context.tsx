"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SessionUser } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SessionContextType {
  user: SessionUser | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: (refreshFields?: string[]) => Promise<SessionUser | null>;
  fetchSession: () => Promise<SessionUser | null>;
  accountVerificationTask: SessionUser['accountVerificationTask'] | undefined;
  processParticipation: SessionUser['processParticipation'] | undefined;
  contractorId: number | undefined;
  companyStatus: number | undefined;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/verify');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        toast.error('لطفا وارد حساب کاربری خود شوید');
        router.push('/auth');
        return null;
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('خطا در دریافت اطلاعات کاربر');
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const refreshSession = useCallback(async (refreshFields?: string[]) => {
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
        return data.user;
      } else {
        setError('خطا در به‌روزرسانی اطلاعات');
        return null;
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
      setError('خطا در به‌روزرسانی اطلاعات');
      return null;
    }
  }, []);

  // Fetch session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const value: SessionContextType = {
    user,
    isLoading,
    error,
    refreshSession,
    fetchSession,
    accountVerificationTask: user?.accountVerificationTask,
    processParticipation: user?.processParticipation,
    contractorId: user?.contractorId,
    companyStatus: user?.companyStatus,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
