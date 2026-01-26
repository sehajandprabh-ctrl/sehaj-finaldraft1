import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAudio } from './_layout';

interface Poem {
  id: string;
  title: string;
  type: 'sweet' | 'playful' | 'sincere';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  lines: string[];
}

const POEMS: Poem[] = [
  {
    id: 'sehaj',
    title: "Sehaj's Poem",
    type: 'sweet',
    icon: 'flower',
    color: '#FF6B9D',
    lines: [
      'In your eyes, I found my home,',
      'A place where I no longer roam.',
      'Your smile lights up my darkest days,',
      'In countless beautiful, gentle ways.',
      'With every heartbeat, I feel so blessed,',
      'With you, my love, I am at rest.',
    ],
  },
  {
    id: 'berryboo',
    title: "Berryboo's Poem",
    type: 'playful',
    icon: 'happy',
    color: '#FFB347',
    lines: [
      'You make me laugh until I cry,',
      'With you, the time just flies by.',
      "We're weird together, that's our thing,",
      'Our inside jokes make my heart sing.',
      "I'd choose your chaos every day,",
      'You drive me crazy in the best way!',
    ],
  },
  {
    id: 'mrssandhu',
    title: "Mrs. Sandhu's Poem",
    type: 'sincere',
    icon: 'heart',
    color: '#9B59B6',
    lines: [
      'I never knew love could feel this way,',
      'Until you came and chose to stay.',
      'You see the parts I try to hide,',
      'And love me from the other side.',
      "Through every storm, you hold my hand,",
      'With you, I finally understand.',
    ],
  },
];

export default function Poems() {
  const router = useRouter();
  const { userName } = useUser();
  const { playClick } = useAudio();
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [poemComplete, setPoemComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lineAnims = useRef(POEMS[0].lines.map(() => new Animated.Value(0))).current;

  const currentPoem = POEMS[currentPoemIndex];
  const isLastPoem = currentPoemIndex === POEMS.length - 1;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Reset animations when poem changes
    lineAnims.forEach((anim) => anim.setValue(0));
    setVisibleLines(0);
    setPoemComplete(false);

    // Animate lines one by one
    const animateLines = () => {
      currentPoem.lines.forEach((_, index) => {
        setTimeout(() => {
          Animated.timing(lineAnims[index], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
          setVisibleLines(index + 1);
          if (index === currentPoem.lines.length - 1) {
            setTimeout(() => setPoemComplete(true), 500);
          }
        }, index * 800);
      });
    };

    setTimeout(animateLines, 300);
  }, [currentPoemIndex]);

  const handleNext = () => {
    playClick();
    if (isLastPoem) {
      router.push('/confession');
    } else {
      setCurrentPoemIndex((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.pageLabel}>A Poem for {userName}</Text>

          {/* Poem Type Indicator */}
          <View style={styles.poemTypeContainer}>
            {POEMS.map((poem, index) => (
              <View
                key={poem.id}
                style={[
                  styles.poemDot,
                  index === currentPoemIndex && {
                    backgroundColor: poem.color,
                    transform: [{ scale: 1.3 }],
                  },
                ]}
              />
            ))}
          </View>

          {/* Poem Card */}
          <View
            style={[
              styles.poemCard,
              { borderTopColor: currentPoem.color },
            ]}
          >
            <View style={styles.poemHeader}>
              <Ionicons
                name={currentPoem.icon}
                size={32}
                color={currentPoem.color}
              />
              <Text style={[styles.poemTitle, { color: currentPoem.color }]}>
                {currentPoem.title}
              </Text>
            </View>

            <View style={styles.linesContainer}>
              {currentPoem.lines.map((line, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.lineContainer,
                    {
                      opacity: lineAnims[index],
                      transform: [
                        {
                          translateY: lineAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.poemLine}>{line}</Text>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Progress */}
          <Text style={styles.progressText}>
            Poem {currentPoemIndex + 1} of {POEMS.length}
          </Text>

          {/* Next Button */}
          {poemComplete && (
            <Animated.View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: currentPoem.color }]}
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {isLastPoem ? 'Continue' : 'Next Poem'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              playClick();
              router.push('/confession');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
            <Ionicons name="chevron-forward" size={16} color="#9B7FA7" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    color: '#9B7FA7',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  poemTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  poemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8D8E8',
  },
  poemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  poemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  poemTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  linesContainer: {
    minHeight: 200,
  },
  lineContainer: {
    marginBottom: 12,
  },
  poemLine: {
    fontSize: 17,
    lineHeight: 28,
    color: '#4A1942',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressText: {
    fontSize: 13,
    color: '#9B7FA7',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
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
