import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../../pages/DashboardPage';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]),
      }),
    ),
  );
});

describe('DashboardPage', () => {
  it('renders heading', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );
    const heading = await screen.findByText('Dashboard');
    expect(heading).toBeInTheDocument();
  });

  it('shows enrolled courses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('/api/me/dashboard')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve([
                {
                  course_id: 1,
                  course_name: 'Python',
                  progress_percent: 50,
                  completed_exercises: 5,
                  total_exercises: 10,
                },
              ]),
          });
        }
        if (url.includes('/api/me/certificates')) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) });
      }),
    );

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('shows empty message when not enrolled', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Még nem iratkoztál be semmilyen kurzusra.')).toBeInTheDocument();
    });
  });
});
