import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('marks the active unit and emits changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<UnitToggle onChange={onChange} unit="celsius" />);

    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '°F' }));
    expect(onChange).toHaveBeenCalledWith('fahrenheit');
  });
});
