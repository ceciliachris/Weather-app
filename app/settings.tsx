import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from "react-native";
import { AppSettings, getSettings, updateSetting } from "@/components/storage";

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    temperatureUnit: 'celsius',
    theme: 'light',
    notifications: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await getSettings();
    setSettings(saved);
  };

  const handleToggleUnit = async () => {
    const newUnit = settings.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    await updateSetting('temperatureUnit', newUnit);
    setSettings({ ...settings, temperatureUnit: newUnit });
  };

  const handleToggleTheme = async () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    await updateSetting('theme', newTheme);
    setSettings({ ...settings, theme: newTheme });
    Alert.alert("Tema ändrat", "Starta om appen för att se det nya temat.");
  };

  const handleToggleNotifications = async () => {
    const newValue = !settings.notifications;
    await updateSetting('notifications', newValue);
    setSettings({ ...settings, notifications: newValue });
  };

  const isDark = settings.theme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Inställningar</Text>

      {/* TEMPERATURENHET */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, isDark && styles.textDark]}>Temperaturenhet</Text>
            <Text style={[styles.sublabel, isDark && styles.sublabelDark]}>
              Nuvarande: {settings.temperatureUnit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleToggleUnit}>
            <Text style={styles.buttonText}>
              {settings.temperatureUnit === 'celsius' ? '°C → °F' : '°F → °C'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FÄRGTEMA */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, isDark && styles.textDark]}>Färgtema</Text>
            <Text style={[styles.sublabel, isDark && styles.sublabelDark]}>
              Nuvarande: {settings.theme === 'light' ? 'Ljust' : 'Mörkt'}
            </Text>
          </View>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{ false: "#ccc", true: "#007AFF" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* NOTIFIKATIONER */}
      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, isDark && styles.textDark]}>Notifikationer</Text>
            <Text style={[styles.sublabel, isDark && styles.sublabelDark]}>
              Få väderuppdateringar
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: "#ccc", true: "#007AFF" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <Text style={[styles.info, isDark && styles.textDark]}>
        💡 Tips: Temperaturenheten uppdateras direkt på huvudsidan!
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#2a2a2a",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  sublabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  sublabelDark: {
    color: "#aaa",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  info: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});