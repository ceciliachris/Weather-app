import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favoriteCities';

export const saveFavorite = async (city: string): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = existing ? JSON.parse(existing) : [];

    if (!favorites.includes(city)) {
      favorites.push(city);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error("Error saving favorite:", error);
    throw error;
  }
};

export const removeFavorite = async (city: string): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = existing ? JSON.parse(existing) : [];
    const updated = favorites.filter((c: string) => c !== city);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const result = await AsyncStorage.getItem(FAVORITES_KEY);
    return result ? JSON.parse(result) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};