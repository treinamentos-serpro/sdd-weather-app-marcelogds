import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../../src/hooks/useWeather';

const mockedWeatherData = vi.hoisted(() => ({
  city: {
    id: 1,
    name: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
  },
  current: {
    temperatureCelsius: 22,
    weatherCode: 2,
    description: 'Parcialmente nublado',
  },
  forecast: Array.from({ length: 5 }, (_, index) => ({
    date: `2026-09-${30 + index}`,
    weatherCode: 0,
    description: 'Céu limpo',
    minimumCelsius: 15,
    maximumCelsius: 25,
  })),
  timezone: 'America/Sao_Paulo',
}));

vi.mock('../../../src/services/openMeteo', () => ({
  searchCities: vi.fn().mockResolvedValue([mockedWeatherData.city]),
  getWeatherData: vi.fn().mockResolvedValue(mockedWeatherData),
}));

describe('useWeather', () => {
  beforeEach(() => vi.clearAllMocks());

  it('transitions from idle to city search success and weather success', async () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.state.locationStatus).toBe('idle');

    await act(async () => {
      await result.current.search('São Paulo');
    });
    expect(result.current.state.locationStatus).toBe('success');

    await act(async () => {
      await result.current.selectCity(mockedWeatherData.city);
    });
    await waitFor(() => expect(result.current.state.weatherStatus).toBe('success'));
  });

  it('rejects empty searches without calling the service', async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(result.current.state.locationStatus).toBe('error');
    expect(result.current.state.error?.kind).toBe('invalid-input');
  });
});
