import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../../components/ProgressBar';

describe('ProgressBar', () => {
  it('renders with percent value', () => {
    render(<ProgressBar percent={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<ProgressBar percent={50} label="Python Alapok" />);
    expect(screen.getByText('Python Alapok')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders fill bar with correct width', () => {
    const { container } = render(<ProgressBar percent={60} />);
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('60%');
  });

  it('renders 0% correctly', () => {
    const { container } = render(<ProgressBar percent={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('renders 100% correctly', () => {
    const { container } = render(<ProgressBar percent={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });
});
