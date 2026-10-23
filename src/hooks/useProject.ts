import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { projectRepository } from '../lib/repository';

export function useProject(slugOrId?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!slugOrId) {
      setProject(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Try by slug first
      let item = await projectRepository.getBySlug(slugOrId);
      if (!item) {
        // Fallback to id
        item = await projectRepository.getById(slugOrId);
      }
      setProject(item);
    } catch (err: unknown) {
      console.error('Failed to load project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
}
