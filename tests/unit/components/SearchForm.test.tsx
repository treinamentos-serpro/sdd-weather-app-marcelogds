import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchForm from '../../../src/components/SearchForm';

describe('SearchForm', () => {
  it('does not submit an empty query and submits a trimmed city', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome de uma cidade.');

    await user.type(screen.getByLabelText('Buscar cidade'), ' São Paulo ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });
});
