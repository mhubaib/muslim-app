import { useState } from 'react';
import {
  playAudio,
  pauseAudio,
  resumeAudio,
  stopAudio,
} from '../services/audioService';
import { getAyahAudioUrl } from '../utils/quranAudio';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahId, setCurrentAyahId] = useState<number | null>(null);

  const playAyah = async (
    ayahId: number,
    surahName: string,
    ayahNumber: number,
    qari: string = 'ar.alafasy',
  ) => {
    try {
      const audioUrl = getAyahAudioUrl(ayahId, qari);

      setCurrentAyahId(ayahId);
      setIsPlaying(true);

      await playAudio(
        audioUrl,
        () => {
          setIsPlaying(false);
          setCurrentAyahId(null);
        },
        error => {
          console.error('Audio error:', error);
          setIsPlaying(false);
          setCurrentAyahId(null);
        },
      );
    } catch (error) {
      console.error('Error playing ayah:', error);
      setIsPlaying(false);
      setCurrentAyahId(null);
      throw error;
    }
  };

  const pause = () => {
    pauseAudio();
    setIsPlaying(false);
  };

  const resume = () => {
    resumeAudio();
    setIsPlaying(true);
  };

  const stop = () => {
    stopAudio();
    setIsPlaying(false);
    setCurrentAyahId(null);
  };

  return {
    isPlaying,
    currentAyahId,
    playAyah,
    pause,
    resume,
    stop,
  };
};
