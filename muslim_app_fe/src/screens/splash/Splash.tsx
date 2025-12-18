import React, { useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import { styles } from './splash-style';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function SplashScreen() {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const pulse = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });

    textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(500, withSpring(0, { damping: 12 }));

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [opacity, scale, textOpacity, textTranslateY, pulse]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.15 - (pulse.value - 1) * 0.5,
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient
        colors={['#20493b', '#2E7D32', '#1b3d32']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        <AnimatedView style={[styles.iconContainer, iconAnimatedStyle]}>
          <AnimatedView
            style={[StyleSheet.absoluteFill, styles.pulseCircle, pulseStyle]}
          />
          <Ionicons name="moon-outline" size={80} color="#FFFFFF" />
        </AnimatedView>

        <AnimatedText style={[styles.title, textAnimatedStyle]}>
          MUSLIM APP
        </AnimatedText>
        <AnimatedText style={[styles.subtitle, textAnimatedStyle]}>
          Companion for Life
        </AnimatedText>
      </View>

      <AnimatedView style={[styles.footer, textAnimatedStyle]}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </AnimatedView>
    </View>
  );
}
