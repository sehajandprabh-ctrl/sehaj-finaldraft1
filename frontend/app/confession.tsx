import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser, useAudio } from './_layout';
import { useTheme } from './theme/ThemeContext';
import { ThemedBackground, ThemedCard } from './components/themed';
import * as Haptics from 'expo-haptics';

export default function Confession() {
  const router = useRouter();
  const { userName } = useUser();
  const { playClick } = useAudio();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const line1Anim = useRef(new Animated.Value(0)).current;
  const line2Anim = useRef(new Animated.Value(0)).current;
  const line3Anim = useRef(new Animated.Value(0)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.stagger(1200, [
      Animated.timing(line1Anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(line2Anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(line3Anim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const confessionLines = [
    { text: 'You changed me.', anim: line1Anim },
    { text: 'You made me better.', anim: line2Anim },
    { text: 'You feel like home.', anim: line3Anim },
  ];

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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={[styles.pageLabel, { color: colors.textSecondary }]}>A Quiet Confession</Text>

            <Animated.View
              style={[
                styles.heartContainer,
                { transform: [{ scale: heartPulse }] },
              ]}
            >
              <View style={[styles.heartGlow, { backgroundColor: colors.primaryGlow }]} />
              <Ionicons name="heart" size={60} color={colors.primary} />
            </Animated.View>

            <ThemedCard variant="glow" glowColor={colors.primary} style={styles.confessionCard}>
              <Text style={[styles.toText, { color: colors.textSecondary }]}>Dear {userName},</Text>

              <View style={styles.linesContainer}>
                {confessionLines.map((line, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.lineWrapper,
                      {
                        opacity: line.anim,
                        transform: [
                          {
                            translateY: line.anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text style={[styles.confessionLine, { color: colors.textPrimary }]}>{line.text}</Text>
                  </Animated.View>
                ))}
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <Text style={[styles.closingText, { color: colors.textSecondary }]}>
                Every moment with you feels like a gift I never knew I deserved.
                You've become my favorite person, my safe place, my everything.
              </Text>

              <View style={[styles.dateContainer, { backgroundColor: colors.primaryGlow }]}>
                <Ionicons name="calendar-heart" size={20} color={colors.primary} />
                <Text style={[styles.dateText, { color: colors.primary }]}>July 11 — Our day 💕</Text>
              </View>
            </ThemedCard>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playClick();
                router.push('/question');
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={colors.gradientPrimary as any}
                style={[styles.button, { shadowColor: colors.primary }]}
              >
                <Text style={styles.buttonText}>One last thing</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                playClick();
                router.push('/question');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 100,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  heartContainer: {
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  confessionCard: {
    width: '100%',
    marginBottom: 32,
  },
  toText: {
    fontSize: 18,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  linesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  lineWrapper: {
    alignItems: 'center',
  },
  confessionLine: {
    fontSize: 26,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    width: 60,
    height: 2,
    alignSelf: 'center',
    marginVertical: 24,
    borderRadius: 1,
  },
  closingText: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 12,
    borderRadius: 20,
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 30,
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
