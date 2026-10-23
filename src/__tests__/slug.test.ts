import { describe, it, expect } from 'vitest';
import { generateSlug } from '../lib/utils';

describe('generateSlug', () => {
  it('converts title to lowercase hyphenated slug', () => {
    expect(generateSlug('Fintech Dashboard')).toBe('fintech-dashboard');
  });

  it('removes punctuation and symbols', () => {
    expect(generateSlug('Smork ♿💫 E-Commerce Store!')).toBe('smork-e-commerce-store');
  });

  it('collapses multiple whitespace characters and dashes into a single hyphen', () => {
    expect(generateSlug('Unique   Homes   --- Landing   Page')).toBe('unique-homes-landing-page');
  });

  it('trims leading and trailing hyphens', () => {
    expect(generateSlug('--Tech Calculator--')).toBe('tech-calculator');
  });

  it('handles already valid slugs cleanly', () => {
    expect(generateSlug('appointment-booking-platform')).toBe('appointment-booking-platform');
  });
});
