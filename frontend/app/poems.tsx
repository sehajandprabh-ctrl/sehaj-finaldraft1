import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio, useUser } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const POEMS = [
  {
    title: "My Heart Knew",
    content: "From the moment we first spoke,\nMy heart knew you were special.\nIn your laugh, I found my joy,\nIn your eyes, my endless wonder.\nYou are the reason I smile.",
    icon: 'heart',
    color: '#E8638F',
  },
  {
    title: "Forever Yours",
    content: "Through every storm and sunny day,\nI choose you, again and again.\nYou are my home, my peace,\nThe calm within my chaos.\nForever, I am yours.",
    icon: 'sunny',
    color: '#FBBF24',
  },
  {
    title: "Us",
    content: "Two hearts that beat as one,\nTwo souls that found each other.\nIn a world of billions,\nI found my everything.\nYou are my miracle.",
    icon: 'sparkles',
    color: '#A78BFA',
  },
];

export default function Poems() {
  const router = useRouter();
  const { userName } = useUser();
  const { colors, isDark } = useTheme();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [currentPoem, setCurrentPoem] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const poemAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    poemAnim.setValue(0);
    Animated.spring(poemAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [currentPoem]);

  const nextPoem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playClick();
    if (currentPoem < POEMS.length - 1) {
      setCurrentPoem(currentPoem + 1);
    }
  };

  const prevPoem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playClick();
    if (currentPoem > 0) {
      setCurrentPoem(currentPoem - 1);
    }
  };

  const poem = POEMS[currentPoem];

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
            <Text style={[styles.pageLabel, { color: colors.textSecondary }]}>Love Poems</Text>
            <Text style={[styles.forText, { color: colors.textMuted }]}>Written for {userName}</Text>

            <Text style={[styles.counter, { color: colors.primary }]}>
              {currentPoem + 1} / {POEMS.length}
            </Text>

            <Animated.View
              style={[
                styles.poemWrapper,
                {
                  opacity: poemAnim,
                  transform: [
                    {
                      scale: poemAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <ThemedCard variant="glow" glowColor={poem.color} style={styles.poemCard}>
                <View style={[styles.iconCircle, { backgroundColor: poem.color + '20' }]}>
                  <Ionicons name={poem.icon as any} size={40} color={poem.color} />
                </View>
                <Text style={[styles.poemTitle, { color: poem.color }]}>{poem.title}</Text>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.poemContent, { color: colors.textPrimary }]}>{poem.content}</Text>
              </ThemedCard>
            </Animated.View>

            <View style={styles.navButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  currentPoem === 0 && styles.navButtonDisabled,
                ]}
                onPress={prevPoem}
                disabled={currentPoem === 0}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={currentPoem === 0 ? colors.textMuted : colors.primary}
                />
              </TouchableOpacity>

              <View style={styles.dotsContainer}>
                {POEMS.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { backgroundColor: colors.border },
                      currentPoem === index && { backgroundColor: colors.primary },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  currentPoem === POEMS.length - 1 && styles.navButtonDisabled,
                ]}
                onPress={nextPoem}
                disabled={currentPoem === POEMS.length - 1}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={currentPoem === POEMS.length - 1 ? colors.textMuted : colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                playComplete();
                router.push('/confession');
              }}
              activeOpacity={0.9}
              style={{ marginTop: 24 }}
            >
              <LinearGradient
                colors={colors.gradientPrimary as any}
                style={[styles.button, { shadowColor: colors.primary }]}
              >
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                playClick();
                router.push('/confession');
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
    marginBottom: 4,
  },
  forText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  poemWrapper: {
    width: '100%',
  },
  poemCard: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  poemTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 2,
    borderRadius: 1,
    marginBottom: 20,
  },
  poemContent: {
    fontSize: 17,
    lineHeight: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 20,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
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
