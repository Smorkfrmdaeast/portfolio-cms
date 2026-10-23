import { describe, it, expect } from 'vitest';
import { projectSchema, settingsSchema, adminLoginSchema } from '../lib/validation';

describe('Validation Schemas', () => {
  describe('projectSchema', () => {
    it('validates a correct project', () => {
      const validProject = {
        title: 'Fintech Dashboard',
        slug: 'fintech-dashboard',
        summary: 'A clean and responsive fintech dashboard interface.',
        year: '2025',
        role: 'Frontend Engineering',
        tech: ['React', 'TypeScript', 'Tailwind CSS'],
        image: '/assets/smorks-paydom-platform.jpg',
        liveUrl: 'https://example.com/demo',
        githubUrl: 'https://github.com/example/repo',
        status: 'published',
        featured: true,
        order: 1,
      };

      const result = projectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    it('rejects invalid slugs with uppercase or special characters', () => {
      const invalidProject = {
        title: 'Bad Slug Project',
        slug: 'Bad Slug with Spaces!',
        summary: 'A clean project summary line.',
        year: '2025',
        role: 'Developer',
        tech: ['HTML'],
        image: '/assets/sample.jpg',
        status: 'draft',
      };

      const result = projectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('slug'))).toBe(true);
      }
    });

    it('rejects projects with empty tech stack tags', () => {
      const invalidProject = {
        title: 'No Tech',
        slug: 'no-tech',
        summary: 'A clean project summary line.',
        year: '2025',
        role: 'Developer',
        tech: [],
        image: '/assets/sample.jpg',
        status: 'draft',
      };

      const result = projectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });
  });

  describe('adminLoginSchema', () => {
    it('validates correct email and password length', () => {
      const result = adminLoginSchema.safeParse({
        email: 'ifeanyinuels42@gmail.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects malformed email', () => {
      const result = adminLoginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects short passwords', () => {
      const result = adminLoginSchema.safeParse({
        email: 'admin@smork.dev',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('settingsSchema', () => {
    it('validates correct site settings', () => {
      const validSettings = {
        name: 'Ifeanyi Nnamani',
        handle: 'Smork',
        roleLine: 'Software Engineer',
        statement: 'A clean and clear statement of what I build.',
        aboutText: 'This is an honest, straightforward developer biography.',
        skills: {
          frontend: ['React', 'TypeScript'],
          backend: ['Node.js'],
          tools: ['Git'],
        },
        profilePhoto: '/assets/hero.jpg',
        socials: {
          instagram: 'https://instagram.com/smork',
          facebook: 'https://facebook.com/smork',
          linkedin: 'https://linkedin.com/in/smork',
          github: 'https://github.com/smork',
          email: 'ifeanyinuels42@gmail.com',
          whatsapp: 'https://wa.me/2349019071679',
        },
        defaultTheme: 'light' as const,
      };

      const result = settingsSchema.safeParse(validSettings);
      expect(result.success).toBe(true);
    });
  });
});
