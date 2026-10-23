import { Project, SiteSettings, AdminUser } from '../../types';
import { initialProjects, initialSettings } from '../initialData';
import { IProjectRepository, ISettingsRepository, IAuthRepository } from './types';
import { generateSlug, normalizeImagePath } from '../utils';

const PROJECTS_KEY = 'smork_portfolio_projects_v2';
const SETTINGS_KEY = 'smork_portfolio_settings_v2';
const AUTH_KEY = 'smork_portfolio_auth_user';

export class LocalProjectRepository implements IProjectRepository {
  private getStorage(): Project[] {
    try {
      const stored = localStorage.getItem(PROJECTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: Project) => ({
            ...p,
            image: normalizeImagePath(p.image),
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored projects, falling back to initial data', e);
    }
    this.saveStorage(initialProjects);
    return initialProjects;
  }

  private saveStorage(projects: Project[]): void {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
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
    return list.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
  }

  async getById(id: string): Promise<Project | null> {
    const list = this.getStorage();
    return list.find((p) => p.id === id) || null;
  }

  async create(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const list = this.getStorage();
    const now = new Date().toISOString();
    
    // Ensure slug uniqueness
    let slug = projectData.slug || generateSlug(projectData.title);
    let counter = 1;
    while (list.some((p) => p.slug === slug)) {
      slug = `${projectData.slug || generateSlug(projectData.title)}-${counter++}`;
    }

    const newProject: Project = {
      ...projectData,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug,
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
    const index = list.findIndex((p) => p.id === id);
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
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          profilePhoto: normalizeImagePath(parsed.profilePhoto),
        };
      }
    } catch (e) {
      console.warn('Failed to parse stored settings, falling back to defaults', e);
    }
    this.saveStorage(initialSettings);
    return initialSettings;
  }

  private saveStorage(settings: SiteSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  async get(): Promise<SiteSettings> {
    return this.getStorage();
  }

  async update(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = this.getStorage();
    const updated: SiteSettings = {
      ...current,
      ...updates,
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
    // In local fallback mode: verified admin accounts
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
    return false; // Local repository
  }
}
