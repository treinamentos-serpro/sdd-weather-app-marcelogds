import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import LocationResults from '../../../src/components/LocationResults';

describe('LocationResults', () => {
  it('renders at most five cities and selects one', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const locations = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      name: `Cidade ${index}`,
      country: 'Brasil',
      latitude: index,
      longitude: index,
    }));

    render(<LocationResults locations={locations} onSelect={onSelect} />);

    expect(screen.getAllByRole('button')).toHaveLength(5);
    await user.click(screen.getByRole('button', { name: 'Cidade 0, Brasil' }));
    expect(onSelect).toHaveBeenCalledWith(locations[0]);
  });
});
