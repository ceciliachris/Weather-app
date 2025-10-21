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
import CustomButton from "@/components/CustomButton";
import { saveFavorite } from "@/services/favorites";
import { 
  fetchWeatherByCity, 
  fetchWeatherByLocation, 
  getWeatherIconUrl 
} from "@/services/weather";
import { useSettings } from "@/hooks/useSettings";
import { WeatherData } from "@/types";

export default function Index() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const { isDark, displayTemp } = useSettings();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.city) {
      const cityName = Array.isArray(params.city) ? params.city[0] : params.city;
      handleFetchWeather(cityName);
    }
  }, [params.city]);

  const handleFetchWeather = async (cityName: string) => {
    try {
      setLoading(true);
      setWeather(null);
      const data = await fetchWeatherByCity(cityName);
      setWeather(data);
      setCity("");
    } catch (err: any) {
      Alert.alert("Fel", err.message || "Kunde inte hämta väder.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationWeather = async () => {
    try {
      setLoading(true);
      setWeather(null);
      const data = await fetchWeatherByLocation();
      setWeather(data);
      setCity("");
    } catch (err: any) {
      Alert.alert("Fel", err.message || "Kunde inte hämta plats.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    if (!weather) return;
    
    try {
      await saveFavorite(weather.name);
      Toast.show({
        type: "success",
        text1: `${weather.name} tillagd i favoriter`,
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Kunde inte lägga till favorit",
        position: "bottom",
      });
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Väderapp</Text>

      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder="Skriv stad (t.ex. Stockholm)"
        placeholderTextColor={isDark ? "#999" : "#666"}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={() => handleFetchWeather(city)}
        returnKeyType="search"
      />

      <View style={styles.btnRow}>
        <CustomButton title="Sök" onPress={() => handleFetchWeather(city)} />
        <CustomButton 
          title="📍 Använd min plats" 
          onPress={handleLocationWeather} 
        />
      </View>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {weather && (
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cityName, isDark && styles.textDark]}>
            {weather.name}
          </Text>
          <View style={styles.row}>
            <Image 
              source={{ uri: getWeatherIconUrl(weather.icon) }} 
              style={styles.icon} 
            />
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
            onPress={handleAddFavorite}
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