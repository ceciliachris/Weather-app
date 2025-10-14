import { AppSettings, getSettings, updateSetting } from "@/components/storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

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
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  textDark: {
    color: "#fff",
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardDark: {
    backgroundColor: "#161b22",
    borderColor: "#30363d",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  sublabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  sublabelDark: {
    color: "#8b949e",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  info: {
    marginTop: 24,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});