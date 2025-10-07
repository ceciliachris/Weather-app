import React from "react";
import { SafeAreaView } from "react-native";
import StartScreen from "../components/StartScreen";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StartScreen />
    </SafeAreaView>
  );
}