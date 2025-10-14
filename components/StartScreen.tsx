import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import CustomButton from "./CustomButton";
import { AppSettings, getSettings, saveFavorite } from "./storage";

const OPEN_WEATHER_API_KEY =
  Constants.expoConfig?.extra?.OPENWEATHER_API_KEY as string;

export default function StartScreen() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
    icon: string;
    name: string;
  } | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    temperatureUnit: "celsius",
    theme: "light",
    notifications: true,
  });

  const params = useLocalSearchParams();

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    const saved = await getSettings();
    setSettings(saved);
  };

  useEffect(() => {
    if (params.city) {
      const cityName = Array.isArray(params.city)
        ? params.city[0]
        : params.city;
      fetchWeather(cityName);
    }
  }, [params.city]);

  const fetchWeather = async (cityName: string) => {
    if (!cityName) {
      Alert.alert("Fel", "Skriv in en stad först.");
      return;
    }

    try {
      setLoading(true);
      setWeather(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=sv`;

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Staden hittades inte.");
        throw new Error("Något gick fel vid hämtning.");
      }

      const data = await res.json();

      setWeather({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        name: data.name,
      });

      setCity("");
    } catch (err: any) {
      Alert.alert("Fel", err.message || "Kunde inte hämta väder.");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherByLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Behörighet nekad", "Kan inte hämta plats utan tillstånd.");
        return;
      }

      setLoading(true);
      setWeather(null);

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = location.coords;

      console.log("GPS-koordinater:", latitude, longitude);

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=sv`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Kunde inte hämta väder.");

      const data = await res.json();

      setWeather({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        name: data.name,
      });

      setCity("");
    } catch (err: any) {
      Alert.alert("Fel", err.message || "Kunde inte hämta plats.");
    } finally {
      setLoading(false);
    }
  };

  const displayTemp = (tempCelsius: number) => {
    if (settings.temperatureUnit === "fahrenheit") {
      const fahrenheit = Math.round((tempCelsius * 9) / 5 + 32);
      return `${fahrenheit}°F`;
    }
    return `${tempCelsius}°C`;
  };

  const iconUrl = (icon: string) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const isDark = settings.theme === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>
        Väderapp
      </Text>

      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder="Skriv stad (t.ex. Stockholm)"
        placeholderTextColor={isDark ? "#999" : "#666"}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => fetchWeather(city)}
        returnKeyType="search"
      />

      <View style={styles.btnRow}>
        <CustomButton title="Sök" onPress={() => fetchWeather(city)} />
        <CustomButton title="📍 Använd min plats" onPress={getWeatherByLocation} />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {weather && (
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cityName, isDark && styles.textDark]}>
            {weather.name}
          </Text>
          <View style={styles.row}>
            <Image source={{ uri: iconUrl(weather.icon) }} style={styles.icon} />
            <View>
              <Text style={[styles.temp, isDark && styles.textDark]}>
                {displayTemp(weather.temp)}
              </Text>
              <Text style={[styles.desc, isDark && styles.textDark]}>
                {weather.description}
              </Text>
            </View>
          </View>
          
          <CustomButton
            title="⭐ Lägg till favorit"
            onPress={async () => {
              await saveFavorite(weather.name);
              Toast.show({
                type: "success",
                text1: `${weather.name} tillagd i favoriter`,
                position: "bottom",
              });
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#f5f7fa",
  },
  containerDark: {
    backgroundColor: "#0d1117",
  },
  textDark: {
    color: "#fff",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 20, 
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e1e4e8",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "white",
    color: "#000",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputDark: {
    backgroundColor: "#161b22",
    borderColor: "#30363d",
    color: "#fff",
  },
  btnRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardDark: {
    backgroundColor: "#161b22",
    borderColor: "#30363d",
  },
  cityName: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 12, 
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 16,
  },
  icon: { 
    width: 80, 
    height: 80, 
    marginRight: 16,
  },
  temp: { 
    fontSize: 42, 
    fontWeight: "800", 
    color: "#007AFF",
    letterSpacing: -1,
  },
  desc: { 
    textTransform: "capitalize", 
    marginTop: 6, 
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});