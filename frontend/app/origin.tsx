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

const STICKER_CITY = 'https://customer-assets.emergentagent.com/job_love-adventure-49/artifacts/7apudxnx_IMG_5617.jpeg';

export default function OriginStory() {
  const router = useRouter();
  const { userName } = useUser();
  const { playKiss, playClick } = useAudio();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
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
              transform: [{ translateY: floatTranslate }, { rotate: '10deg' }],
            },
          ]}
        >
          <View style={styles.heartStickerWrapper}>
            <Ionicons name="heart" size={120} color={colors.primary} style={styles.heartBg} />
            <Image
              source={{ uri: STICKER_CITY }}
              style={[styles.stickerImage, { borderColor: colors.card }]}
            />
          </View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.pageLabel, { color: colors.textSecondary }]}>Our Beginning</Text>

            <Animated.View
              style={[
                styles.heartIcon,
                { transform: [{ scale: heartPulse }] },
              ]}
            >
              <View style={[styles.heartGlow, { backgroundColor: colors.primaryGlow }]} />
              <Ionicons name="heart-circle" size={70} color={colors.primary} />
            </Animated.View>

            <ThemedCard style={styles.storyCard} variant="glow" glowColor={colors.primary}>
              <Text style={[styles.storyText, { color: colors.textPrimary }]}>
                Our first meeting was at Calgary Stampede. She walked towards my car, busy traffic, sat inside. I genuinely fell in love all over again, the way she smiled at my smile and laughed at my laugh. I love you so much.
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <Text style={[styles.storyText, { color: colors.textPrimary }]}>
                Sehaj. You're my comfort person, my crush, my pillow, and my sandbag to beat up. You're my everything for eternity.
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              <View style={[styles.detailContainer, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : '#FFF9E6' }]}>
                <Ionicons name="star" size={20} color="#FBBF24" />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  Something small I remember is how expressive your face is. I can read your emotions from your eyes alone.
                </Text>
              </View>
            </ThemedCard>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                playKiss();
                router.push('/early-feelings');
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
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  heartIcon: {
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
  storyCard: {
    width: '100%',
    marginBottom: 32,
  },
  storyText: {
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 1,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
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
    right: 10,
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
