import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { styles } from './quran-style';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useEffect, useState } from 'react';
import { getAllSurahs } from '../../api/quran';
import { Surah } from '../../types/Quran';
import SurahCard from '../../components/SurahCard';

type QuranScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Quran'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function QuranScreen({
  navigation,
}: {
  navigation: QuranScreenNavigationProp;
}) {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSurahs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(
        surah =>
          surah.englishName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          surah.englishNameTransliteration
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          surah.name?.includes(searchQuery) ||
          surah.id.toString().includes(searchQuery),
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (err) {
      setError('Gagal memuat daftar surah. Silakan coba lagi.');
      console.error('Error fetching surahs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurahPress = (surahId: number) => {
    navigation.navigate('QuranDetail', { surahId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Al-Quran</Text>
            <Text style={styles.headerSubtitle}>{surahs.length} Surah</Text>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name={'settings-outline'} size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari surah..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color="rgba(255,255,255,0.7)"
              />
            </Pressable>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FFCDD2" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchSurahs}>
              <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          data={filteredSurahs}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <SurahCard
              number={item.id}
              name={item.name}
              englishName={item.englishName}
              revelationType={item.revelationType}
              numberOfAyahs={item.numberOfAyahs}
              onPress={() => handleSurahPress(item.id)}
            />
          )}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Memuat daftar surah...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color="rgba(255,255,255,0.5)"
                />
                <Text style={styles.emptyText}>
                  Tidak ada surah yang ditemukan
                </Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}
