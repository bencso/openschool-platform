import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CourseCard from '../../components/CourseCard';

describe('CourseCard', () => {
  it('renders course name and description', () => {
    render(
      <MemoryRouter>
        <CourseCard id={1} name="Python Alapok" description="Tanulj Pythont" />
      </MemoryRouter>,
    );
    expect(screen.getByText('Python Alapok')).toBeInTheDocument();
    expect(screen.getByText('Tanulj Pythont')).toBeInTheDocument();
  });

  it('shows default text when no description', () => {
    render(
      <MemoryRouter>
        <CourseCard id={2} name="Backend" description={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText('Nincs leírás.')).toBeInTheDocument();
  });

  it('links to correct course detail page', () => {
    render(
      <MemoryRouter>
        <CourseCard id={5} name="Test Course" description="desc" />
      </MemoryRouter>,
    );
    const link = screen.getByText('Részletek');
    expect(link).toHaveAttribute('href', '/courses/5');
  });
});
