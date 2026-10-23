export type ProjectStatus = 'published' | 'draft';

export interface CaseStudySections {
  problem?: string;
  approach?: string;
  result?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string; // One plain line summary
  year: string;
  role: string;
  tech: string[]; // Tech tags
  image: string; // Cover image URL
  liveUrl?: string;
  githubUrl?: string;
  status: ProjectStatus;
  order: number;
  featured: boolean;
  sections?: CaseStudySections;
  gallery?: GalleryItem[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
  createdAt: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  linkedin: string;
  github: string;
  email: string;
  whatsapp: string;
}

export interface SkillGroups {
  frontend: string[];
  backend: string[];
  tools: string[];
}

export interface SiteSettings {
  name: string;
  handle: string;
  roleLine: string;
  statement: string; // Left-aligned plain sentence hero copy
  statusLineText?: string;
  statusLineEnabled: boolean;
  aboutText: string;
  skills: SkillGroups;
  profilePhoto: string;
  resumeUrl?: string; // PDF or link
  socials: SocialLinks;
  defaultTheme: 'light' | 'dark';
  updatedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}
