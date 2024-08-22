import React, { useState, useEffect, memo, useMemo } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  auth,
} from "../../Firebase";
import { styles } from "../Styles";
import { Path, Svg } from "react-native-svg";
import { Animated } from "react-native";

export function interpolateColor(color1, color2, factor) {
  const result = color1
    .slice(1)
    .match(/.{2}/g)
    .map((byte, i) =>
      Math.round(
        parseInt(byte, 16) +
          factor *
            (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) -
              parseInt(byte, 16))
      )
    );

  return `#${result.map((byte) => `0${byte.toString(16)}`.slice(-2)).join("")}`;
}

export default function Authhome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const windowHeight = useMemo(() => Dimensions.get("window").height, []);
  const delayDuration = 100; // 100ms delay between each

  const screenWidth = useMemo(() => Dimensions.get("window").width, []);

  const mobileRectData = Array.from({ length: 10 }, (_, i) => ({
    leftWidth: ((150 - i * 10) * screenWidth) / 100, // Convert percentage to pixels
    topWidth: ((75 - i * 10) * windowHeight) / 100, // Convert percentage to pixels
    height: windowHeight,
    color: interpolateColor("#24242411", "#00ffff11", i / 9),
  }));

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error signing in", error);
      setLoading(false);

      setError(String(error.code).split("/")[1]);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error signing up", error);
      setLoading(false);

      setError(String(error.code).split("/")[1]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {mobileRectData.map((rect, index) => (
          <RectRight
            key={index}
            height={rect.height}
            color={rect.color}
            leftWidth={rect.leftWidth}
            topWidth={rect.topWidth}
 
          />
        ))}
        <View style={styles.topView}>
          <Text style={styles.header}>CROSS COPY</Text>
          <Text style={styles.subHeader}>
            Simple cross-platform file transfer
          </Text>
        </View>

        {loading ? (
          <View style={styles.bottomView}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
        ) : (
          <View style={styles.bottomView}>
            <TextInput
              placeholderTextColor={"grey"}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false} // Disable auto-correct
              spellCheck={false} // Disable spell-check
              textContentType='oneTimeCode'
              importantForAutofill="no" // Prevents some autofill behaviors that may cause flickering
            />
            <TextInput
              placeholderTextColor={"grey"}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              autoComplete="current-password"
              textContentType='oneTimeCode'
            />
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.text}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.text}>Create Account</Text>
            </TouchableOpacity>
            <View style={styles.errorContainer}>
              {error && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
          </View>
        )}

        {/* <StatusBar style="auto" /> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const RectRight = memo(({ height, color, leftWidth, topWidth, delay }) => {
  const [opacity] = useState(new Animated.Value(0)); // Initialize opacity with a value of 0

  useEffect(() => {
    // Trigger the fade-in animation once when the component mounts
    Animated.timing(opacity, {
      toValue: 1,
      duration: 2000,
      delay: delay || 0,
      useNativeDriver: true,
    }).start();
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <Animated.View style={[rectStyles.rectRight, { height: height, opacity }]}>
      <Svg height="100%" width="100%">
        <Path
          d={`M0,0 L${leftWidth / 1},0 L100,${topWidth / 0.4} L-20,${
            height / 1.2
          } Z`}
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
});

const rectStyles = StyleSheet.create({
  rectRight: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 0,
  },
});
