import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import LocationResults from './components/LocationResults';
import SearchForm from './components/SearchForm';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit, WeatherData } from './types/weather';

function App() {
  const { retry, search, selectCity, setUnit, state } = useWeather();
  const isLoading = state.locationStatus === 'loading' || state.weatherStatus === 'loading';
  const weatherData = state.weatherData;

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <header className="border-b border-white/10 bg-night-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <a
            aria-label="WeatherView, página inicial"
            className="shrink-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
            href="/"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
              WeatherView
            </span>
            <span className="mt-1 block text-lg font-semibold text-white">Clima sem ruído</span>
          </a>
          <div className="min-w-0 flex-1">
            <SearchForm disabled={isLoading} onSearch={(city) => void search(city)} />
          </div>
          <UnitToggle onChange={setUnit} unit={state.unit} />
        </div>
      </header>

      <main aria-busy={isLoading} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && state.locationStatus === 'idle' && state.weatherStatus === 'idle' ? (
          <IdleState />
        ) : null}
        {!isLoading && state.locationStatus === 'success' && !state.selectedCity ? (
          <LocationResults locations={state.locations} onSelect={(city) => void selectCity(city)} />
        ) : null}
        {!isLoading && state.locationStatus === 'empty' ? <EmptyState /> : null}
        {!isLoading && state.error ? (
          <ErrorState message={state.error.message} onRetry={retry} />
        ) : null}
        {!isLoading && state.weatherStatus === 'success' && weatherData ? (
          <SuccessState data={weatherData} unit={state.unit} />
        ) : null}
      </main>
    </div>
  );
}

function IdleState() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center shadow-glass backdrop-blur-md sm:px-12">
      <p className="text-6xl" aria-hidden="true">
        ✦
      </p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        Encontre o clima da sua próxima parada.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70">
        Pesquise uma cidade para ver as condições atuais e uma previsão compacta para os próximos
        cinco dias.
      </p>
    </section>
  );
}

interface SuccessStateProps {
  data: WeatherData;
  unit: Unit;
}

function SuccessState({ data, unit }: SuccessStateProps) {
  return (
    <div className="space-y-6">
      <CurrentWeather city={data.city} current={data.current} unit={unit} />
      <ForecastList forecast={data.forecast} unit={unit} />
    </div>
  );
}

export default App;
