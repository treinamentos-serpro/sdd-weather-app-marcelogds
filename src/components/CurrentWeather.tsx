import { formatTemperature } from '../lib/temperature';
import { getWeatherDescription, getWeatherIcon } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
      <dt className="text-xs uppercase tracking-wide text-white/60">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const description = current.description || getWeatherDescription(current.weatherCode);
  const icon = getWeatherIcon(current.weatherCode);
  const location = [city.name, city.region, city.country].filter(Boolean).join(', ');

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md sm:p-8"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-accent-400">Clima atual</p>
          <h1
            className="mt-2 break-words text-2xl font-semibold text-white"
            id="current-weather-title"
          >
            {location}
          </h1>
          <div className="mt-6 flex items-center gap-5">
            <span aria-hidden="true" className="text-6xl leading-none">
              {icon}
            </span>
            <div>
              <p className="text-6xl font-semibold tracking-tight text-white sm:text-7xl">
                {formatTemperature(current.temperatureCelsius, unit)}
              </p>
              <p className="mt-2 text-lg text-white/70">{description}</p>
            </div>
          </div>
          {current.observedAt ? (
            <p className="mt-4 text-sm text-white/70">
              Atualizado em {new Date(current.observedAt).toLocaleString('pt-BR')}
            </p>
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:max-w-xl md:flex-1">
          <Metric
            label="Umidade"
            value={current.humidityPercent === undefined ? '—' : `${current.humidityPercent}%`}
          />
          <Metric
            label="Vento"
            value={current.windSpeedKmh === undefined ? '—' : `${current.windSpeedKmh} km/h`}
          />
          <Metric
            label="Chuva"
            value={current.precipitationMm === undefined ? '—' : `${current.precipitationMm} mm`}
          />
          <Metric
            label="Pressão"
            value={current.pressureHpa === undefined ? '—' : `${current.pressureHpa} hPa`}
          />
        </dl>
      </div>
    </section>
  );
}
