import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SettingsProvider } from "@/context/SettingsContext";
import Toast from 'react-native-toast-message';

export default function Layout() {
  return (
    <SettingsProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Hem",
            tabBarLabel: "Hem",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favoriter",
            tabBarLabel: "Favoriter",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Inställningar",
            tabBarLabel: "Inställningar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
      <Toast />
    </SettingsProvider>
  );
}