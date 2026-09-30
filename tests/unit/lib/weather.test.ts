import { describe, expect, it } from 'vitest';
import { formatLocalDate } from '../../../src/lib/dateTime';
import { formatTemperature, toFahrenheit } from '../../../src/lib/temperature';
import { getWeatherDescription, isKnownWeatherCode } from '../../../src/lib/weatherCodes';

describe('weather helpers', () => {
  it('converts temperature without mutating input', () => {
    expect(toFahrenheit(0)).toBe(32);
    expect(formatTemperature(20, 'celsius')).toBe('20°C');
    expect(formatTemperature(20, 'fahrenheit')).toBe('68°F');
  });

  it('formats a date and maps known weather codes', () => {
    expect(formatLocalDate('2026-09-30', 'America/Sao_Paulo')).toContain('30');
    expect(getWeatherDescription(2)).toBe('Parcialmente nublado');
    expect(isKnownWeatherCode(2)).toBe(true);
    expect(isKnownWeatherCode(999)).toBe(false);
  });
});
