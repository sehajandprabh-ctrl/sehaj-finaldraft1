import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser, useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const STICKER_BABY = 'https://customer-assets.emergentagent.com/job_love-adventure-49/artifacts/dhaq8syh_IMG_5559.png';

export default function EarlyFeelings() {
  const router = useRouter();
  const { userName } = useUser();
  const { playKiss, playClick } = useAudio();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const card1Anim = useRef(new Animated.Value(50)).current;
  const card2Anim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(200, [
        Animated.spring(card1Anim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(card2Anim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

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

        <Animated.View
          style={[
            styles.stickerContainer,
            {
              transform: [{ translateY: floatTranslate }, { rotate: '-15deg' }],
            },
          ]}
        >
          <View style={styles.heartStickerWrapper}>
            <Ionicons name="heart" size={120} color={colors.primaryLight} style={styles.heartBg} />
            <Image
              source={{ uri: STICKER_BABY }}
              style={[styles.stickerImage, { borderColor: colors.card }]}
            />
          </View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={[styles.pageLabel, { color: colors.textSecondary }]}>Early Feelings</Text>

            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ translateY: floatTranslate }], backgroundColor: colors.primaryGlow },
              ]}
            >
              <Ionicons name="heart-half" size={60} color={colors.primary} />
            </Animated.View>

            <Animated.View style={{ transform: [{ translateX: card1Anim }], width: '100%' }}>
              <ThemedCard style={[styles.feelingCard, { borderLeftColor: colors.primary }]} variant="glow" glowColor={colors.primary}>
                <View style={styles.cardHeader}>
                  <Ionicons name="flash" size={24} color={colors.primary} />
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>When I First Liked You</Text>
                </View>
                <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                  Seeing you on Wizz lowkey was all I needed, but growing to know that you're such an amazing person on the inside as well, was when I liked you.
                </Text>
              </ThemedCard>
            </Animated.View>

            <Animated.View style={{ transform: [{ translateX: Animated.multiply(card2Anim, -1) }], width: '100%' }}>
              <ThemedCard style={[styles.feelingCard, { borderRightColor: colors.secondary, borderRightWidth: 4, borderLeftWidth: 0 }]} variant="glow" glowColor={colors.secondary}>
                <View style={styles.cardHeader}>
                  <Ionicons name="sparkles" size={24} color={colors.secondary} />
                  <Text style={[styles.cardTitle, { color: colors.secondary }]}>
                    When I Knew You Felt It Too
                  </Text>
                </View>
                <Text style={[styles.cardText, { color: colors.textSecondary }]}>
                  When you fucked me.
                </Text>
              </ThemedCard>
            </Animated.View>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playKiss();
                router.push('/memories');
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={colors.gradientPrimary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.button, { shadowColor: colors.primary }]}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                playClick();
                router.push('/crossword');
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
  },
  content: {
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  iconContainer: {
    marginBottom: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feelingCard: {
    width: '100%',
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 26,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    marginTop: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
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
  stickerContainer: {
    position: 'absolute',
    top: 50,
    left: 5,
    zIndex: 10,
  },
  heartStickerWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartBg: {
    position: 'absolute',
  },
  stickerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 12,
    borderWidth: 3,
  },
});
