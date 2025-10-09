import { getFavorites, removeFavorite } from "@/components/storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const handleRemove = async (city: string) => {
    await removeFavorite(city);
    loadFavorites();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritstäder</Text>
      {favorites.length === 0 ? (
        <Text>Inga favoriter ännu.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => router.push(`/?city=${item}`)}>
                <Text style={styles.city}>{item}</Text>
              </TouchableOpacity>
              <Button title="Ta bort" onPress={() => handleRemove(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  city: { fontSize: 18, color: "#007AFF" },
});