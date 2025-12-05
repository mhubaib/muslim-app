import { View, Text, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from '@react-native-vector-icons/ionicons';

interface SurahCardProps {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  onPress: () => void;
}

export default function SurahCard({
  number,
  name,
  englishName,
  revelationType,
  numberOfAyahs,
  juz,
  onPress,
}: SurahCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.surahCard}>
      <LinearGradient
        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
        style={styles.surahCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.surahCardLeft}>
          <View style={styles.surahNumber}>
            <Text style={styles.surahNumberText}>{number}</Text>
          </View>
          <View style={styles.surahInfo}>
            <View style={styles.surahNameContainer}>
              <Text style={styles.surahName}>{englishName}</Text>
              <Text style={styles.surahArabic}>{name}</Text>
            </View>
            <View style={styles.surahMeta}>
              <View style={styles.surahMetaItem}>
                <Ionicons
                  name={revelationType === 'Meccan' ? 'moon' : 'sunny'}
                  size={12}
                  color="rgba(255,255,255,0.7)"
                />
                <Text style={styles.surahMetaText}>
                  {revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                </Text>
              </View>
              <View style={styles.surahMetaDivider} />
              <View style={styles.surahMetaItem}>
                <Ionicons
                  name="document-text-outline"
                  size={12}
                  color="rgba(255,255,255,0.7)"
                />
                <Text style={styles.surahMetaText}>{numberOfAyahs} Ayat</Text>
              </View>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#14be86" />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surahCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  surahCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    gap: 12,
  },
  surahCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  surahNumber: {
    width: 40,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  surahNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  surahInfo: {
    flex: 1,
    gap: 6,
  },
  surahNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  surahArabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  surahMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  surahMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  surahMetaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
