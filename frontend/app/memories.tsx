import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Dimensions,
  Image,
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

const STICKER_BATMAN = 'https://customer-assets.emergentagent.com/job_love-adventure-49/artifacts/ru45g92o_IMG_5369.jpeg';

interface Memory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  content: string;
}

const MEMORIES: Memory[] = [
  {
    id: 'funny',
    title: 'Funny Memory',
    icon: 'happy',
    color: '#FBBF24',
    content:
      "Remember getting eaten alive by mosquitoes? 🦟",
  },
  {
    id: 'sweet',
    title: 'Sweet Memory',
    icon: 'heart',
    color: '#E8638F',
    content:
      "Remember when you sat down with me to eat pepperoni pizza, and refused to eat until I did. 🍕",
  },
  {
    id: 'meaningful',
    title: 'Meaningful Memory',
    icon: 'star',
    color: '#A78BFA',
    content:
      "When you took me back to the Legos store. I know it's not that deep but to me it's really special. You fought and hit me over it but I still won at the end of the day. 🧱",
  },
];

export default function Memories() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [viewedMemories, setViewedMemories] = useState<Set<string>>(new Set());
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(MEMORIES.map(() => new Animated.Value(0))).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const { playKiss, playClick, playComplete } = useAudio();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      150,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      )
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

  const handleMemoryPress = (memory: Memory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playClick();
    setSelectedMemory(memory);
  };

  const handleCloseMemory = () => {
    playClick();
    if (selectedMemory) {
      setViewedMemories((prev) => new Set([...prev, selectedMemory.id]));
    }
    setSelectedMemory(null);
  };

  const allViewed = viewedMemories.size === MEMORIES.length;

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
              transform: [{ translateY: floatTranslate }, { rotate: '12deg' }],
            },
          ]}
        >
          <View style={styles.heartStickerWrapper}>
            <Ionicons name="heart" size={120} color={isDark ? colors.textMuted : '#333'} style={styles.heartBg} />
            <Image
              source={{ uri: STICKER_BATMAN }}
              style={[styles.stickerImage, { borderColor: colors.card }]}
            />
          </View>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={[styles.pageLabel, { color: colors.textSecondary }]}>Our Memories</Text>
          <Text style={[styles.instruction, { color: colors.textMuted }]}>Tap each card to explore</Text>

          <View style={styles.cardsContainer}>
            {MEMORIES.map((memory, index) => {
              const isViewed = viewedMemories.has(memory.id);
              return (
                <Animated.View
                  key={memory.id}
                  style={[
                    styles.cardWrapper,
                    {
                      opacity: cardAnims[index],
                      transform: [
                        {
                          scale: cardAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.memoryCard,
                      { backgroundColor: colors.card, borderColor: memory.color },
                      isViewed && { opacity: 0.7 },
                    ]}
                    onPress={() => handleMemoryPress(memory)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: memory.color + '20' },
                      ]}
                    >
                      <Ionicons
                        name={memory.icon}
                        size={36}
                        color={memory.color}
                      />
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{memory.title}</Text>
                    {isViewed && (
                      <View style={styles.checkBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={colors.success}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {viewedMemories.size} of {MEMORIES.length} memories explored
            </Text>
            <View style={[styles.progressBar, { backgroundColor: colors.card }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(viewedMemories.size / MEMORIES.length) * 100}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          </View>

          {allViewed && (
            <Animated.View style={styles.continueContainer}>
              <TouchableOpacity
                onPress={() => {
                  playKiss();
                  router.push('/crossword');
                }}
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

          {!allViewed && (
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
          )}
        </Animated.View>

        <Modal
          visible={!!selectedMemory}
          animationType="fade"
          transparent
          onRequestClose={handleCloseMemory}
        >
          <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
            <ThemedCard style={styles.modalContent} variant="glow" glowColor={selectedMemory?.color}>
              {selectedMemory && (
                <>
                  <View
                    style={[
                      styles.modalIconCircle,
                      { backgroundColor: selectedMemory.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={selectedMemory.icon}
                      size={50}
                      color={selectedMemory.color}
                    />
                  </View>
                  <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{selectedMemory.title}</Text>
                  <ScrollView style={styles.modalScroll}>
                    <Text style={[styles.modalText, { color: colors.textSecondary }]}>{selectedMemory.content}</Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: selectedMemory.color },
                    ]}
                    onPress={handleCloseMemory}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </ThemedCard>
          </View>
        </Modal>
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
    padding: 24,
    paddingTop: 100,
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 32,
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  memoryCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  progressContainer: {
    width: '100%',
    marginTop: 32,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  continueContainer: {
    marginTop: 32,
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
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 200,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stickerContainer: {
    position: 'absolute',
    top: 50,
    right: 5,
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
