import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isDark ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.timing(rotateAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDark]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.slider,
          {
            backgroundColor: isDark ? colors.primary : colors.secondary,
            transform: [{ translateX }],
            shadowColor: isDark ? colors.primary : colors.secondary,
          },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={16}
            color="#FFFFFF"
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
  },
  slider: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default ThemeToggle;
