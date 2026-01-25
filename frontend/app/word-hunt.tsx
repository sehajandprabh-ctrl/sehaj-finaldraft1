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

const HIDDEN_WORDS = ['LOVE', 'SEHAJ', 'US', 'FOREVER', 'HOME'];

const PARAGRAPH_TEXT = `In this journey called LOVE, I found someone who makes every moment feel like FOREVER. SEHAJ, you became my world, my HOME, and everything in between. When it's US together, nothing else matters. You are my FOREVER, and I want to spend every day making you smile.`;

export default function WordHunt() {
  const router = useRouter();
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedText, setSelectedText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  const allWordsFound = foundWords.size === HIDDEN_WORDS.length;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (allWordsFound) {
      Animated.spring(celebrateAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  }, [allWordsFound]);

  const handleWordPress = (word: string) => {
    const upperWord = word.toUpperCase();
    if (HIDDEN_WORDS.includes(upperWord) && !foundWords.has(upperWord)) {
      setFoundWords((prev) => new Set([...prev, upperWord]));
    }
  };

  const renderParagraph = () => {
    const words = PARAGRAPH_TEXT.split(' ');
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '').toUpperCase();
      const isHidden = HIDDEN_WORDS.includes(cleanWord);
      const isFound = foundWords.has(cleanWord);

      if (isHidden) {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordPress(cleanWord)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.word,
                isFound ? styles.foundWord : styles.hiddenWord,
              ]}
            >
              {word + ' '}
            </Text>
          </TouchableOpacity>
        );
      }
      return (
        <Text key={index} style={styles.word}>
          {word + ' '}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.pageLabel}>Word Hunt</Text>

          <View style={styles.instructionCard}>
            <Ionicons name="search" size={24} color="#FF6B9D" />
            <Text style={styles.instructionText}>
              Find and tap the hidden words in the text below
            </Text>
          </View>

          {/* Word List */}
          <View style={styles.wordListContainer}>
            <Text style={styles.wordListTitle}>Words to find:</Text>
            <View style={styles.wordList}>
              {HIDDEN_WORDS.map((word) => (
                <View
                  key={word}
                  style={[
                    styles.wordChip,
                    foundWords.has(word) && styles.wordChipFound,
                  ]}
                >
                  <Text
                    style={[
                      styles.wordChipText,
                      foundWords.has(word) && styles.wordChipTextFound,
                    ]}
                  >
                    {word}
                  </Text>
                  {foundWords.has(word) && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Paragraph */}
          <View style={styles.paragraphCard}>
            <View style={styles.paragraphContent}>{renderParagraph()}</View>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {foundWords.size} of {HIDDEN_WORDS.length} words found
            </Text>
          </View>

          {/* Completion Message */}
          {allWordsFound && (
            <Animated.View
              style={[
                styles.completionContainer,
                {
                  opacity: celebrateAnim,
                  transform: [{ scale: celebrateAnim }],
                },
              ]}
            >
              <Ionicons name="heart" size={40} color="#FF6B9D" />
              <Text style={styles.completionText}>
                "You found every word.{"\n"}I found my person."
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/crossword')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          )}
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
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#5A4A5A',
  },
  wordListContainer: {
    width: '100%',
    marginBottom: 20,
  },
  wordListTitle: {
    fontSize: 13,
    color: '#9B7FA7',
    marginBottom: 10,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4EC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  wordChipFound: {
    backgroundColor: '#4CAF50',
  },
  wordChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  wordChipTextFound: {
    color: '#FFFFFF',
  },
  paragraphCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  paragraphContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    fontSize: 17,
    lineHeight: 32,
    color: '#4A1942',
  },
  hiddenWord: {
    backgroundColor: '#FFE4EC',
    color: '#FF6B9D',
    fontWeight: '600',
    paddingHorizontal: 2,
    borderRadius: 4,
  },
  foundWord: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    fontWeight: '600',
    paddingHorizontal: 2,
    borderRadius: 4,
  },
  progressContainer: {
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#9B7FA7',
  },
  completionContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  completionText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4A1942',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 28,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
