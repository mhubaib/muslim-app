import { View, Text, Pressable } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { styles } from '../screens/quran-detail/quran-detail-style';
import { Ayah } from '../types/Quran';

interface AyahCardProps {
  ayah: Ayah;
  onBookmark?: () => void;
  onShare?: () => void;
  onPlay?: () => void;
  isBookmarked?: boolean;
  currentAyahId?: number | null;
  isPlaying?: boolean;
}

export default function AyahCard({
  ayah,
  onBookmark,
  onShare,
  onPlay,
  isBookmarked = false,
  currentAyahId,
  isPlaying,
}: AyahCardProps) {
  const isThisAyahPlaying = currentAyahId === ayah.id && isPlaying;

  return (
    <View style={styles.ayahCard}>
      <View style={styles.ayahHeader}>
        <View style={styles.ayahNumber}>
          <Text style={styles.ayahNumberText}>{ayah.numberInSurah}</Text>
        </View>
        <View style={styles.ayahActions}>
          {onPlay && (
            <Pressable style={styles.actionButton} onPress={onPlay}>
              <Ionicons
                name={isThisAyahPlaying ? 'pause' : 'play'}
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          )}
          {onBookmark && (
            <Pressable style={styles.actionButton} onPress={onBookmark}>
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          )}
          {onShare && (
            <Pressable style={styles.actionButton} onPress={onShare}>
              <Ionicons name="share-outline" size={18} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </View>

      <Text style={styles.ayahArabic}>{ayah.textArabic}</Text>

      {ayah.textLatin && (
        <Text style={styles.ayahTransliteration}>{ayah.textLatin}</Text>
      )}

      {ayah.textTranslation && (
        <Text style={styles.ayahTranslation}>{ayah.textTranslation}</Text>
      )}
    </View>
  );
}
