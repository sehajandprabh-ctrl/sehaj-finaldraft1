import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function LoveMeter() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [sliderValue, setSliderValue] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleSliderComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playSuccess();
    Animated.timing(fillAnim, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setShowMessage(true);
      Animated.spring(messageAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <ThemedBackground>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { playClick(); router.back(); }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.heartContainer, { transform: [{ scale: heartPulse }] }]}>
            <Animated.View style={[styles.heartGlow, { backgroundColor: colors.primaryGlow, opacity: glowAnim }]} />
            <Ionicons name="heart" size={80} color={colors.primary} />
          </Animated.View>
          
          <Text style={[styles.title, { color: colors.textPrimary }]}>Love Meter 💕</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>How much do I love you?</Text>
          
          <View style={styles.meterContainer}>
            <View style={[styles.meterBackground, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Animated.View 
                style={[
                  styles.meterFill,
                  { 
                    backgroundColor: colors.primary,
                    width: hasInteracted 
                      ? fillAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        })
                      : `${sliderValue}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.meterValue, { color: colors.primary }]}>
              {hasInteracted && showMessage ? '100' : Math.round(sliderValue)}%
            </Text>
          </View>
          
          {!showMessage && (
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderLabel, { color: colors.textMuted }]}>Slide to measure</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={sliderValue}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSliderComplete}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />
            </View>
          )}
          
          {showMessage && (
            <Animated.View style={[styles.messageContainer, { opacity: messageAnim, transform: [{ scale: messageAnim }] }]}>
              <ThemedCard variant="glow" glowColor={colors.primary}>
                <View style={[styles.brokenBadge, { backgroundColor: colors.primaryGlow }]}>
                  <Ionicons name="construct" size={24} color={colors.primary} />
                  <Text style={[styles.brokenText, { color: colors.primary }]}>BROKEN</Text>
                </View>
                <Text style={[styles.messageText, { color: colors.textPrimary }]}>
                  Sorry, it's broken...{"\n"}
                  It only shows 100% 💕
                </Text>
                <Text style={[styles.subMessage, { color: colors.textSecondary }]}>
                  No matter what, my love for you is always at maximum.
                </Text>
              </ThemedCard>
              
              <TouchableOpacity
                onPress={() => { playComplete(); router.push('/hold-reveal'); }}
                activeOpacity={0.9}
                style={styles.buttonWrapper}
              >
                <LinearGradient
                  colors={colors.gradientPrimary as any}
                  style={[styles.button, { shadowColor: colors.primary }]}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {!showMessage && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => { playClick(); router.push('/hold-reveal'); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </SafeAreaView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  meterContainer: {
    width: width - 80,
    alignItems: 'center',
    marginBottom: 30,
  },
  meterBackground: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  meterFill: {
    height: '100%',
    borderRadius: 20,
  },
  meterValue: {
    fontSize: 48,
    fontWeight: '700',
    marginTop: 16,
  },
  sliderContainer: {
    width: width - 80,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  messageContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  brokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  brokenText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  messageText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonWrapper: {
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
