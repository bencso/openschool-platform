import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from '../../lib/api';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  // Stub window.location to prevent jsdom navigation errors
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '/' },
  });
});

describe('apiFetch', () => {
  it('makes GET request with same-origin credentials', async () => {
    const mockResponse = { ok: true, status: 200, json: () => Promise.resolve({ data: 'ok' }) };
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(mockResponse)),
    );

    const result = await apiFetch('/api/test');
    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );
  });

  it('makes POST request with body', async () => {
    const mockResponse = { ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) };
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(mockResponse)),
    );

    const result = await apiFetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test' }),
    });

    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        body: JSON.stringify({ name: 'test' }),
      }),
    );
  });

  it('retries on 401 by calling refresh', async () => {
    const successResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'refreshed' }),
    };
    let callCount = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        callCount++;
        if (url === '/api/auth/refresh') {
          return Promise.resolve({ ok: true, status: 200 });
        }
        if (callCount <= 1) {
          return Promise.resolve({ ok: false, status: 401 });
        }
        return Promise.resolve(successResponse);
      }),
    );

    const result = await apiFetch('/api/secure');
    expect(result).toBe(successResponse);
    expect(fetch).toHaveBeenCalledTimes(3); // initial + refresh + retry
  });

  it('redirects to login when refresh fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url === '/api/auth/refresh') {
          return Promise.resolve({ ok: false, status: 401 });
        }
        return Promise.resolve({ ok: false, status: 401 });
      }),
    );

    await apiFetch('/api/secure');
    expect(window.location.href).toBe('/login');
  });
});
