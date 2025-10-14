import { AppSettings, getFavorites, getSettings, removeFavorite } from "@/components/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    temperatureUnit: 'celsius',
    theme: 'light',
    notifications: true,
  });
  const router = useRouter();

  const loadData = async () => {
    const favs = await getFavorites();
    const saved = await getSettings();
    setFavorites(favs);
    setSettings(saved);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleRemove = async (city: string) => {
    await removeFavorite(city);
    loadData();
  };

  const isDark = settings.theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Favoritstäder</Text>
      {favorites.length === 0 ? (
        <Text style={[styles.empty, isDark && styles.textDark]}>Inga favoriter ännu.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={[styles.item, isDark && styles.itemDark]}>
              <TouchableOpacity onPress={() => router.push(`/?city=${item}`)}>
                <Text style={[styles.city, isDark && styles.cityDark]}>{item}</Text>
              </TouchableOpacity>
              <Button title="Ta bort" onPress={() => handleRemove(item)} color="#FF3B30" />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  empty: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
    fontStyle: "italic",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  itemDark: {
    backgroundColor: "#161b22",
    borderColor: "#30363d",
  },
  city: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  cityDark: {
    color: "#58a6ff",
  },
});