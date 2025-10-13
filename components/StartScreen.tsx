import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { saveFavorite, getSettings, AppSettings } from "./storage";
import { useFocusEffect } from "@react-navigation/native";

const OPEN_WEATHER_API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY as string;

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
    temperatureUnit: 'celsius',
    theme: 'light',
    notifications: true,
  });

  const params = useLocalSearchParams();

  // Ladda inställningar när sidan visas
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
      const cityName = Array.isArray(params.city) ? params.city[0] : params.city;
      setCity(cityName);
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

  // Konvertera temperatur baserat på inställning
  const displayTemp = (tempCelsius: number) => {
    if (settings.temperatureUnit === 'fahrenheit') {
      const fahrenheit = Math.round((tempCelsius * 9/5) + 32);
      return `${fahrenheit}°F`;
    }
    return `${tempCelsius}°C`;
  };

  const iconUrl = (icon: string) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const isDark = settings.theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Väderappen — Huvudsida</Text>
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
        <Button title="Sök" onPress={() => fetchWeather(city)} />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {weather && (
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cityName, isDark && styles.textDark]}>{weather.name}</Text>
          <View style={styles.row}>
            <Image source={{ uri: iconUrl(weather.icon) }} style={styles.icon} />
            <View>
              <Text style={[styles.temp, isDark && styles.textDark]}>
                {displayTemp(weather.temp)}
              </Text>
              <Text style={[styles.desc, isDark && styles.textDark]}>{weather.description}</Text>
            </View>
          </View>
        </View>
      )}

      <Button
        title="⭐ Lägg till favorit"
        onPress={async () => {
          if (!weather || !weather.name) {
            Alert.alert(
              "Ingen stad",
              "Sök efter en stad först innan du lägger till den som favorit."
            );
            return;
          }

          await saveFavorite(weather.name);
          Toast.show({
            type: "success",
            text1: `${weather.name} tillagd i favoriter`,
            position: "bottom",
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#fafafa",
  },
  containerDark: {
    backgroundColor: "#1a1a1a",
  },
  textDark: {
    color: "#fff",
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12, color: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#444",
    color: "#fff",
  },
  btnRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
  },
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#2a2a2a",
  },
  cityName: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#000" },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 64, height: 64, marginRight: 12 },
  temp: { fontSize: 28, fontWeight: "700", color: "#000" },
  desc: { textTransform: "capitalize", marginTop: 4, color: "#000" },
});