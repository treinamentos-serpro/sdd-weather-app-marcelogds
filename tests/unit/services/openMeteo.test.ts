import { afterEach, describe, expect, it, vi } from 'vitest';
import { getWeatherData, searchCities } from '../../../src/services/openMeteo';
import { mockWeatherData } from '../../../src/types/weather';

afterEach(() => vi.unstubAllGlobals());

describe('Open-Meteo services', () => {
  it('maps geocoding results and limits them to five', async () => {
    const results = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      name: `Cidade ${index}`,
      latitude: index,
      longitude: index,
      country: 'Brasil',
    }));
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('São Paulo')).resolves.toHaveLength(5);
    expect(fetchMock.mock.calls[0][0]).toContain('count=5');
  });

  it('maps a complete forecast into WeatherData', async () => {
    const response = {
      timezone: mockWeatherData.timezone,
      current: {
        time: mockWeatherData.current.observedAt,
        temperature_2m: mockWeatherData.current.temperatureCelsius,
        weather_code: mockWeatherData.current.weatherCode,
        is_day: 1,
      },
      daily: {
        time: mockWeatherData.forecast.map((day) => day.date),
        weather_code: mockWeatherData.forecast.map((day) => day.weatherCode),
        temperature_2m_min: mockWeatherData.forecast.map((day) => day.minimumCelsius),
        temperature_2m_max: mockWeatherData.forecast.map((day) => day.maximumCelsius),
      },
    };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(response))));

    const result = await getWeatherData(mockWeatherData.city);
    expect(result.forecast).toHaveLength(5);
    expect(result.current.temperatureCelsius).toBe(22.4);
  });
});
