import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from './_layout';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;

const NICKNAMES = [
  { name: 'Baby', emoji: '👶', color: '#FFB6C1' },
  { name: 'Bub', emoji: '🥰', color: '#FF69B4' },
  { name: 'Bubster', emoji: '💕', color: '#FF1493' },
  { name: 'Berryboo', emoji: '🍓', color: '#DC143C' },
  { name: 'Poopypants', emoji: '😜', color: '#8B4513' },
  { name: 'Wife', emoji: '💍', color: '#FFD700' },
  { name: 'Princess', emoji: '👑', color: '#9370DB' },
  { name: 'Morni', emoji: '🦚', color: '#20B2AA' },
  { name: 'My Painting', emoji: '🎨', color: '#FF6347' },
  { name: 'Babe', emoji: '💋', color: '#FF4500' },
  { name: 'Snowflake', emoji: '❄️', color: '#87CEEB' },
  { name: 'Sehajpal', emoji: '💖', color: '#FF6B9D' },
  { name: 'Mrs. Sandhu', emoji: '👰', color: '#E6E6FA' },
];

// User photos for random display
const PHOTOS = [
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/c4js402r_IMG_2322.jpeg',
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/f4wz0r37_IMG_2420.jpeg',
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/a9ttyijr_IMG_4718.jpeg',
  'https://customer-assets.emergentagent.com/job_sehaj-love/artifacts/nxt2uyzr_IMG_4344.jpeg',
];

export default function NicknameCarousel() {
  const router = useRouter();
  const { playClick, playSuccess, playComplete } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(NICKNAMES.map(() => new Animated.Value(0))).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate cards sequentially
    Animated.stagger(
      100,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / CARD_WIDTH);
    if (index !== currentIndex && index >= 0 && index < NICKNAMES.length) {
      playClick();
      setCurrentIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    playClick();
    scrollRef.current?.scrollTo({ x: index * CARD_WIDTH, animated: true });
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>All My Names For You 💕</Text>
        <Text style={styles.subtitle}>Scroll through your nicknames!</Text>
        
        {/* Counter */}
        <Text style={styles.counter}>
          {currentIndex + 1} / {NICKNAMES.length}
        </Text>
        
        {/* Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.carouselContainer}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
        >
          {NICKNAMES.map((nickname, index) => (
            <Animated.View
              key={index}
              style={[
                styles.card,
                { 
                  backgroundColor: nickname.color + '20',
                  borderColor: nickname.color,
                  opacity: cardAnims[index],
                  transform: [{ 
                    scale: cardAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }],
                },
              ]}
            >
              <View style={styles.photoContainer}>
                <Ionicons name="heart" size={80} color={nickname.color} style={styles.heartBg} />
                <Image 
                  source={{ uri: PHOTOS[index % PHOTOS.length] }} 
                  style={styles.photo} 
                />
              </View>
              <Text style={styles.emoji}>{nickname.emoji}</Text>
              <Text style={[styles.nickname, { color: nickname.color }]}>
                {nickname.name}
              </Text>
            </Animated.View>
          ))}
        </ScrollView>
        
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {NICKNAMES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dot,
                  currentIndex === index && styles.dotActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Continue Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => { playComplete(); router.push('/poems'); }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => { playClick(); router.push('/poems'); }}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
          <Ionicons name="chevron-forward" size={16} color="#9B7FA7" />
        </TouchableOpacity>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#4A1942',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9B7FA7',
    marginBottom: 16,
  },
  counter: {
    fontSize: 14,
    color: '#FF6B9D',
    fontWeight: '600',
    marginBottom: 20,
  },
  carouselContainer: {
    paddingHorizontal: 40,
  },
  card: {
    width: CARD_WIDTH,
    height: 350,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  heartBg: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  nickname: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD6E6',
  },
  dotActive: {
    backgroundColor: '#FF6B9D',
    width: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#9B7FA7',
    fontWeight: '500',
  },
});
