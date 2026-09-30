export type Unit = 'celsius' | 'fahrenheit';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export type WeatherErrorKind = 'invalid-input' | 'network' | 'api' | 'timeout' | 'invalid-data';

export interface WeatherError {
  kind: WeatherErrorKind;
  message: string;
  retryable: boolean;
}

export interface City {
  /** Identificador da localidade no geocoding. */
  id: number;

  /** Nome da cidade. */
  name: string;

  /** Estado ou região administrativa. */
  region?: string;

  /** Nome do país. */
  country?: string;

  /** Código ISO do país. */
  countryCode?: string;

  /** Latitude da localidade. */
  latitude: number;

  /** Longitude da localidade. */
  longitude: number;

  /** Fuso horário retornado pelo geocoding. */
  timezone?: string;

  /** Elevação em metros, quando disponível. */
  elevation?: number;
}

export interface CurrentWeather {
  /** Temperatura atual em Celsius no modelo interno. */
  temperatureCelsius: number;

  /** Código WMO do estado meteorológico. */
  weatherCode: number;

  /** Descrição do estado meteorológico em pt-BR. */
  description: string;

  /** Data e hora do dado no fuso da cidade. */
  observedAt?: string;

  /** Indica se é dia. */
  isDay?: boolean;

  /** Umidade relativa do ar em percentual. */
  humidityPercent?: number;

  /** Velocidade do vento em km/h. */
  windSpeedKmh?: number;

  /** Precipitação acumulada em milímetros. */
  precipitationMm?: number;

  /** Pressão atmosférica em hPa. */
  pressureHpa?: number;
}

export interface ForecastDay {
  /** Data local da cidade no formato ISO YYYY-MM-DD. */
  date: string;

  /** Código WMO predominante do dia. */
  weatherCode: number;

  /** Descrição do estado meteorológico em pt-BR. */
  description: string;

  /** Temperatura mínima em Celsius. */
  minimumCelsius: number;

  /** Temperatura máxima em Celsius. */
  maximumCelsius: number;

  /** Probabilidade máxima de precipitação em percentual. */
  precipitationProbabilityPercent?: number;
}

export interface WeatherData {
  /** Cidade selecionada pela pessoa. */
  city: City;

  /** Condições meteorológicas atuais. */
  current: CurrentWeather;

  /** Previsão de hoje e dos quatro dias seguintes. */
  forecast: ForecastDay[];

  /** Fuso horário usado para datas e horários. */
  timezone: string;
}

export interface WeatherState {
  searchQuery: string;
  locations: City[];
  selectedCity?: City;
  weatherData?: WeatherData;
  unit: Unit;
  locationStatus: AsyncStatus;
  weatherStatus: AsyncStatus;
  error?: WeatherError;
  requestId: number;
}

/** Dados determinísticos para desenvolvimento da UI sem chamada de API. */
export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    region: 'São Paulo',
    country: 'Brasil',
    countryCode: 'BR',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
    elevation: 760,
  },
  current: {
    temperatureCelsius: 22.4,
    weatherCode: 2,
    description: 'Parcialmente nublado',
    observedAt: '2026-09-30T14:00:00-03:00',
    isDay: true,
    humidityPercent: 68,
    windSpeedKmh: 12.6,
    precipitationMm: 0,
    pressureHpa: 1014.2,
  },
  forecast: [
    {
      date: '2026-09-30',
      weatherCode: 2,
      description: 'Parcialmente nublado',
      minimumCelsius: 17.2,
      maximumCelsius: 25.4,
      precipitationProbabilityPercent: 18,
    },
    {
      date: '2026-10-01',
      weatherCode: 61,
      description: 'Chuva fraca',
      minimumCelsius: 18,
      maximumCelsius: 23.1,
      precipitationProbabilityPercent: 72,
    },
    {
      date: '2026-10-02',
      weatherCode: 3,
      description: 'Nublado',
      minimumCelsius: 16.5,
      maximumCelsius: 24,
      precipitationProbabilityPercent: 34,
    },
    {
      date: '2026-10-03',
      weatherCode: 1,
      description: 'Predominantemente limpo',
      minimumCelsius: 17.1,
      maximumCelsius: 26.2,
      precipitationProbabilityPercent: 12,
    },
    {
      date: '2026-10-04',
      weatherCode: 0,
      description: 'Céu limpo',
      minimumCelsius: 16.8,
      maximumCelsius: 27,
      precipitationProbabilityPercent: 5,
    },
  ],
  timezone: 'America/Sao_Paulo',
};
