import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, auth } from '../../Firebase';
import { styles } from '../Styles';
import { Path, Svg } from 'react-native-svg';
import { Animated } from 'react-native';

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

export default function SplashScreen({ homePage }) {
  const windowHeight = Dimensions.get('window').height;

  const screenWidth = Dimensions.get('window').width;

  const mobileRectData = Array.from({ length: 10 }, (_, i) => ({
    leftWidth: ((150 - i * 10) * screenWidth) / 100, // Convert percentage to pixels
    topWidth: ((75 - i * 10) * windowHeight) / 100, // Convert percentage to pixels
    height: windowHeight,
    color: interpolateColor('#24242411', '#00ffff11', i / 9),
  }));

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
            homePage={homePage}
          />
        ))}
        <View style={styles.topView}>
          <Text style={styles.header}>CROSS COPY</Text>
          <Text style={styles.subHeader}>Simple cross-platform file transfer</Text>
        </View>

        <View style={styles.bottomView}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>

        {/* <StatusBar style="auto" /> */}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const RectRight = ({ height, color, leftWidth, topWidth, delay, homePage }) => {
  const opacity = new Animated.Value(homePage ? 1 : 1);
  // if (homePage) {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(opacity, {
  //         toValue: 0,
  //         duration: 1000,
  //         delay: delay,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(opacity, {
  //         toValue: 1,
  //         duration: 1000,
  //         // delay: delay,
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //     {
  //       iterations: -1, // Infinite iterations
  //     }
  //   ).start();
  // }

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
