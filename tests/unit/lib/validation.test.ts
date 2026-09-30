import { describe, expect, it } from 'vitest';
import { isCompleteForecastResponse, normalizeSearchQuery } from '../../../src/lib/validation';

describe('validation', () => {
  it('normalizes a valid city query', () => {
    expect(normalizeSearchQuery('  São   Paulo  ')).toBe('São Paulo');
  });

  it('rejects empty, oversized and non-alphanumeric queries', () => {
    expect(normalizeSearchQuery('   ')).toBeNull();
    expect(normalizeSearchQuery('!@#$')).toBeNull();
    expect(normalizeSearchQuery('a'.repeat(101))).toBeNull();
  });

  it('requires five daily entries in a forecast response', () => {
    const response = {
      timezone: 'America/Sao_Paulo',
      current: { time: '', temperature_2m: 20, weather_code: 0, is_day: 1 },
      daily: {
        time: ['2026-09-30'],
        weather_code: [0],
        temperature_2m_min: [15],
        temperature_2m_max: [25],
      },
    };

    expect(isCompleteForecastResponse(response)).toBe(false);
  });
});
