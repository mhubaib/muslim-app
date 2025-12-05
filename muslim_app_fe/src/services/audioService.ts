import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let currentSound: Sound | null = null;

export const playAudio = (
  url: string,
  onEnd?: () => void,
  onError?: (error: any) => void,
): Promise<Sound> => {
  return new Promise((resolve, reject) => {
    if (currentSound) {
      currentSound.stop();
      currentSound.release();
      currentSound = null;
    }

    const sound = new Sound(url, '', error => {
      if (error) {
        console.error('Failed to load sound', error);
        if (onError) onError(error);
        reject(error);
        return;
      }

      sound.play(success => {
        if (success) {
          console.log('Sound finished playing');
          if (onEnd) onEnd();
        } else {
          console.log('Playback failed');
        }
        sound.release();
        currentSound = null;
      });

      currentSound = sound;
      resolve(sound);
    });
  });
};

export const pauseAudio = () => {
  if (currentSound) {
    currentSound.pause();
  }
};

export const resumeAudio = () => {
  if (currentSound) {
    currentSound.play();
  }
};

export const stopAudio = () => {
  if (currentSound) {
    currentSound.stop();
    currentSound.release();
    currentSound = null;
  }
};

export const getCurrentSound = () => currentSound;
