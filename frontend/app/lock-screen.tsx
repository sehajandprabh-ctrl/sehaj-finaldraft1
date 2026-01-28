import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import * as Haptics from 'expo-haptics';

const CORRECT_CODE = '0711';

export default function LockScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const unlockAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (code.length === 4) {
      if (code === CORRECT_CODE) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSuccess();
        setIsUnlocked(true);
        Animated.spring(unlockAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }).start();
      } else {
        setIsWrong(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Vibration.vibrate(200);
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start(() => {
          setCode('');
          setIsWrong(false);
        });
      }
    }
  }, [code]);

  const handleNumberPress = (num: string) => {
    if (code.length < 4 && !isUnlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playClick();
      setCode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (code.length > 0 && !isUnlocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playClick();
      setCode(prev => prev.slice(0, -1));
    }
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { borderColor: isWrong ? colors.error : colors.primary },
              code.length > i && { backgroundColor: isWrong ? colors.error : colors.primary },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    return (
      <View style={styles.keypad}>
        <View style={styles.keypadRow}>
          {['1', '2', '3'].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.key, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleNumberPress(num)}
              activeOpacity={0.7}
              disabled={isUnlocked}
            >
              <Text style={[styles.keyText, { color: colors.textPrimary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {['4', '5', '6'].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.key, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleNumberPress(num)}
              activeOpacity={0.7}
              disabled={isUnlocked}
            >
              <Text style={[styles.keyText, { color: colors.textPrimary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {['7', '8', '9'].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.key, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleNumberPress(num)}
              activeOpacity={0.7}
              disabled={isUnlocked}
            >
              <Text style={[styles.keyText, { color: colors.textPrimary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          <View style={styles.keyEmpty} />
          <TouchableOpacity
            style={[styles.key, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleNumberPress('0')}
            activeOpacity={0.7}
            disabled={isUnlocked}
          >
            <Text style={[styles.keyText, { color: colors.textPrimary }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.key, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleDelete}
            activeOpacity={0.7}
            disabled={isUnlocked}
          >
            <Ionicons name="backspace-outline" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ThemedBackground showFloatingElements={false}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { playClick(); router.back(); }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {!isUnlocked ? (
            <>
              <View style={[styles.iconContainer, { backgroundColor: colors.primaryGlow }]}>
                <Ionicons name="lock-closed" size={60} color={colors.primary} />
              </View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Secret Message 🔐</Text>
              <Text style={[styles.hint, { color: colors.textMuted }]}>Hint: Our special day (MMDD)</Text>
              
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                {renderDots()}
              </Animated.View>
              
              {renderKeypad()}
              
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => { playClick(); router.push('/love-meter'); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </>
          ) : (
            <Animated.View style={[styles.unlockedContainer, { opacity: unlockAnim, transform: [{ scale: unlockAnim }] }]}>
              <View style={[styles.iconContainer, { backgroundColor: colors.successGlow }]}>
                <Ionicons name="lock-open" size={60} color={colors.success} />
              </View>
              <Text style={[styles.unlockedTitle, { color: colors.success }]}>🎉 Unlocked! 🎉</Text>
              
              <ThemedCard variant="glow" glowColor={colors.primary}>
                <View style={{ alignItems: 'center' }}>
                  <Ionicons name="heart" size={30} color={colors.primary} />
                  <Text style={[styles.secretText, { color: colors.textPrimary }]}>
                    You remembered our day! 💕{"\n\n"}
                    July 11 is when my life truly began —{"\n"}
                    the day I got you.{"\n\n"}
                    Every day since has been a gift.{"\n"}
                    I love you, forever and always.
                  </Text>
                </View>
              </ThemedCard>
              
              <TouchableOpacity
                onPress={() => { playComplete(); router.push('/love-meter'); }}
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
            </Animated.View>
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
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  keypad: {
    alignItems: 'center',
    width: 280,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  key: {
    width: 75,
    height: 75,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  keyEmpty: {
    width: 75,
    height: 75,
    backgroundColor: 'transparent',
  },
  keyText: {
    fontSize: 32,
    fontWeight: '500',
  },
  unlockedContainer: {
    alignItems: 'center',
    padding: 20,
  },
  unlockedTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  secretText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 16,
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
