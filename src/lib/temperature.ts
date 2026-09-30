import type { Unit } from '../types/weather';

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(celsius: number, unit: Unit): string {
  const value = unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius;
  return `${Math.round(value)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}
