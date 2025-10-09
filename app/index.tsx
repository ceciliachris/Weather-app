import React from "react";
import StartScreen from "../components/StartScreen";
import Toast from 'react-native-toast-message';

export default function Index() {
  return (
    <>
      <StartScreen />
      <Toast />
    </>
  );
}