import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../../pages/HomePage';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      }),
    ),
  );
});

describe('HomePage', () => {
  it('renders hero section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Tanulj programozni, építs projekteket')).toBeInTheDocument();
  });

  it('renders how-it-works section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Hogyan működik?')).toBeInTheDocument();
    expect(screen.getByText('Beiratkozás')).toBeInTheDocument();
    expect(screen.getByText('Feladatok')).toBeInTheDocument();
    expect(screen.getByText('Tanúsítvány')).toBeInTheDocument();
  });

  it('renders quickstart section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Gyors indulás')).toBeInTheDocument();
  });

  it('renders community section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Discord közösség')).toBeInTheDocument();
    expect(screen.getByText('GitHub repository')).toBeInTheDocument();
    expect(screen.getByText('Tudásbázis')).toBeInTheDocument();
  });

  it('shows courses when API returns data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: [
                { id: 1, name: 'Kurzus Alpha', description: 'Leírás 1' },
                { id: 2, name: 'Kurzus Beta', description: 'Leírás 2' },
              ],
            }),
        }),
      ),
    );

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Kurzus Alpha')).toBeInTheDocument();
      expect(screen.getByText('Kurzus Beta')).toBeInTheDocument();
    });
  });

  it('shows empty message when no courses', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Még nincsenek kurzusok.')).toBeInTheDocument();
    });
  });
});
