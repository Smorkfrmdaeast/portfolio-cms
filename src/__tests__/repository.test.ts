import { describe, it, expect, beforeEach } from 'vitest';
import { LocalProjectRepository } from '../lib/repository/LocalRepository';

describe('LocalProjectRepository', () => {
  let repo: LocalProjectRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalProjectRepository();
  });

  it('initializes with default verified projects when empty', async () => {
    const list = await repo.getAll();
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.some((p) => p.slug === 'fintech-dashboard')).toBe(true);
  });

  it('can create a new project and assign slug if needed', async () => {
    const created = await repo.create({
      title: 'Realtime Audio Visualizer',
      slug: 'audio-visualizer',
      summary: 'Waveform canvas rendering pipeline.',
      year: '2025',
      role: 'Frontend Developer',
      tech: ['Web Audio API', 'Canvas', 'TypeScript'],
      image: '/assets/smorks-paydom-platform.jpg',
      status: 'published',
      order: 10,
      featured: true,
    });

    expect(created.id).toBeDefined();
    expect(created.slug).toBe('audio-visualizer');

    const fetched = await repo.getBySlug('audio-visualizer');
    expect(fetched).not.toBeNull();
    expect(fetched?.title).toBe('Realtime Audio Visualizer');
  });

  it('handles slug collision automatically by appending suffix', async () => {
    await repo.create({
      title: 'Duplicate Slug',
      slug: 'duplicate-test',
      summary: 'First project.',
      year: '2025',
      role: 'Dev',
      tech: ['React'],
      image: '/assets/sample.jpg',
      status: 'draft',
      order: 11,
      featured: false,
    });

    const second = await repo.create({
      title: 'Duplicate Slug 2',
      slug: 'duplicate-test',
      summary: 'Second project.',
      year: '2025',
      role: 'Dev',
      tech: ['React'],
      image: '/assets/sample.jpg',
      status: 'draft',
      order: 12,
      featured: false,
    });

    expect(second.slug).toBe('duplicate-test-1');
  });

  it('can reorder projects', async () => {
    const list = await repo.getAll();
    const id0 = list[0].id;
    const id1 = list[1].id;

    // Swap positions
    await repo.reorder([id1, id0, ...list.slice(2).map((p) => p.id)]);

    const reordered = await repo.getAll();
    expect(reordered[0].id).toBe(id1);
    expect(reordered[1].id).toBe(id0);
  });
});
