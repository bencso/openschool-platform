import { describe, it, expect } from 'vitest';
import { SITE } from '../../lib/config';

describe('config', () => {
  it('has required site properties', () => {
    expect(SITE.name).toBe('OpenSchool');
    expect(SITE.github).toBeDefined();
    expect(SITE.discord).toBeDefined();
    expect(SITE.knowledge).toBeDefined();
  });

  it('has valid URLs', () => {
    expect(SITE.github).toMatch(/^https:\/\//);
    expect(SITE.discord).toMatch(/^https:\/\//);
    expect(SITE.knowledge).toMatch(/^https:\/\//);
  });
});
