import { type FormEvent, useState } from 'react';

interface SearchFormProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchForm({ onSearch, disabled = false }: SearchFormProps) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCity = city.trim();

    if (!normalizedCity) {
      setError('Informe o nome de uma cidade.');
      return;
    }

    setError('');
    onSearch(normalizedCity);
  }

  function handleCityChange(value: string) {
    setCity(value);

    if (error) {
      setError('');
    }
  }

  return (
    <form
      aria-describedby={error ? 'search-form-error' : undefined}
      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md"
      noValidate
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label className="mb-2 block text-sm font-medium text-white" htmlFor="city-search">
            Buscar cidade
          </label>
          <input
            aria-errormessage={error ? 'search-form-error' : undefined}
            aria-invalid={Boolean(error)}
            autoComplete="address-level2"
            className="w-full rounded-xl border border-white/10 bg-night-800/80 px-4 py-3 text-white outline-none transition placeholder:text-white/60 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/40 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={disabled}
            id="city-search"
            name="city"
            onChange={(event) => handleCityChange(event.target.value)}
            placeholder="Ex.: São Paulo"
            type="search"
            value={city}
          />
        </div>
        <button
          className="rounded-xl bg-accent-500 px-5 py-3 font-medium text-white transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          type="submit"
        >
          Buscar
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-200" id="search-form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
