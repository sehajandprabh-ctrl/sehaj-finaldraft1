import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from './_layout';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

// Photos from user
const PHOTOS = [
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/c4js402r_IMG_2322.jpeg',
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/f4wz0r37_IMG_2420.jpeg',
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/a9ttyijr_IMG_4718.jpeg',
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/nxt2uyzr_IMG_4344.jpeg',
];

const CAPTIONS = [
  'My Heart 💕',
  'My Love 🥰',
  'My Baby 👶',
  'My World 🌍',
];

interface Card {
  id: number;
  type: 'photo' | 'caption';
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function CardMatch() {
  const router = useRouter();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  const isComplete = matches === 4;

  useEffect(() => {
    initializeCards();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isComplete) {
      playComplete();
      Animated.spring(celebrateAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [isComplete]);

  const initializeCards = () => {
    const cardPairs: Card[] = [];
    
    for (let i = 0; i < 4; i++) {
      cardPairs.push({
        id: i * 2,
        type: 'photo',
        pairId: i,
        content: PHOTOS[i],
        isFlipped: false,
        isMatched: false,
      });
      cardPairs.push({
        id: i * 2 + 1,
        type: 'caption',
        pairId: i,
        content: CAPTIONS[i],
        isFlipped: false,
        isMatched: false,
      });
    }
    
    // Shuffle
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    setCards(cardPairs);
  };

  const handleCardPress = (cardId: number) => {
    if (isChecking || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    playClick();
    
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId)!;
      const secondCard = newCards.find(c => c.id === secondId)!;
      
      setTimeout(() => {
        if (firstCard.pairId === secondCard.pairId) {
          playSuccess();
          setCards(prev => prev.map(c => 
            c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
          ));
          setMatches(m => m + 1);
        } else {
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
        }
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

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
        <Text style={styles.title}>Match the Pairs 💕</Text>
        <Text style={styles.subtitle}>Find each photo with its caption!</Text>
        
        <Text style={styles.progress}>{matches} / 4 matched</Text>
        
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                card.isFlipped && styles.cardFlipped,
                card.isMatched && styles.cardMatched,
              ]}
              onPress={() => handleCardPress(card.id)}
              activeOpacity={0.8}
              disabled={card.isMatched}
            >
              {card.isFlipped || card.isMatched ? (
                card.type === 'photo' ? (
                  <Image source={{ uri: card.content }} style={styles.cardImage} />
                ) : (
                  <Text style={styles.cardText}>{card.content}</Text>
                )
              ) : (
                <Ionicons name="heart" size={30} color="#FF6B9D" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {isComplete && (
          <Animated.View style={[styles.completeContainer, { opacity: celebrateAnim, transform: [{ scale: celebrateAnim }] }]}>
            <Ionicons name="heart" size={50} color="#FF6B9D" />
            <Text style={styles.completeTitle}>Perfect Match! 🎉</Text>
            <Text style={styles.completeText}>Just like us 💕</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => { playClick(); router.push('/scratch-card'); }}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {!isComplete && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => { playClick(); router.push('/scratch-card'); }}
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A1942',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9B7FA7',
    marginBottom: 16,
  },
  progress: {
    fontSize: 18,
    color: '#FF6B9D',
    fontWeight: '600',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    maxWidth: width - 40,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD6E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardFlipped: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FF6B9D',
  },
  cardMatched: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  cardImage: {
    width: CARD_SIZE - 16,
    height: CARD_SIZE - 16,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A1942',
    textAlign: 'center',
    padding: 4,
  },
  completeContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A1942',
    marginTop: 12,
  },
  completeText: {
    fontSize: 16,
    color: '#9B7FA7',
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
    marginTop: 20,
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
