import {
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { getTodayPrayerTimes } from '../../api/shalat';
import { useEffect, useState } from 'react';
import {
  getCurrentLocation,
  requestLocationPermission,
} from '../../utils/getCoordinates';
import {
  PrayerTimes,
} from '../../types/PrayerTimes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './prayer-style';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import PrayerCard from '../../components/PrayerCard';
import { getLocationName } from '../../api/location';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../types/navigation';
import { useNotificationSettings } from '../../contexts/NotificationContext';
import { FCMService } from '../../services/fcm.service';

export default function PrayerTimeScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<MainTabParamList, 'PrayerTime'>;
}) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    city?: string;
  } | null>(null);
  const [countdown, setCountdown] = useState<string>('00:00:00');

  const { settings, togglePrayer } = useNotificationSettings();

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    await getLocation();
  };

  useEffect(() => {
    if (location) {
      getPrayerTimes();
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const getLocation = async () => {
    try {
      setLoading(true);
      const permission = await requestLocationPermission();
      if (!permission) {
        setError(
          'Akses lokasi ditolak, silahkan aktifkan akses lokasi di pengaturan',
        );
        setLoading(false);
        return;
      }
      const currentLocation = await getCurrentLocation();
      const city = await getLocationName({
        lat: currentLocation.latitude,
        lon: currentLocation.longitude,
      });
      setLocation({
        lat: currentLocation.latitude,
        lon: currentLocation.longitude,
        city: city.city,
      });
      setError(null);
    } catch (err) {
      setError('Gagal mendapatkan lokasi, silahkan coba lagi' + err);
    } finally {
      setLoading(false);
    }
  };

  const getPrayerTimes = async () => {
    try {
      setLoading(true);
      const times = await getTodayPrayerTimes({
        lat: location?.lat || 0,
        lon: location?.lon || 0,
      });
      setPrayerTimes(times);
      setError(null);
    } catch (err) {
      setError('Gagal mendapatkan waktu sholat, silahkan coba lagi' + err);
    } finally {
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    if (!prayerTimes) return;

    const { next } = getCurrentNextPrayer();
    if (!next) return;

    const now = new Date();
    const [hours, minutes] = next.time.split(':').map(Number);

    const nextPrayerTime = new Date();
    nextPrayerTime.setHours(hours, minutes, 0, 0);

    // If next prayer is Fajr and it's after midnight, add a day
    if (next.key === 'fajr' && now.getHours() >= 12) {
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }

    const diff = nextPrayerTime.getTime() - now.getTime();

    if (diff < 0) {
      setCountdown('00:00:00');
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hoursLeft = Math.floor(totalSeconds / 3600);
    const minutesLeft = Math.floor((totalSeconds % 3600) / 60);
    const secondsLeft = totalSeconds % 60;

    const formattedCountdown = `${String(hoursLeft).padStart(2, '0')}:${String(
      minutesLeft,
    ).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    setCountdown(formattedCountdown);
  };

  const getCurrentNextPrayer = () => {
    if (!prayerTimes) return { current: null, next: null };

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: prayerTimes.fajr, key: 'fajr' },
      { name: 'Dhuhr', time: prayerTimes.dhuhr, key: 'dhuhr' },
      { name: 'Asr', time: prayerTimes.asr, key: 'asr' },
      { name: 'Maghrib', time: prayerTimes.maghrib, key: 'maghrib' },
      { name: 'Isha', time: prayerTimes.isha, key: 'isha' },
    ];

    const prayerMinutes = prayers.map(p => {
      const [hours, minutes] = p.time.split(':').map(Number);
      return { ...p, minutes: hours * 60 + minutes };
    });

    let next = null;

    for (let i = 0; i < prayerMinutes.length; i++) {
      if (currentTime >= prayerMinutes[i].minutes) {
        next = prayerMinutes[i + 1] || prayerMinutes[0];
      }
    }

    return { next };
  };

  const toggleNotification = async (
    prayer: keyof typeof settings.enabledPrayers,
  ) => {
    try {
      // Toggle di local state (NotificationContext)
      await togglePrayer(prayer);

      // Sync ke backend
      if (location) {
        await FCMService.updatePreferences({
          latitude: location.lat,
          longitude: location.lon,
        });
      }

      console.log(`Notification for ${prayer} toggled successfully`);
    } catch (err) {
      console.error('Error toggling notification:', err);
    }
  };

  const { next } = getCurrentNextPrayer();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Waktu Sholat</Text>
            <Text style={styles.headerSubtitle}>
              {loading ? 'Memuat lokasi...' : location?.city}
            </Text>
          </View>
          <View style={styles.headerButton}>
            <Pressable style={styles.settingsButton} onPress={getLocation}>
              <Ionicons name={'location-outline'} size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name={'settings-outline'} size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.currentTimeCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
            style={styles.currentTimeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.currentTimeContent}>
              <Text style={styles.currentTimeLabel}>Sholat Berikutnya</Text>
              <Text style={styles.currentTimeName}>{next?.name || 'Fajr'}</Text>
              <Text style={styles.currentTimeSubtext}>{countdown}</Text>
            </View>
            <Text style={styles.currentTime}>
              {next?.time
                ? next?.time + ` ${(next?.time as any) < 12 ? 'AM' : 'PM'}`
                : '00:00'}
            </Text>
          </LinearGradient>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Memuat waktu sholat...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FFCDD2" />
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={initializeScreen}>
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </Pressable>
            </View>
          ) : prayerTimes ? (
            <>
              <PrayerCard
                name="Fajr"
                time={prayerTimes.fajr}
                icon="sunny"
                isNext={next?.key === 'fajr'}
                notificationEnabled={settings.enabledPrayers.fajr}
                onToggleNotification={() => toggleNotification('fajr')}
              />
              <PrayerCard
                name="Dhuhr"
                time={prayerTimes.dhuhr}
                icon="partly-sunny"
                isNext={next?.key === 'dhuhr'}
                notificationEnabled={settings.enabledPrayers.dhuhr}
                onToggleNotification={() => toggleNotification('dhuhr')}
              />
              <PrayerCard
                name="Asr"
                time={prayerTimes.asr}
                icon="cloudy"
                isNext={next?.key === 'asr'}
                notificationEnabled={settings.enabledPrayers.asr}
                onToggleNotification={() => toggleNotification('asr')}
              />
              <PrayerCard
                name="Maghrib"
                time={prayerTimes.maghrib}
                icon="moon"
                isNext={next?.key === 'maghrib'}
                notificationEnabled={settings.enabledPrayers.maghrib}
                onToggleNotification={() => toggleNotification('maghrib')}
              />
              <PrayerCard
                name="Isha"
                time={prayerTimes.isha}
                icon="star"
                isNext={next?.key === 'isha'}
                notificationEnabled={settings.enabledPrayers.isha}
                onToggleNotification={() => toggleNotification('isha')}
              />
            </>
          ) : null}

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
