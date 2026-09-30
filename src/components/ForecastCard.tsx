import { formatDay } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherIcon } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const precipitation = day.precipitationProbabilityPercent;

  return (
    <article className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md">
      <h3 className="truncate text-sm font-semibold capitalize text-white">
        {formatDay(day.date)}
      </h3>
      <p aria-hidden="true" className="mt-5 text-4xl leading-none">
        {getWeatherIcon(day.weatherCode)}
      </p>
      <p className="mt-3 min-h-10 text-sm text-white/70">{day.description}</p>
      <div className="mt-5 flex items-baseline justify-between gap-2">
        <strong className="text-lg text-white">
          {formatTemperature(day.maximumCelsius, unit)}
        </strong>
        <span className="text-sm text-white/70">{formatTemperature(day.minimumCelsius, unit)}</span>
      </div>
      <p className="mt-4 text-sm text-white/70">
        <span aria-hidden="true">☂</span>{' '}
        <span>Chuva: {precipitation === undefined ? '—' : `${precipitation}%`}</span>
      </p>
    </article>
  );
}
