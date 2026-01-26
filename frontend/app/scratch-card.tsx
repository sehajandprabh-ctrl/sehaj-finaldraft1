import React, { useState, useRef } from 'react';
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
import { useAudio } from './_layout';

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
  const { playClick, playSuccess, playComplete } = useAudio();
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message] = useState(() => LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const scratchedAreas = useRef(new Set<string>());

  React.useEffect(() => {
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
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => { playClick(); router.back(); }}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color="#FF6B9D" />
      </TouchableOpacity>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Ionicons name="gift" size={50} color="#FF6B9D" />
        <Text style={styles.title}>Scratch to Reveal 💕</Text>
        <Text style={styles.subtitle}>Scratch the card to see your message!</Text>
        
        <View style={styles.cardContainer}>
          {/* Hidden Message Layer */}
          <View style={styles.messageLayer}>
            <Ionicons name="heart" size={40} color="#FFD6E6" />
            <Text style={styles.messageText}>{message}</Text>
            <Text style={styles.signature}>— With all my love 💕</Text>
          </View>
          
          {/* Scratch Layer */}
          {!isRevealed && (
            <View
              style={styles.scratchLayer}
              {...panResponder.panHandlers}
            >
              <View style={styles.scratchContent}>
                <Ionicons name="finger-print" size={60} color="#FFFFFF" />
                <Text style={styles.scratchText}>Scratch here!</Text>
                <Text style={styles.progressText}>{Math.round(scratchProgress)}% revealed</Text>
              </View>
            </View>
          )}
        </View>
        
        {isRevealed && (
          <Animated.View style={[styles.revealedContainer, { opacity: revealAnim, transform: [{ scale: revealAnim }] }]}>
            <Text style={styles.revealedTitle}>✨ Message Revealed! ✨</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { playComplete(); router.push('/lock-screen'); }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {!isRevealed && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => { playClick(); router.push('/lock-screen'); }}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
            <Ionicons name="chevron-forward" size={16} color="#9B7FA7" />
          </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A1942',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9B7FA7',
    marginBottom: 30,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  messageLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A1942',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  signature: {
    fontSize: 14,
    color: '#FF6B9D',
    marginTop: 16,
    fontWeight: '600',
  },
  scratchLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FF6B9D',
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
    color: '#FF6B9D',
    marginBottom: 20,
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
