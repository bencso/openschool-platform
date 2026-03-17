import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VerifyPage from '../../pages/VerifyPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'abc-123' }),
  };
});

describe('VerifyPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('shows valid certificate', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve({
              name: 'Test User',
              course: 'Python Alapok',
              issued_at: '2026-03-01T00:00:00Z',
              cert_id: 'abc-123',
            }),
        }),
      ),
    );

    render(
      <MemoryRouter>
        <VerifyPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Érvényes/)).toBeInTheDocument();
      expect(screen.getByText(/Test User/)).toBeInTheDocument();
      expect(screen.getByText(/Python Alapok/)).toBeInTheDocument();
    });
  });

  it('shows invalid certificate for 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({}),
        }),
      ),
    );

    render(
      <MemoryRouter>
        <VerifyPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Érvénytelen tanúsítvány')).toBeInTheDocument();
    });
  });
});
