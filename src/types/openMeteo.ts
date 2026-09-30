export interface GeocodingResultDto {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  admin1?: string;
  country?: string;
  country_code?: string;
  timezone?: string;
}

export interface GeocodingResponseDto {
  results?: GeocodingResultDto[];
}

export interface ForecastCurrentDto {
  time: string;
  temperature_2m: number;
  weather_code: number;
  is_day: number;
  relative_humidity_2m?: number;
  wind_speed_10m?: number;
  precipitation?: number;
  surface_pressure?: number;
}

export interface ForecastDailyDto {
  time: string[];
  weather_code: number[];
  temperature_2m_min: number[];
  temperature_2m_max: number[];
  precipitation_probability_max?: number[];
}

export interface ForecastResponseDto {
  timezone: string;
  current?: ForecastCurrentDto;
  daily?: ForecastDailyDto;
}
