import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { projectRepository } from '../lib/repository';

interface UseProjectsOptions {
  includeDrafts?: boolean;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const { includeDrafts = false } = options;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = includeDrafts
        ? await projectRepository.getAll()
        : await projectRepository.getPublished();
      setProjects(list);
    } catch (err: unknown) {
      console.error('Failed to load projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [includeDrafts]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await projectRepository.create(data);
    await fetchProjects();
    return created;
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    const updated = await projectRepository.update(id, updates);
    await fetchProjects();
    return updated;
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    await projectRepository.delete(id);
    await fetchProjects();
  }, [fetchProjects]);

  const reorderProjects = useCallback(async (orderedIds: string[]) => {
    // Optimistic UI update
    setProjects((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      const next: Project[] = [];
      orderedIds.forEach((id, index) => {
        const item = map.get(id);
        if (item) next.push({ ...item, order: index + 1 });
      });
      return next;
    });

    try {
      await projectRepository.reorder(orderedIds);
    } catch (err) {
      console.error('Failed to save order to repository:', err);
      await fetchProjects(); // rollback on error
      throw err;
    }
  }, [fetchProjects]);

  const duplicateProject = useCallback(async (id: string) => {
    const original = await projectRepository.getById(id);
    if (!original) throw new Error('Original project not found');

    const copyData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      ...original,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      order: projects.length + 1,
    };

    const created = await projectRepository.create(copyData);
    await fetchProjects();
    return created;
  }, [projects.length, fetchProjects]);

  const resetProjects = useCallback(async () => {
    await projectRepository.resetToDefaults();
    await fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    duplicateProject,
    resetProjects,
    refetch: fetchProjects,
  };
}
