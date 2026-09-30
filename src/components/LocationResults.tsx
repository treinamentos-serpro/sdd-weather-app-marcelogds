import type { City } from '../types/weather';

interface LocationResultsProps {
  locations: City[];
  onSelect: (city: City) => void;
}

export default function LocationResults({ locations, onSelect }: LocationResultsProps) {
  if (locations.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="location-results-title" className="mt-4">
      <h2 className="mb-2 text-sm font-semibold text-white" id="location-results-title">
        Escolha uma cidade
      </h2>
      <ul className="grid gap-2">
        {locations.slice(0, 5).map((city) => {
          const location = [city.name, city.region, city.country].filter(Boolean).join(', ');

          return (
            <li key={city.id}>
              <button
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 shadow-glass backdrop-blur-md transition hover:border-accent-400/60 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
                onClick={() => onSelect(city)}
                type="button"
              >
                {location}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
