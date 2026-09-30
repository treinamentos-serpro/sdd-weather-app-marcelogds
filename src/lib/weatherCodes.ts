const weatherDescriptions: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Névoa',
  48: 'Névoa congelante',
  51: 'Garoa fraca',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  61: 'Chuva fraca',
  63: 'Chuva moderada',
  65: 'Chuva intensa',
  71: 'Neve fraca',
  73: 'Neve moderada',
  75: 'Neve intensa',
  80: 'Pancadas de chuva fracas',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva intensas',
  95: 'Trovoada',
  96: 'Trovoada com granizo fraco',
  99: 'Trovoada com granizo intenso',
};

const weatherIcons: Record<number, string> = {
  0: '☀',
  1: '🌤',
  2: '⛅',
  3: '☁',
  45: '🌫',
  48: '🌫',
  51: '🌦',
  53: '🌦',
  55: '🌧',
  61: '🌧',
  63: '🌧',
  65: '🌧',
  71: '🌨',
  73: '🌨',
  75: '❄',
  80: '🌦',
  81: '🌧',
  82: '🌧',
  95: '⛈',
  96: '⛈',
  99: '⛈',
};

export function getWeatherDescription(weatherCode: number): string {
  return weatherDescriptions[weatherCode] ?? 'Condição desconhecida';
}

export function isKnownWeatherCode(weatherCode: number): boolean {
  return weatherCode in weatherDescriptions;
}

export function getWeatherIcon(weatherCode: number): string {
  return weatherIcons[weatherCode] ?? '🌡';
}
