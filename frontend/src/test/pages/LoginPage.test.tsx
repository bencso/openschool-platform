import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../../pages/LoginPage';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ ok: false, status: 401 })),
  );
});

describe('LoginPage', () => {
  it('renders login card', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Belépés')).toBeInTheDocument();
    expect(screen.getByText(/Jelentkezz be GitHub fiókoddal/)).toBeInTheDocument();
  });

  it('renders GitHub login button with correct href', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    const btn = screen.getByText('Belépés GitHub-bal');
    expect(btn).toHaveAttribute('href', '/api/auth/login');
  });
});
