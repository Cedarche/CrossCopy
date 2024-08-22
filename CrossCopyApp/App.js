import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Appearance, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { lightTheme, darkTheme } from "./Theme/theme";
import ThemeContext from "./Theme/ThemeContext";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { auth, onAuthStateChanged } from "./Firebase";

import AuthHome from "./Components/Auth/AuthHome";
import Homepage from "./Components/Home/HomePage";
import SplashScreen from "./Components/Auth/SplashScreen";
import "react-native-gesture-handler";
import "expo-dev-client";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(null); // Local signed-in state.
  const [theme, setTheme] = useState(darkTheme); // Theme state
  const colorScheme = useColorScheme();

  // Handle user state changes
  function onAuthStateChange(user) {
    if (user) {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChange);

    // Set theme based on device settings

    if (colorScheme === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }

    // Optionally, listen for theme changes
    const themeSubscription = Appearance.addChangeListener(
      ({ colorScheme }) => {
        if (colorScheme === "dark") {
          setTheme(darkTheme);
        } else {
          setTheme(lightTheme);
        }
      }
    );

    // unsubscribe on unmount
    return () => {
      unsubscribe();
      themeSubscription.remove();
    };
  }, []);

  let content;
  if (isSignedIn === null) {
    content = <SplashScreen homePage={false} />;
  } else if (isSignedIn) {
    content = <Homepage />;
  } else {
    content = <AuthHome />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={theme}>
        {content}
        <StatusBar style="light" />
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}
