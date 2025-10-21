import { useContext } from 'react';
import { SettingsContext } from '@/context/SettingsContext';

export const useSettings = () => {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  const { settings, updateSettings, isLoading } = context;

  const displayTemp = (tempCelsius: number): string => {
    if (settings.temperatureUnit === 'fahrenheit') {
      const fahrenheit = Math.round((tempCelsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }
    return `${tempCelsius}°C`;
  };

  const isDark = settings.theme === 'dark';

  return {
    settings,
    updateSettings,
    isLoading,
    displayTemp,
    isDark,
  };
};