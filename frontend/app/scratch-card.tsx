import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;
const CARD_HEIGHT = 200;

const LOVE_MESSAGES = [
  "I love you more than yesterday, but less than tomorrow.",
  "You're the reason I believe in love.",
  "Every love story is beautiful, but ours is my favorite.",
  "I fell in love with you because of all the little things.",
];

export default function ScratchCard() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message] = useState(() => LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const scratchedAreas = useRef(new Set<string>());

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScratch = (x: number, y: number) => {
    const gridX = Math.floor(x / 20);
    const gridY = Math.floor(y / 20);
    const key = `${gridX}-${gridY}`;
    
    if (!scratchedAreas.current.has(key)) {
      scratchedAreas.current.add(key);
      const totalCells = Math.floor(CARD_WIDTH / 20) * Math.floor(CARD_HEIGHT / 20);
      const progress = (scratchedAreas.current.size / totalCells) * 100;
      setScratchProgress(progress);
      
      if (progress > 40 && !isRevealed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSuccess();
        setIsRevealed(true);
        Animated.spring(revealAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        handleScratch(locationX, locationY);
        playClick();
      },
    })
  ).current;

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
          <View style={[styles.iconContainer, { backgroundColor: colors.primaryGlow }]}>
            <Ionicons name="gift" size={50} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Scratch to Reveal 💕</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Scratch the card to see your message!</Text>
          
          <View style={[styles.cardContainer, { borderColor: colors.border }]}>
            <View style={[styles.messageLayer, { backgroundColor: colors.card }]}>
              <Ionicons name="heart" size={40} color={colors.primaryLight} />
              <Text style={[styles.messageText, { color: colors.textPrimary }]}>{message}</Text>
              <Text style={[styles.signature, { color: colors.primary }]}>— With all my love 💕</Text>
            </View>
            
            {!isRevealed && (
              <LinearGradient
                colors={colors.gradientPrimary as any}
                style={styles.scratchLayer}
                {...panResponder.panHandlers}
              >
                <View style={styles.scratchContent}>
                  <Ionicons name="finger-print" size={60} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.scratchText}>Scratch here!</Text>
                  <Text style={styles.progressText}>{Math.round(scratchProgress)}% revealed</Text>
                </View>
              </LinearGradient>
            )}
          </View>
          
          {isRevealed && (
            <Animated.View style={[styles.revealedContainer, { opacity: revealAnim, transform: [{ scale: revealAnim }] }]}>
              <Text style={[styles.revealedTitle, { color: colors.primary }]}>✨ Message Revealed! ✨</Text>
              <TouchableOpacity
                onPress={() => { playComplete(); router.push('/lock-screen'); }}
                activeOpacity={0.9}
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
          
          {!isRevealed && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => { playClick(); router.push('/lock-screen'); }}
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
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  messageLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  signature: {
    fontSize: 14,
    marginTop: 16,
    fontWeight: '600',
  },
  scratchLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scratchContent: {
    alignItems: 'center',
  },
  scratchText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 12,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  revealedContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  revealedTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
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
