import { useCallback, useRef, useState } from 'react';
import { normalizeSearchQuery } from '../lib/validation';
import { HttpError } from '../services/http';
import { getWeatherData, InvalidWeatherDataError, searchCities } from '../services/openMeteo';
import type { City, WeatherError, WeatherState } from '../types/weather';

const initialState: WeatherState = {
  searchQuery: '',
  locations: [],
  unit: 'celsius',
  locationStatus: 'idle',
  weatherStatus: 'idle',
  requestId: 0,
};

export function useWeather() {
  const [state, setState] = useState<WeatherState>(initialState);
  const requestIdRef = useRef(0);
  const selectedCityRef = useRef<City | undefined>(undefined);
  const lastQueryRef = useRef('');

  const nextRequestId = useCallback(() => {
    requestIdRef.current += 1;
    return requestIdRef.current;
  }, []);

  const search = useCallback(
    async (query: string) => {
      const normalizedQuery = normalizeSearchQuery(query);
      const requestId = nextRequestId();

      lastQueryRef.current = normalizedQuery ?? '';
      selectedCityRef.current = undefined;
      setState((current) => ({
        ...current,
        searchQuery: query,
        locations: [],
        selectedCity: undefined,
        weatherData: undefined,
        locationStatus: normalizedQuery ? 'loading' : 'error',
        weatherStatus: 'idle',
        error: normalizedQuery ? undefined : invalidInputError(),
        requestId,
      }));

      if (!normalizedQuery) {
        return;
      }

      try {
        const locations = await searchCities(normalizedQuery);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setState((current) => ({
          ...current,
          locations,
          locationStatus: locations.length ? 'success' : 'empty',
          error: undefined,
        }));
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setState((current) => ({
          ...current,
          locationStatus: 'error',
          error: toWeatherError(error),
        }));
      }
    },
    [nextRequestId],
  );

  const selectCity = useCallback(
    async (city: City) => {
      const requestId = nextRequestId();
      selectedCityRef.current = city;

      setState((current) => ({
        ...current,
        selectedCity: city,
        weatherData: undefined,
        weatherStatus: 'loading',
        error: undefined,
        requestId,
      }));

      try {
        const weatherData = await getWeatherData(city);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setState((current) => ({ ...current, weatherData, weatherStatus: 'success' }));
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setState((current) => ({
          ...current,
          weatherStatus: 'error',
          error: toWeatherError(error),
        }));
      }
    },
    [nextRequestId],
  );

  const retry = useCallback(() => {
    if (selectedCityRef.current) {
      void selectCity(selectedCityRef.current);
      return;
    }

    if (lastQueryRef.current) {
      void search(lastQueryRef.current);
    }
  }, [search, selectCity]);

  const setUnit = useCallback((unit: WeatherState['unit']) => {
    setState((current) => ({ ...current, unit }));
  }, []);

  return { state, search, selectCity, retry, setUnit };
}

function invalidInputError(): WeatherError {
  return {
    kind: 'invalid-input',
    message: 'Informe um nome de cidade válido.',
    retryable: false,
  };
}

function toWeatherError(error: unknown): WeatherError {
  if (error instanceof InvalidWeatherDataError) {
    return { kind: 'invalid-data', message: error.message, retryable: true };
  }

  if (error instanceof HttpError) {
    return { kind: error.kind, message: error.message, retryable: true };
  }

  return {
    kind: 'api',
    message: 'Não foi possível carregar os dados meteorológicos.',
    retryable: true,
  };
}
