import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Share,
  Alert,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { styles } from './quran-detail-style';
import { useEffect, useState, useCallback } from 'react';
import { getSurahById } from '../../api/quran';
import { Surah } from '../../types/Quran';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';
import AyahCard from '../../components/AyahCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

type QuranDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'QuranDetail'
>;

export default function QuranDetailScreen({
  route,
  navigation,
}: QuranDetailScreenProps) {
  const { surahId } = route.params;
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(
    new Set(),
  );
  const { playAyah, currentAyahId, isPlaying, pause, resume } =
    useAudioPlayer();

  const fetchSurahDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSurahById(surahId);
      setSurah(data);
    } catch (err) {
      setError('Gagal memuat detail surah. Silakan coba lagi.');
      console.error('Error fetching surah detail:', err);
    } finally {
      setLoading(false);
    }
  }, [surahId]);

  useEffect(() => {
    fetchSurahDetail();
  }, [fetchSurahDetail]);

  console.log(surah);

  useEffect(() => {
    if (surah) {
      navigation.setOptions({
        title: surah.englishName || surah.name,
      });
    }
  }, [surah, navigation]);

  const getJuzRange = (): string => {
    if (!surah || !surah.ayahs || surah.ayahs.length === 0) {
      return '';
    }

    const firstAyah = surah.ayahs[0];
    const lastAyah = surah.ayahs[surah.ayahs.length - 1];

    const firstJuz = firstAyah.juz;
    const lastJuz = lastAyah.juz;

    if (firstJuz === lastJuz) {
      return `Juz ${firstJuz}`;
    } else {
      return `Juz ${firstJuz} - ${lastJuz}`;
    }
  };

  const handleBookmark = (ayahId: number) => {
    setBookmarkedAyahs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ayahId)) {
        newSet.delete(ayahId);
      } else {
        newSet.add(ayahId);
      }
      return newSet;
    });
  };

  const handleShare = async (ayahId: number) => {
    if (!surah || !surah.ayahs) return;

    const ayah = surah.ayahs.find(v => v.id === ayahId);
    if (!ayah) return;

    try {
      await Share.share({
        message: `${surah.englishName || surah.name} - Ayat ${
          ayah.numberInSurah
        }\n\n${ayah.textArabic}\n\n${ayah.textTranslation || ''}`,
      });
    } catch (shareError) {
      console.error('Error sharing ayah:', shareError);
    }
  };

  const handlePlayAyah = async (ayahId: number) => {
    if (!surah) return;

    const ayah = surah.ayahs.find(v => v.id === ayahId);
    if (!ayah) return;

    if (currentAyahId === ayahId && isPlaying) {
      pause();
      return;
    }
    
    if (currentAyahId === ayahId && !isPlaying) {
      resume();
      return;
    }

    try {
      await playAyah(
        ayahId,
        surah.englishName || surah.name,
        ayah.numberInSurah,
      );
    } catch (err) {
      Alert.alert('Error', 'Gagal memutar audio');
      console.error('Error playing ayah:', err);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FFCDD2" />
          <Text style={styles.errorText}>
            {error || 'Surah tidak ditemukan'}
          </Text>
          <Pressable style={styles.retryButton} onPress={fetchSurahDetail}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isMeccan = surah?.revelationType?.toLowerCase() === 'Meccan';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.surahName}>
              {surah?.englishName || surah?.name}
            </Text>
            <Text style={styles.surahArabic}>{surah?.name}</Text>

            <View style={styles.surahInfo}>
              <View style={styles.surahInfoItem}>
                <Ionicons
                  name={isMeccan ? 'moon' : 'sunny'}
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.surahInfoText}>
                  {isMeccan ? 'Makkiyah' : 'Madaniyah'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.surahInfoItem}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.surahInfoText}>
                  {surah?.numberOfAyahs} Ayat
                </Text>
              </View>
              {getJuzRange() && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.surahInfoItem}>
                    <Ionicons
                      name="book-outline"
                      size={16}
                      color="rgba(255,255,255,0.9)"
                    />
                    <Text style={styles.surahInfoText}>{getJuzRange()}</Text>
                  </View>
                </>
              )}
            </View>

            {surahId !== 1 && surahId !== 9 && (
              <Text style={styles.bismillah}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </Text>
            )}
          </LinearGradient>
        </View>
      </View>
      <FlatList
        data={surah?.ayahs}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <AyahCard
            ayah={item}
            onBookmark={() => handleBookmark(item.id)}
            onShare={() => handleShare(item.id)}
            onPlay={() => handlePlayAyah(item.id)}
            isBookmarked={bookmarkedAyahs.has(item.id)}
            currentAyahId={currentAyahId}
            isPlaying={isPlaying}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.container}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Memuat surah...</Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons
                name="document-outline"
                size={64}
                color="rgba(255,255,255,0.5)"
              />
              <Text style={styles.errorText}>Tidak ada ayat yang tersedia</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
