import { Project, SiteSettings, AdminUser } from '../../types';

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getPublished(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
  getById(id: string): Promise<Project | null>;
  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  update(id: string, updates: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<void>;
  resetToDefaults(): Promise<void>;
}

export interface ISettingsRepository {
  get(): Promise<SiteSettings>;
  update(updates: Partial<SiteSettings>): Promise<SiteSettings>;
  resetToDefaults(): Promise<void>;
}

export interface IAuthRepository {
  getCurrentUser(): AdminUser | null;
  onAuthStateChanged(callback: (user: AdminUser | null) => void): () => void;
  signInWithEmail(email: string, pass: string): Promise<AdminUser>;
  signInWithGoogle(): Promise<AdminUser>;
  signOut(): Promise<void>;
  isConfigured(): boolean;
}
