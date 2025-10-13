import { getFavorites, removeFavorite, getSettings, AppSettings } from "@/components/storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
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
    backgroundColor: "#fafafa",
  },
  containerDark: {
    backgroundColor: "#1a1a1a",
  },
  textDark: {
    color: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  empty: {
    fontSize: 16,
    color: "#666",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  itemDark: {
    backgroundColor: "#2a2a2a",
  },
  city: {
    fontSize: 18,
    color: "#007AFF",
  },
  cityDark: {
    color: "#4A9EFF",
  },
});