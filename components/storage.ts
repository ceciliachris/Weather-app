import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favoriteCities';
const SETTINGS_KEY = 'appSettings';


export const saveFavorite = async (city: string) => {
    try {
        const existing = await AsyncStorage.getItem(FAVORITES_KEY);
        const favorites = existing ? JSON.parse(existing) : [];

        if (!favorites.includes(city)) {
            favorites.push(city);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error("Error saving favorite:", error);
    }
};

export const removeFavorite = async (city: string) => {
    try {
        const existing = await AsyncStorage.getItem(FAVORITES_KEY);
        const favorites = existing ? JSON.parse(existing) : [];
        const updated = favorites.filter((c: string) => c !== city);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Error removing favorite:", error);
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

export interface AppSettings {
    temperatureUnit: 'celsius' | 'fahrenheit';
    theme: 'light' | 'dark';
    notifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
    temperatureUnit: 'celsius',
    theme: 'light',
    notifications: true,
};

export const getSettings = async (): Promise<AppSettings> => {
    try {
        const result = await AsyncStorage.getItem(SETTINGS_KEY);
        return result ? JSON.parse(result) : DEFAULT_SETTINGS;
    } catch (error) {
        console.error("Error getting settings:", error);
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = async (settings: AppSettings) => {
    try {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Error saving settings:", error);
    }
};

export const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
) => {
    try {
        const current = await getSettings();
        const updated = { ...current, [key]: value };
        await saveSettings(updated);
    } catch (error) {
        console.error("Error updating setting:", error);
    }
};