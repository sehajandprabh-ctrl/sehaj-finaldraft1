import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Song list with local audio files
export const PLAYLIST = [
  {
    id: 1,
    title: "It's Love",
    artist: "RealestK",
    url: "https://customer-assets.emergentagent.com/job_love-adventure-49/artifacts/230dit60_RealestK%20-%20It%27s%20Love%20%28Official%20Audio%29.mp3",
  },
  {
    id: 2,
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    url: "https://customer-assets.emergentagent.com/job_add-this-1/artifacts/cufh3d12_Apocalypse%20-%20Cigarettes%20After%20Sex.mp3",
  },
  {
    id: 3,
    title: "Fall in Love with You",
    artist: "Montell Fish",
    url: "https://customer-assets.emergentagent.com/job_add-this-1/artifacts/ixjjhzww_Montell%20Fish%20-%20Fall%20in%20Love%20with%20You.%20%28Lyrics%29.mp3",
  },
  {
    id: 4,
    title: "Love Me",
    artist: "RealestK",
    url: "https://customer-assets.emergentagent.com/job_add-this-1/artifacts/2b5nalgs_RealestK%20-%20Love%20Me%20%28Official%20Audio%29.mp3",
  },
  {
    id: 5,
    title: "Meet Me in Amsterdam",
    artist: "RINI",
    url: "https://customer-assets.emergentagent.com/job_add-this-1/artifacts/950vb5hm_RINI%20-%20Meet%20Me%20in%20Amsterdam%20%28Audio%29.mp3",
  },
];

// Album art video URL
export const ALBUM_ART_URL = "https://customer-assets.emergentagent.com/job_add-this-1/artifacts/zr6k5md8_6ED17C90-F068-4114-862A-9C69C98D65D1.MOV";

interface MusicContextType {
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: typeof PLAYLIST[0];
  progress: number;
  duration: number;
  playTrack: (index: number) => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const MusicContext = createContext<MusicContextType>({
  currentTrackIndex: 0,
  isPlaying: false,
  isMuted: false,
  currentTrack: PLAYLIST[0],
  progress: 0,
  duration: 0,
  playTrack: () => {},
  togglePlayPause: () => {},
  toggleMute: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
});

export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state on mount
  useEffect(() => {
    loadSavedState();
    setupAudio();
    
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.log('Error setting up audio:', error);
    }
  };

  const loadSavedState = async () => {
    try {
      const savedIndex = await AsyncStorage.getItem('music_track_index');
      const savedMuted = await AsyncStorage.getItem('music_muted');
      
      if (savedIndex !== null) {
        setCurrentTrackIndex(parseInt(savedIndex, 10));
      }
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true');
      }
      
      // Auto-play after loading state
      setTimeout(() => {
        const index = savedIndex !== null ? parseInt(savedIndex, 10) : 0;
        const muted = savedMuted === 'true';
        loadAndPlayTrack(index, !muted);
      }, 1000);
    } catch (error) {
      console.log('Error loading saved state:', error);
      loadAndPlayTrack(0, true);
    }
  };

  const saveState = async (trackIndex: number, muted: boolean) => {
    try {
      await AsyncStorage.setItem('music_track_index', trackIndex.toString());
      await AsyncStorage.setItem('music_muted', muted.toString());
    } catch (error) {
      console.log('Error saving state:', error);
    }
  };

  const fadeOut = async (sound: Audio.Sound): Promise<void> => {
    return new Promise((resolve) => {
      let volume = 0.4;
      fadeIntervalRef.current = setInterval(async () => {
        volume -= 0.05;
        if (volume <= 0) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
          await sound.setVolumeAsync(0);
          resolve();
        } else {
          try {
            await sound.setVolumeAsync(volume);
          } catch (e) {
            // Sound might be unloaded
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
            resolve();
          }
        }
      }, 50);
    });
  };

  const fadeIn = async (sound: Audio.Sound, targetVolume: number = 0.4): Promise<void> => {
    return new Promise((resolve) => {
      let volume = 0;
      fadeIntervalRef.current = setInterval(async () => {
        volume += 0.05;
        if (volume >= targetVolume) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
          await sound.setVolumeAsync(targetVolume);
          resolve();
        } else {
          try {
            await sound.setVolumeAsync(volume);
          } catch (e) {
            if (fadeIntervalRef.current) {
              clearInterval(fadeIntervalRef.current);
            }
            resolve();
          }
        }
      }, 50);
    });
  };

  const loadAndPlayTrack = async (index: number, shouldPlay: boolean = true) => {
    try {
      // Fade out current track if playing
      if (soundRef.current && isLoaded) {
        await fadeOut(soundRef.current);
        await soundRef.current.unloadAsync();
      }

      const track = PLAYLIST[index];
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { 
          shouldPlay: false,
          volume: 0,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setIsLoaded(true);
      setCurrentTrackIndex(index);

      if (shouldPlay && !isMuted) {
        await newSound.playAsync();
        setIsPlaying(true);
        await fadeIn(newSound, isMuted ? 0 : 0.4);
      } else {
        setIsPlaying(false);
      }

      saveState(index, isMuted);
    } catch (error) {
      console.log('Error loading track:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setProgress(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      
      // When track finishes, play next track
      if (status.didJustFinish && !status.isLooping) {
        const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
        loadAndPlayTrack(nextIndex, !isMuted);
      }
    }
  };

  const playTrack = async (index: number) => {
    await loadAndPlayTrack(index, !isMuted);
  };

  const togglePlayPause = async () => {
    if (!soundRef.current || !isLoaded) return;

    try {
      if (isPlaying) {
        await fadeOut(soundRef.current);
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        if (!isMuted) {
          await fadeIn(soundRef.current, 0.4);
        }
      }
    } catch (error) {
      console.log('Error toggling play/pause:', error);
    }
  };

  const toggleMute = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    saveState(currentTrackIndex, newMuted);

    if (soundRef.current && isLoaded) {
      try {
        if (newMuted) {
          await fadeOut(soundRef.current);
        } else {
          await fadeIn(soundRef.current, 0.4);
        }
      } catch (error) {
        console.log('Error toggling mute:', error);
      }
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    loadAndPlayTrack(nextIndex, isPlaying && !isMuted);
  };

  const previousTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? PLAYLIST.length - 1 : currentTrackIndex - 1;
    loadAndPlayTrack(prevIndex, isPlaying && !isMuted);
  };

  const currentTrack = PLAYLIST[currentTrackIndex];

  return (
    <MusicContext.Provider
      value={{
        currentTrackIndex,
        isPlaying,
        isMuted,
        currentTrack,
        progress,
        duration,
        playTrack,
        togglePlayPause,
        toggleMute,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
