import React, { useState, useEffect, useRef } from 'react';
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
import { useUser, useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const REVEAL_LINES = [
  'I already know my answer.',
  'You already have my heart.',
  'So I was hoping...',
];

export default function Question() {
  const router = useRouter();
  const { userName } = useUser();
  const { colors, isDark } = useTheme();
  const { playMagic, playComplete, playDrumroll, playClick } = useAudio();
  const [showQuestion, setShowQuestion] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lineAnims = useRef(REVEAL_LINES.map(() => new Animated.Value(0))).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const heartFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    playDrumroll();

    const animateLines = async () => {
      for (let i = 0; i < REVEAL_LINES.length; i++) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            Animated.timing(lineAnims[i], {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start(() => resolve());
          }, i * 1500);
        });
      }

      setTimeout(() => {
        setShowQuestion(true);
        Animated.spring(questionAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          setShowButtons(true);
          Animated.spring(buttonsAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }, 800);
      }, 1500);
    };

    animateLines();

    Animated.loop(
      Animated.sequence([
        Animated.timing(heartFloat, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(heartFloat, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleYes = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playComplete();
    router.push('/celebration');
  };

  const heartTranslateY = heartFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
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

        <View style={styles.heartsBackground}>
          {[...Array(8)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.floatingHeart,
                {
                  left: `${10 + i * 12}%`,
                  top: `${5 + (i % 4) * 22}%`,
                  opacity: 0.1 + (i % 3) * 0.05,
                  transform: [
                    { translateY: heartTranslateY },
                    { scale: 0.4 + (i % 3) * 0.2 },
                  ],
                },
              ]}
            >
              <Ionicons name="heart" size={50} color={colors.primary} />
            </Animated.View>
          ))}
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.linesContainer}>
            {REVEAL_LINES.map((line, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.lineWrapper,
                  {
                    opacity: lineAnims[index],
                    transform: [
                      {
                        translateY: lineAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={[styles.revealLine, { color: colors.textSecondary }]}>{line}</Text>
              </Animated.View>
            ))}
          </View>

          {showQuestion && (
            <Animated.View
              style={[
                styles.questionContainer,
                {
                  opacity: questionAnim,
                  transform: [{ scale: questionAnim }],
                },
              ]}
            >
              <ThemedCard variant="glow" glowColor={colors.primary} style={styles.questionCard}>
                <Ionicons name="heart" size={50} color={colors.primary} />
                <Text style={[styles.questionText, { color: colors.textPrimary }]}>
                  Will you be my Valentine,{"\n"}
                  <Text style={[styles.nameHighlight, { color: colors.primary }]}>{userName}</Text>?
                </Text>
              </ThemedCard>
            </Animated.View>
          )}

          {showButtons && (
            <Animated.View
              style={[
                styles.buttonsContainer,
                {
                  opacity: buttonsAnim,
                  transform: [
                    {
                      translateY: buttonsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleYes}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={colors.gradientPrimary as any}
                  style={[styles.yesButton, { shadowColor: colors.primary }]}
                >
                  <Ionicons name="heart" size={24} color="#FFFFFF" />
                  <Text style={styles.yesButtonText}>YES</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.yesButtonOutline,
                  { backgroundColor: colors.card, borderColor: colors.primary },
                ]}
                onPress={handleYes}
                activeOpacity={0.8}
              >
                <Ionicons name="heart-outline" size={24} color={colors.primary} />
                <Text style={[styles.yesButtonTextOutline, { color: colors.primary }]}>
                  YES
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {!showQuestion && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                playClick();
                router.push('/celebration');
              }}
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
  heartsBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingHeart: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  linesContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  lineWrapper: {
    marginBottom: 16,
  },
  revealLine: {
    fontSize: 22,
    fontWeight: '300',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  questionContainer: {
    marginBottom: 40,
  },
  questionCard: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 36,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 42,
  },
  nameHighlight: {
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  yesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 30,
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  yesButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  yesButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 30,
    gap: 10,
    borderWidth: 2,
  },
  yesButtonTextOutline: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
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
