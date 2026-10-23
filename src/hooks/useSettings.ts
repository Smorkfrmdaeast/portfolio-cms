import { useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '../types';
import { initialSettings } from '../lib/initialData';
import { settingsRepository } from '../lib/repository';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsRepository.get();
      setSettings(data);
    } catch (err: unknown) {
      console.error('Failed to load settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    try {
      const updated = await settingsRepository.update(updates);
      setSettings(updated);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      setError(msg);
      throw err;
    }
  }, []);

  const resetSettings = useCallback(async () => {
    await settingsRepository.resetToDefaults();
    await fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    refetch: fetchSettings,
  };
}
