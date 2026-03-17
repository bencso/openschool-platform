import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve(null) })),
  );
});

describe('App', () => {
  it('renders homepage at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Tanulj programozni, építs projekteket')).toBeInTheDocument();
  });

  it('renders login page at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Belépés GitHub-bal')).toBeInTheDocument();
  });

  it('renders courses page at /courses', () => {
    render(
      <MemoryRouter initialEntries={['/courses']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('Elérhető kurzusok')).toBeInTheDocument();
  });
});
