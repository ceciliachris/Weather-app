import Constants from "expo-constants";
import * as Location from "expo-location";
import { WeatherData } from "@/types";

const OPEN_WEATHER_API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY as string;

export const fetchWeatherByCity = async (cityName: string): Promise<WeatherData> => {
  if (!cityName) {
    throw new Error("Skriv in en stad först.");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    cityName
  )}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=sv`;

  const res = await fetch(url);
  
  if (!res.ok) {
    if (res.status === 404) throw new Error("Staden hittades inte.");
    throw new Error("Något gick fel vid hämtning.");
  }

  const data = await res.json();

  return {
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    name: data.name,
  };
};

export const fetchWeatherByLocation = async (): Promise<WeatherData> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== "granted") {
    throw new Error("Kan inte hämta plats utan tillstånd.");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });
  
  const { latitude, longitude } = location.coords;
  console.log("GPS-koordinater:", latitude, longitude);

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=sv`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Kunde inte hämta väder.");

  const data = await res.json();

  return {
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    name: data.name,
  };
};

export const getWeatherIconUrl = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};