import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const ProgressBar = ({ uploadProgress }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: uploadProgress.progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [uploadProgress, widthAnim]);

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: uploadProgress > 0 ? '#00ff00' : 'transparent',
          },
        ]}
      />
    </View>
  );
};

const DownloadBar = ({ downloadInProgress }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(widthAnim, {
        toValue: downloadInProgress ? 1 : 0,
        duration: 1500,
        useNativeDriver: false,
      })
    ).start();
  }, [downloadInProgress, widthAnim]);

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[
          styles.downloadBar,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            opacity: widthAnim, // Alternatively, use the opacity for fade in/out effect
            backgroundColor: downloadInProgress ? '#f700ff' : 'transparent',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%',
    height: 2,
    marginTop: -2,
    backgroundColor: '#a54343'
  },
  progressBar: {
    height: 2,
  },
  downloadBar: {
    height: 2,
  },
});

export { ProgressBar, DownloadBar };
