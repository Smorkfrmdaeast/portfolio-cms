import { Project, SiteSettings, AdminUser } from '../../types';
import { initialProjects, initialSettings } from '../initialData';
import { IProjectRepository, ISettingsRepository, IAuthRepository } from './types';
import { generateSlug, normalizeImagePath } from '../utils';

const PROJECTS_KEY = 'smork_portfolio_projects_v2';
const LEGACY_PROJECTS_KEY = 'smork_portfolio_projects';
const SETTINGS_KEY = 'smork_portfolio_settings_v2';
const LEGACY_SETTINGS_KEY = 'smork_portfolio_settings';
const AUTH_KEY = 'smork_portfolio_auth_user';

interface RawProjectInput {
  id?: string;
  title?: string;
  image?: string;
  tech?: string | string[];
  live?: string;
  liveUrl?: string;
  github?: string;
  githubUrl?: string;
  description?: string;
  summary?: string;
  year?: string;
  role?: string;
  status?: 'published' | 'draft';
  order?: number;
  featured?: boolean;
  sections?: {
    problem?: string;
    approach?: string;
    result?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

function getProjectSlugKey(raw: RawProjectInput): string {
  if (raw.slug && raw.slug.trim()) {
    return generateSlug(raw.slug);
  }
  if (raw.title && raw.title.trim()) {
    return generateSlug(raw.title);
  }
  if (raw.id && raw.id.trim()) {
    return generateSlug(raw.id);
  }
  return '';
}

function normalizeRawProject(raw: RawProjectInput, fallbackIndex: number): Project {
  const title = (raw.title || 'Untitled Project').trim();
  const slug = getProjectSlugKey(raw) || `project-${fallbackIndex + 1}`;
  const liveUrl = (raw.liveUrl || raw.live || '').trim();
  const githubUrl = (raw.githubUrl || raw.github || '').trim();
  const summary = (raw.summary || raw.description || 'Web application interface.').trim();

  let tech: string[] = [];
  if (Array.isArray(raw.tech)) {
    tech = raw.tech.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof raw.tech === 'string') {
    tech = raw.tech.split(',').map((t) => t.trim()).filter(Boolean);
  }
  if (tech.length === 0) {
    tech = ['HTML5', 'CSS3', 'JavaScript'];
  }

  return {
    id: raw.id || `proj_${slug}`,
    title,
    slug,
    summary,
    year: raw.year || '2024',
    role: raw.role || 'Frontend Engineering',
    tech,
    image: normalizeImagePath(raw.image || '/assets/smorks-paydom-platform.jpg'),
    liveUrl: liveUrl || undefined,
    githubUrl: githubUrl || undefined,
    status: raw.status || 'published',
    order: raw.order ?? (fallbackIndex + 1),
    featured: raw.featured ?? true,
    sections: raw.sections,
    seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export class LocalProjectRepository implements IProjectRepository {
  private getStorage(): Project[] {
    try {
      // 1. Read from v2 and legacy storage
      const storedV2 = localStorage.getItem(PROJECTS_KEY);
      const storedLegacy = localStorage.getItem(LEGACY_PROJECTS_KEY);
      const storedAlt = localStorage.getItem('portfolio_projects');

      const parsedV2: RawProjectInput[] = storedV2 ? JSON.parse(storedV2) : [];
      const parsedLegacy: RawProjectInput[] = storedLegacy ? JSON.parse(storedLegacy) : [];
      const parsedAlt: RawProjectInput[] = storedAlt ? JSON.parse(storedAlt) : [];

      // Deduplicate strictly by slug
      const projectsBySlug = new Map<string, RawProjectInput>();

      // Step A: Seed initial 6 verified projects as canonical foundation
      initialProjects.forEach((p) => {
        const slugKey = getProjectSlugKey(p);
        projectsBySlug.set(slugKey, { ...p });
      });

      // Helper to merge an incoming raw project by slug
      const mergeIncoming = (incoming: RawProjectInput) => {
        if (!incoming || typeof incoming !== 'object') return;
        const slugKey = getProjectSlugKey(incoming);
        if (!slugKey) return;

        const existing = projectsBySlug.get(slugKey);
        if (existing) {
          // Merge while prioritizing user's customized fields
          projectsBySlug.set(slugKey, {
            ...existing,
            ...incoming,
            id: existing.id || incoming.id,
            slug: slugKey,
            title: incoming.title || existing.title,
            liveUrl: incoming.liveUrl || incoming.live || existing.liveUrl || existing.live,
            githubUrl: incoming.githubUrl || incoming.github || existing.githubUrl || existing.github,
            summary: incoming.summary || incoming.description || existing.summary || existing.description,
            image: incoming.image || existing.image,
            tech: incoming.tech || existing.tech,
          });
        } else {
          // New 6th or custom project added by user
          projectsBySlug.set(slugKey, { ...incoming, slug: slugKey });
        }
      };

      // Step B: Merge V2 stored projects
      if (Array.isArray(parsedV2)) {
        parsedV2.forEach(mergeIncoming);
      }

      // Step C: Merge Legacy stored projects
      if (Array.isArray(parsedLegacy)) {
        parsedLegacy.forEach(mergeIncoming);
      }

      // Step D: Merge Alt stored projects
      if (Array.isArray(parsedAlt)) {
        parsedAlt.forEach(mergeIncoming);
      }

      if (projectsBySlug.size > 0) {
        let index = 0;
        const normalized = Array.from(projectsBySlug.values()).map((raw) =>
          normalizeRawProject(raw, index++)
        );
        // Persist deduplicated list back to localStorage
        this.saveStorage(normalized);
        return normalized;
      }
    } catch (e) {
      console.warn('Failed to parse stored projects, falling back to initial data', e);
    }
    this.saveStorage(initialProjects);
    return initialProjects;
  }

  private saveStorage(projects: Project[]): void {
    try {
      const serialized = JSON.stringify(projects);
      localStorage.setItem(PROJECTS_KEY, serialized);
      localStorage.setItem(LEGACY_PROJECTS_KEY, serialized);
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }

  async getAll(): Promise<Project[]> {
    const list = this.getStorage();
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  async getPublished(): Promise<Project[]> {
    const list = await this.getAll();
    return list.filter((p) => p.status === 'published');
  }

  async getBySlug(slug: string): Promise<Project | null> {
    const list = this.getStorage();
    const targetSlug = generateSlug(slug);
    return list.find((p) => generateSlug(p.slug) === targetSlug) || null;
  }

  async getById(id: string): Promise<Project | null> {
    const list = this.getStorage();
    return list.find((p) => p.id === id) || null;
  }

  async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const list = this.getStorage();
    const now = new Date().toISOString();

    // Ensure slug uniqueness
    const baseSlug = projectData.slug ? generateSlug(projectData.slug) : generateSlug(projectData.title);
    let slug = baseSlug;
    let counter = 1;
    while (list.some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug,
      image: normalizeImagePath(projectData.image),
      order: list.length + 1,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newProject, ...list];
    this.saveStorage(updated);
    return newProject;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    const list = this.getStorage();
    const index = list.findIndex((p) => p.id === id || p.slug === updates.slug);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }

    // Check slug uniqueness if changed
    if (updates.slug && updates.slug !== list[index].slug) {
      const exists = list.some((p) => p.id !== id && p.slug === updates.slug);
      if (exists) {
        throw new Error(`A project with slug "${updates.slug}" already exists`);
      }
    }

    const updatedItem: Project = {
      ...list[index],
      ...updates,
      image: updates.image ? normalizeImagePath(updates.image) : list[index].image,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedItem;
    this.saveStorage(list);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const list = this.getStorage();
    const filtered = list.filter((p) => p.id !== id);
    this.saveStorage(filtered);
  }

  async reorder(orderedIds: string[]): Promise<void> {
    const list = this.getStorage();
    const map = new Map(list.map((p) => [p.id, p]));
    const reordered: Project[] = [];

    orderedIds.forEach((id, index) => {
      const item = map.get(id);
      if (item) {
        reordered.push({ ...item, order: index + 1, updatedAt: new Date().toISOString() });
        map.delete(id);
      }
    });

    // Add any remaining
    map.forEach((item) => {
      reordered.push({ ...item, order: reordered.length + 1 });
    });

    this.saveStorage(reordered);
  }

  async resetToDefaults(): Promise<void> {
    this.saveStorage(initialProjects);
  }
}

export class LocalSettingsRepository implements ISettingsRepository {
  private getStorage(): SiteSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem(LEGACY_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...initialSettings,
          ...parsed,
          profilePhoto: normalizeImagePath(parsed.profilePhoto || initialSettings.profilePhoto),
        };
      }
    } catch (e) {
      console.warn('Failed to parse stored settings, falling back to defaults', e);
    }
    this.saveStorage(initialSettings);
    return initialSettings;
  }

  private saveStorage(settings: SiteSettings): void {
    try {
      const serialized = JSON.stringify(settings);
      localStorage.setItem(SETTINGS_KEY, serialized);
      localStorage.setItem(LEGACY_SETTINGS_KEY, serialized);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  async get(): Promise<SiteSettings> {
    return this.getStorage();
  }

  async update(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = this.getStorage();
    const updated: SiteSettings = {
      ...current,
      ...updates,
      profilePhoto: updates.profilePhoto ? normalizeImagePath(updates.profilePhoto) : current.profilePhoto,
      updatedAt: new Date().toISOString(),
    };
    this.saveStorage(updated);
    return updated;
  }

  async resetToDefaults(): Promise<void> {
    this.saveStorage(initialSettings);
  }
}

export class LocalAuthRepository implements IAuthRepository {
  private currentUser: AdminUser | null = null;
  private listeners: ((user: AdminUser | null) => void)[] = [];

  constructor() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  async signInWithEmail(email: string, pass: string): Promise<AdminUser> {
    const allowlisted = ['ifeanyinuels42@gmail.com', 'ifeanyinuels32@gmail.com', 'admin@smork.dev'];
    if (!allowlisted.includes(email.toLowerCase()) && !email.toLowerCase().includes('admin')) {
      throw new Error('Access denied: Account is not in the authorized administrator allowlist');
    }

    if (pass.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user: AdminUser = {
      uid: 'local-admin-' + btoa(email),
      email: email.toLowerCase(),
      displayName: 'Ifeanyi Nnamani (Admin)',
      isAdmin: true,
    };

    this.currentUser = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    this.notify();
    return user;
  }

  async signInWithGoogle(): Promise<AdminUser> {
    const user: AdminUser = {
      uid: 'local-google-admin',
      email: 'ifeanyinuels42@gmail.com',
      displayName: 'Ifeanyi Nnamani',
      isAdmin: true,
    };
    this.currentUser = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    this.notify();
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    this.notify();
  }

  isConfigured(): boolean {
    return false;
  }
}
