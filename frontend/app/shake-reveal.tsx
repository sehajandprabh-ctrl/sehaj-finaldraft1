import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { useAudio } from './_layout';

const SHAKE_THRESHOLD = 1.5;

export default function ShakeReveal() {
  const router = useRouter();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [isRevealed, setIsRevealed] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const lastShake = useRef(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Phone shake animation hint
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.delay(2000),
      ])
    ).start();

    // Set up accelerometer for shake detection
    let subscription: any;
    
    const setupAccelerometer = async () => {
      try {
        Accelerometer.setUpdateInterval(100);
        subscription = Accelerometer.addListener(({ x, y, z }) => {
          const acceleration = Math.sqrt(x * x + y * y + z * z);
          const now = Date.now();
          
          if (acceleration > SHAKE_THRESHOLD && now - lastShake.current > 500) {
            lastShake.current = now;
            handleShake();
          }
        });
      } catch (error) {
        console.log('Accelerometer not available');
      }
    };

    if (Platform.OS !== 'web') {
      setupAccelerometer();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handleShake = () => {
    if (isRevealed) return;
    
    playClick();
    setShakeCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        revealMessage();
      }
      return newCount;
    });
  };

  const revealMessage = () => {
    playSuccess();
    setIsRevealed(true);
    Animated.spring(revealAnim, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  // Manual reveal button for web
  const handleManualReveal = () => {
    if (!isRevealed) {
      playClick();
      setShakeCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          revealMessage();
        }
        return newCount;
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {!isRevealed ? (
          <>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <Ionicons name="phone-portrait-outline" size={100} color="#FF6B9D" />
            </Animated.View>
            
            <Text style={styles.title}>Shake To Reveal 📱</Text>
            <Text style={styles.subtitle}>Shake your phone to reveal a secret!</Text>
            
            <View style={styles.progressContainer}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.shakeDot,
                    shakeCount > i && styles.shakeDotFilled,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.progressText}>{shakeCount} / 3 shakes</Text>
            
            {/* Manual button for web */}
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={styles.shakeButton}
                onPress={handleManualReveal}
                activeOpacity={0.8}
              >
                <Text style={styles.shakeButtonText}>Tap to Shake!</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => { playClick(); router.push('/nickname-carousel'); }}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
              <Ionicons name="chevron-forward" size={16} color="#9B7FA7" />
            </TouchableOpacity>
          </>
        ) : (
          <Animated.View style={[styles.revealedContainer, { opacity: revealAnim, transform: [{ scale: revealAnim }] }]}>
            <Ionicons name="sparkles" size={80} color="#FFD700" />
            <Text style={styles.revealedTitle}>Secret Revealed! ✨</Text>
            
            <View style={styles.messageCard}>
              <Ionicons name="heart" size={40} color="#FF6B9D" />
              <Text style={styles.messageText}>
                You shook things up in my life —{"\n"}
                in the best way possible.{"\n\n"}
                Before you, everything was still.{"\n"}
                Now, my heart beats for you.{"\n\n"}
                💕 I love you, always 💕
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => { playComplete(); router.push('/nickname-carousel'); }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A1942',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9B7FA7',
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  shakeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FF6B9D',
    backgroundColor: 'transparent',
  },
  shakeDotFilled: {
    backgroundColor: '#FF6B9D',
  },
  progressText: {
    fontSize: 16,
    color: '#9B7FA7',
    marginBottom: 20,
  },
  shakeButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  shakeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  revealedContainer: {
    alignItems: 'center',
    padding: 20,
  },
  revealedTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A1942',
    marginTop: 16,
    marginBottom: 24,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  messageText: {
    fontSize: 17,
    lineHeight: 28,
    color: '#4A1942',
    textAlign: 'center',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
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
    color: '#9B7FA7',
    fontWeight: '500',
  },
});
