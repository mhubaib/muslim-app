import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Share,
  Alert,
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

  const handlePlayAyah = (ayahNumber: number) => {
    Alert.alert(
      'Audio Player',
      `Fitur audio untuk ayat ${ayahNumber} akan segera tersedia.`,
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Memuat surah...</Text>
        </View>
      </View>
    );
  }

  if (error || !surah) {
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

  const isMeccan = surah.revelationType?.toLowerCase() === 'Meccan';

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
              {surah.englishName || surah.name}
            </Text>
            <Text style={styles.surahArabic}>{surah.name}</Text>

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
                  {surah.numberOfAyahs} Ayat
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {surah.ayahs && surah.ayahs.length > 0 ? (
          surah.ayahs.map(ayah => (
            <AyahCard
              key={ayah.id}
              ayah={ayah}
              onBookmark={() => handleBookmark(ayah.id)}
              onShare={() => handleShare(ayah.id)}
              onPlay={() => handlePlayAyah(ayah.id)}
              isBookmarked={bookmarkedAyahs.has(ayah.id)}
            />
          ))
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons
              name="document-outline"
              size={64}
              color="rgba(255,255,255,0.5)"
            />
            <Text style={styles.errorText}>Tidak ada ayat yang tersedia</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
