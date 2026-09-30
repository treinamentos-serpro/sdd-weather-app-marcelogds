import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import ForecastList from '../../../src/components/ForecastList';
import { mockWeatherData } from '../../../src/types/weather';

describe('weather display components', () => {
  it('renders current weather metrics', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('heading', { name: /são paulo/i })).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('12.6 km/h')).toBeInTheDocument();
  });

  it('renders the five forecast days in order', () => {
    render(<ForecastList forecast={mockWeatherData.forecast} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'Próximos cinco dias' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getAllByText(/Chuva:/)).toHaveLength(5);
  });
});