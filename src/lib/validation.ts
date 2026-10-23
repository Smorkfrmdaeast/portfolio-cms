import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(120, 'Title cannot exceed 120 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(5, 'Summary must be at least 5 characters').max(280, 'Summary must be under 280 characters'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number (e.g., 2025)'),
  role: z.string().min(2, 'Role must be at least 2 characters').max(80),
  tech: z.array(z.string().min(1)).min(1, 'Specify at least one tech stack tag'),
  image: z.string().min(1, 'Cover image is required'),
  liveUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  status: z.enum(['published', 'draft']),
  featured: z.boolean().default(true),
  order: z.number().int().default(0),
  sections: z.object({
    problem: z.string().optional(),
    approach: z.string().optional(),
    result: z.string().optional(),
  }).optional(),
  gallery: z.array(z.object({
    id: z.string(),
    url: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })).optional(),
  seoTitle: z.string().max(80).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const settingsSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  handle: z.string().min(1, 'Handle is required'),
  roleLine: z.string().min(2, 'Role line is required'),
  statement: z.string().min(10, 'Statement must be at least 10 characters'),
  statusLineText: z.string().max(100).optional(),
  statusLineEnabled: z.boolean().default(false),
  aboutText: z.string().min(20, 'About text must be at least 20 characters'),
  skills: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  profilePhoto: z.string().min(1, 'Profile photo is required'),
  resumeUrl: z.string().optional(),
  socials: z.object({
    instagram: z.string().url().or(z.literal('')),
    facebook: z.string().url().or(z.literal('')),
    linkedin: z.string().url().or(z.literal('')),
    github: z.string().url().or(z.literal('')),
    email: z.string().email().or(z.string().regex(/^mailto:/)),
    whatsapp: z.string().url().or(z.literal('')),
  }),
  defaultTheme: z.enum(['light', 'dark']).default('light'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
