import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../../src/components/states/EmptyState';
import ErrorState from '../../../src/components/states/ErrorState';
import LoadingState from '../../../src/components/states/LoadingState';

describe('weather states', () => {
  it('renders loading with status role', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty guidance', () => {
    render(<EmptyState />);
    expect(screen.getByRole('heading', { name: /nenhuma cidade/i })).toBeInTheDocument();
  });

  it('offers manual retry on error', async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    screen.getByRole('button', { name: /tentar novamente/i }).click();
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
