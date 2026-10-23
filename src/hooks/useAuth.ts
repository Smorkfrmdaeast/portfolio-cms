import { useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';
import { authRepository, isUsingFirebase } from '../lib/repository';

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => authRepository.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = useCallback(async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const u = await authRepository.signInWithEmail(email, pass);
      setUser(u);
      return u;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const u = await authRepository.signInWithGoogle();
      setUser(u);
      return u;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authRepository.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user && user.isAdmin),
    loading,
    error,
    loginWithEmail,
    loginWithGoogle,
    logout,
    isUsingFirebase,
  };
}
