export interface AppSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  name: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
  theme: 'light',
  notifications: true,
};