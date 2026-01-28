import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser, useAudio } from './_layout';
import { useTheme } from './theme/ThemeContext';
import { ThemedBackground, ThemedCard } from './components/themed';
import * as Haptics from 'expo-haptics';

export default function Personalization() {
  const router = useRouter();
  const { setUserName } = useUser();
  const { playKiss, playClick } = useAudio();
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playKiss();
    const finalName = name.trim() || 'Sehaj';
    setUserName(finalName);
    router.push('/origin');
  };

  return (
    <ThemedBackground>
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => { playClick(); router.back(); }}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                style={[
                  styles.content,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryGlow }]}>
                  <Ionicons name="sparkles" size={40} color={colors.primary} />
                </View>

                <Text style={[styles.prompt, { color: colors.textPrimary }]}>
                  What should I call you?
                </Text>

                <Text style={[styles.playfulText, { color: colors.primary }]}>
                  wife, Berryboo, poopypants,{"\n"}whatever your name is 💕
                </Text>

                <Text style={[styles.hint, { color: colors.textMuted }]}>
                  (You can skip to continue as Sehaj)
                </Text>

                <ThemedCard style={styles.inputCard} variant="glow" glowColor={colors.primary}>
                  <TextInput
                    style={[styles.input, { color: colors.textPrimary }]}
                    value={name}
                    onChangeText={(text) => { if (text.length > name.length) playClick(); setName(text); }}
                    placeholder="Your name..."
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />
                </ThemedCard>

                <TouchableOpacity
                  onPress={handleContinue}
                  activeOpacity={0.9}
                  style={styles.buttonWrapper}
                >
                  <LinearGradient
                    colors={colors.gradientPrimary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, { shadowColor: colors.primary }]}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => {
                    playClick();
                    setUserName('Sehaj');
                    router.push('/crossword');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 60,
    paddingBottom: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  prompt: {
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  playfulText: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  hint: {
    fontSize: 13,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  inputCard: {
    width: '100%',
    marginBottom: 30,
    padding: 0,
  },
  input: {
    padding: 18,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
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
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 4,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
