import { isCompleteForecastResponse } from '../lib/validation';
import { getWeatherDescription, isKnownWeatherCode } from '../lib/weatherCodes';
import type { ForecastResponseDto, GeocodingResponseDto } from '../types/openMeteo';
import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';
import { fetchJson } from './http';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export class InvalidWeatherDataError extends Error {
  readonly kind = 'invalid-data' as const;

  constructor(message = 'Os dados meteorológicos estão incompletos ou inválidos.') {
    super(message);
    this.name = 'InvalidWeatherDataError';
  }
}

export async function searchCities(query: string): Promise<City[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'pt',
    format: 'json',
  });
  const response = await fetchJson<GeocodingResponseDto>(`${GEOCODING_URL}?${params}`);

  return (response.results ?? []).slice(0, 5).map(mapCity);
}

export async function getWeatherData(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,weather_code,is_day,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure',
    daily: 'weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
    temperature_unit: 'celsius',
  });
  const response = await fetchJson<ForecastResponseDto>(`${FORECAST_URL}?${params}`);

  if (!isCompleteForecastResponse(response) || !response.current || !response.daily) {
    throw new InvalidWeatherDataError();
  }

  const codes = [response.current.weather_code, ...response.daily.weather_code];
  if (codes.some((code) => !isKnownWeatherCode(code))) {
    throw new InvalidWeatherDataError('A resposta contém um código meteorológico desconhecido.');
  }

  const current = mapCurrentWeather(response.current);
  const forecast = response.daily.time.map((date, index) => mapForecastDay(response, date, index));

  return {
    city,
    current,
    forecast,
    timezone: response.timezone,
  };
}

function mapCity(result: NonNullable<GeocodingResponseDto['results']>[number]): City {
  return {
    id: result.id,
    name: result.name,
    region: result.admin1,
    country: result.country,
    countryCode: result.country_code,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    elevation: result.elevation,
  };
}

function mapCurrentWeather(current: NonNullable<ForecastResponseDto['current']>): CurrentWeather {
  return {
    temperatureCelsius: current.temperature_2m,
    weatherCode: current.weather_code,
    description: getWeatherDescription(current.weather_code),
    observedAt: current.time,
    isDay: current.is_day === 1,
    humidityPercent: current.relative_humidity_2m,
    windSpeedKmh: current.wind_speed_10m,
    precipitationMm: current.precipitation,
    pressureHpa: current.surface_pressure,
  };
}

function mapForecastDay(response: ForecastResponseDto, date: string, index: number): ForecastDay {
  const daily = response.daily;

  if (!daily) {
    throw new InvalidWeatherDataError();
  }

  const weatherCode = daily.weather_code[index];

  return {
    date,
    weatherCode,
    description: getWeatherDescription(weatherCode),
    minimumCelsius: daily.temperature_2m_min[index],
    maximumCelsius: daily.temperature_2m_max[index],
    precipitationProbabilityPercent: daily.precipitation_probability_max?.[index],
  };
}
