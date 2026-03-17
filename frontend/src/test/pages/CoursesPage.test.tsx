import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CoursesPage from '../../pages/CoursesPage';

describe('CoursesPage', () => {
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

  it('renders heading', () => {
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Elérhető kurzusok')).toBeInTheDocument();
  });

  it('shows courses from API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: [
                { id: 1, name: 'Kurzus A', description: 'Leírás A' },
                { id: 2, name: 'Kurzus B', description: 'Leírás B' },
              ],
            }),
        }),
      ),
    );

    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Kurzus A')).toBeInTheDocument();
      expect(screen.getByText('Kurzus B')).toBeInTheDocument();
    });
  });

  it('shows empty message when no courses', async () => {
    render(
      <MemoryRouter>
        <CoursesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Még nincsenek kurzusok.')).toBeInTheDocument();
    });
  });
});
