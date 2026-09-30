import type { ForecastResponseDto } from '../types/openMeteo';

export function normalizeSearchQuery(query: string): string | null {
  const normalized = query.trim().replace(/\s+/g, ' ');

  if (!normalized || normalized.length > 100 || !/[\p{L}\p{N}]/u.test(normalized)) {
    return null;
  }

  return normalized;
}

export function isCompleteForecastResponse(response: ForecastResponseDto): boolean {
  const { current, daily } = response;

  if (!current || !daily) {
    return false;
  }

  const dailyFields = [
    daily.time,
    daily.weather_code,
    daily.temperature_2m_min,
    daily.temperature_2m_max,
  ];

  return (
    dailyFields.every((values) => values.length === 5) &&
    dailyFields.every((values) => values.every((value) => value !== undefined && value !== null))
  );
}
