import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

const OPEN_WEATHER_API_KEY = "8df6d1b3d6a14bf114eca0c33846939e";

export default function StartScreen() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
    icon: string;
    name: string;
  } | null>(null);

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
    } catch (err: any) {
      Alert.alert("Fel", err.message || "Kunde inte hämta väder.");
    } finally {
      setLoading(false);
    }
  };

  const iconUrl = (icon: string) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Väderappen — Huvudsida</Text>
      <TextInput
        style={styles.input}
        placeholder="Skriv stad (t.ex. Stockholm)"
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
        <View style={styles.card}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <View style={styles.row}>
            <Image source={{ uri: iconUrl(weather.icon) }} style={styles.icon} />
            <View>
              <Text style={styles.temp}>{weather.temp}°C</Text>
              <Text style={styles.desc}>{weather.description}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "flex-start", backgroundColor: "#fafafa" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8 },
  btnRow: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", width: 120 },
  card: { marginTop: 20, padding: 16, borderRadius: 12, backgroundColor: "white", shadowColor: "#000", shadowOpacity: 0.05, elevation: 3 },
  cityName: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 64, height: 64, marginRight: 12 },
  temp: { fontSize: 28, fontWeight: "700" },
  desc: { textTransform: "capitalize", marginTop: 4 },
});