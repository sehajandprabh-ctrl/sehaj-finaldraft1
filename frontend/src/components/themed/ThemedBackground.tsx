import React, { useRef, useEffect, ReactNode } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

interface ThemedBackgroundProps {
  children: ReactNode;
  showFloatingElements?: boolean;
}

const FloatingHeart = ({ delay, x, y, size, opacity }: { delay: number; x: number; y: number; size: number; opacity: number }) => {
  const { colors } = useTheme();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(startAnimation, delay);
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          left: x,
          top: y,
          opacity: opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Ionicons name="heart" size={size} color={colors.primary} />
    </Animated.View>
  );
};

const FloatingSparkle = ({ delay, x, y, size, opacity }: { delay: number; x: number; y: number; size: number; opacity: number }) => {
  const { colors } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(startAnimation, delay);
  }, []);

  return (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          left: x,
          top: y,
          opacity: Animated.multiply(pulseAnim, opacity),
        },
      ]}
    >
      <Ionicons name="sparkles" size={size} color={colors.secondary} />
    </Animated.View>
  );
};

export const ThemedBackground: React.FC<ThemedBackgroundProps> = ({
  children,
  showFloatingElements = true,
}) => {
  const { colors, isDark } = useTheme();

  const floatingHearts = [
    { x: width * 0.1, y: height * 0.15, size: 20, opacity: 0.08, delay: 0 },
    { x: width * 0.85, y: height * 0.2, size: 16, opacity: 0.06, delay: 500 },
    { x: width * 0.25, y: height * 0.65, size: 24, opacity: 0.07, delay: 1000 },
    { x: width * 0.75, y: height * 0.55, size: 18, opacity: 0.05, delay: 1500 },
    { x: width * 0.5, y: height * 0.85, size: 22, opacity: 0.06, delay: 2000 },
  ];

  const floatingSparkles = [
    { x: width * 0.15, y: height * 0.35, size: 14, opacity: 0.1, delay: 300 },
    { x: width * 0.8, y: height * 0.4, size: 12, opacity: 0.08, delay: 800 },
    { x: width * 0.4, y: height * 0.75, size: 16, opacity: 0.09, delay: 1300 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark 
          ? [colors.background, colors.backgroundSecondary, colors.background]
          : [colors.background, colors.backgroundSecondary, colors.background]
        }
        style={styles.gradient}
      />
      
      {showFloatingElements && (
        <View style={styles.floatingContainer}>
          {floatingHearts.map((heart, index) => (
            <FloatingHeart key={`heart-${index}`} {...heart} />
          ))}
          {floatingSparkles.map((sparkle, index) => (
            <FloatingSparkle key={`sparkle-${index}`} {...sparkle} />
          ))}
        </View>
      )}
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  floatingElement: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});

export default ThemedBackground;
