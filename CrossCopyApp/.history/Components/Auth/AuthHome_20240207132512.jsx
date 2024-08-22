import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
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
  Platform
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, auth } from '../../Firebase';
import { styles } from '../Styles';
import { Path, Svg } from 'react-native-svg';
import { Animated } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export function interpolateColor(color1, color2, factor) {
  const result = color1
    .slice(1)
    .match(/.{2}/g)
    .map((byte, i) =>
      Math.round(
        parseInt(byte, 16) +
          factor * (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) - parseInt(byte, 16))
      )
    );

  return `#${result.map((byte) => `0${byte.toString(16)}`.slice(-2)).join('')}`;
}

export default function Authhome() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const windowHeight = Dimensions.get('window').height;
  const delayDuration = 100; // 100ms delay between each

  const screenWidth = Dimensions.get('window').width;

  const mobileRectData = Array.from({ length: 10 }, (_, i) => ({
    leftWidth: ((150 - i * 10) * screenWidth) / 100, // Convert percentage to pixels
    topWidth: ((75 - i * 10) * windowHeight) / 100, // Convert percentage to pixels
    height: windowHeight,
    color: interpolateColor('#24242411', '#00ffff11', i / 9),
  }));

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error signing in', error);
      setLoading(false);

      setError(String(error.code).split('/')[1]);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error signing up', error);
      setLoading(false);

      setError(String(error.code).split('/')[1]);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {mobileRectData.map((rect, index) => (
          <RectRight
            key={index}
            height={rect.height}
            color={rect.color}
            leftWidth={rect.leftWidth}
            topWidth={rect.topWidth}
            // delay={(mobileRectData.length - 1 - index) * delayDuration}
            delay={index * 100} // 100ms delay between each
          />
        ))}
        <View style={styles.topView}>
          <Text style={styles.header}>CROSS COPY</Text>
          <Text style={styles.subHeader}>Simple cross-platform file transfer</Text>
        </View>

        {loading ? (
          <View style={styles.bottomView}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          <View style={styles.bottomView}>
            <TextInput
              placeholderTextColor={'grey'}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
            />
            <TextInput
              placeholderTextColor={'grey'}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <Text style={styles.text}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.text}>Create Account</Text>
            </TouchableOpacity>
            <View style={styles.errorContainer}>
              {error && <Text style={{ color: 'red' }}>{error}</Text>}
            </View>
          </View>
        )}

        {/* <StatusBar style="auto" /> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const RectRight = ({ height, color, leftWidth, topWidth, delay }) => {
  const opacity = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        delay: delay,
        useNativeDriver: true,
      }),
      // Animated.timing(opacity, {
      //   toValue: 0.2,
      //   duration: 2000,
      //   delay: delay,
      //   useNativeDriver: true,
      // }),
    ]),
    {
      iterations: 1, // Infinite iterations
    }
  ).start();

  return (
    <Animated.View style={[rectStyles.rectRight, { height: height, opacity }]}>
      <Svg height="100%" width="100%">
        <Path
          d={`M0,0 L${leftWidth / 1},0 L100,${topWidth / 0.4} L-20,${height / 1.2} Z`}
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
};

const rectStyles = StyleSheet.create({
  rectRight: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 0,
  },
});
