import { Text, View, ScrollView, Pressable, ActivityIndicator, Dimensions } from "react-native";
import { getTodayPrayerTimes } from "../../api/shalat";
import { useEffect, useState } from "react";
import { getCurrentLocation, requestLocationPermission } from "../../utils/getLocation";
import { PrayerNotificationSettings, PrayerTimes } from "../../types/PrayerTimes";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./prayer-style";
import Ionicons from "@react-native-vector-icons/ionicons";
import Animated from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import PrayerCard from "../../components/PrayerCard";

export default function PrayerTimeScreen() {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number, lon: number, city?: string } | null>(null);
    const [calculationMethod, setCalculationMethod] = useState<string>("MWL");
    const [showSettings, setShowSettings] = useState(false);
    const [notifications, setNotifications] = useState<PrayerNotificationSettings>({
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
    });

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

    const getLocation = async () => {
        try {
            setLoading(true);
            const permission = await requestLocationPermission();
            if (!permission) {
                setError('Akses lokasi ditolak, silahkan aktifkan akses lokasi di pengaturan');
                setLoading(false);
                return;
            }
            const currentLocation = await getCurrentLocation();
            setLocation({
                lat: currentLocation.latitude,
                lon: currentLocation.longitude,
                city: "Jakarta"
            });
            setError(null);
        } catch (error) {
            setError('Gagal mendapatkan lokasi, silahkan coba lagi');
        } finally {
            setLoading(false);
        }
    };

    const getPrayerTimes = async () => {
        try {
            setLoading(true);
            const times = await getTodayPrayerTimes({ lat: location?.lat || 0, lon: location?.lon || 0 });
            setPrayerTimes(times);
            setError(null);
        } catch (error) {
            setError('Gagal mendapatkan waktu sholat, silahkan coba lagi');
        } finally {
            setLoading(false);
        }
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

        let current = null;
        let next = null;

        for (let i = 0; i < prayerMinutes.length; i++) {
            if (currentTime >= prayerMinutes[i].minutes) {
                current = prayerMinutes[i];
                next = prayerMinutes[i + 1] || prayerMinutes[0];
            }
        }

        if (!current) {
            current = prayerMinutes[prayerMinutes.length - 1];
            next = prayerMinutes[0];
        }

        return { current, next };
    };

    const toggleNotification = (prayer: keyof PrayerNotificationSettings) => {
        setNotifications(prev => ({
            ...prev,
            [prayer]: !prev[prayer]
        }));
    };

    const { current, next } = getCurrentNextPrayer();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.innerContainer}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Waktu Sholat</Text>
                        <Text style={styles.headerSubtitle}>
                            {location?.city || 'Memuat lokasi...'}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.settingsButton}
                        onPress={() => setShowSettings(!showSettings)}
                    >
                        <Ionicons
                            name={showSettings ? "close" : "settings-outline"}
                            size={24}
                            color="#FFFFFF"
                        />
                    </Pressable>
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
                            <Text style={styles.currentTimeName}>
                                {next?.name || 'Fajr'}
                            </Text>
                            <Text style={styles.currentTimeSubtext}>
                                Sholat {current?.name || 'Isha'} telah berlalu
                            </Text>
                        </View>
                        <Text style={styles.currentTime}>
                            {next?.time + ` ${next?.time as any < 12 ? 'AM' : 'PM'}` || '--:--'}
                        </Text>
                    </LinearGradient>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    {showSettings && (
                        <Animated.View style={styles.settingsPanel}>
                            <View style={styles.settingsPanelContent}>
                                <Text style={styles.settingsPanelTitle}>Pengaturan</Text>

                                <View style={styles.settingItem}>
                                    <View style={styles.settingItemHeader}>
                                        <Ionicons name="location-outline" size={20} color="#2E7D32" />
                                        <Text style={styles.settingItemTitle}>Lokasi</Text>
                                    </View>
                                    <Pressable
                                        style={styles.settingButton}
                                        onPress={getLocation}
                                    >
                                        <Text style={styles.settingButtonText}>
                                            {location ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : 'Dapatkan Lokasi'}
                                        </Text>
                                        <Ionicons name="chevron-forward" size={20} color="#666" />
                                    </Pressable>
                                </View>

                                <View style={styles.settingItem}>
                                    <View style={styles.settingItemHeader}>
                                        <Ionicons name="calculator-outline" size={20} color="#2E7D32" />
                                        <Text style={styles.settingItemTitle}>Metode Perhitungan</Text>
                                    </View>
                                    <View style={styles.calculationMethods}>
                                        {['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi'].map((method) => (
                                            <Pressable
                                                key={method}
                                                style={[
                                                    styles.methodChip,
                                                    calculationMethod === method && styles.methodChipActive
                                                ]}
                                                onPress={() => setCalculationMethod(method)}
                                            >
                                                <Text style={[
                                                    styles.methodChipText,
                                                    calculationMethod === method && styles.methodChipTextActive
                                                ]}>
                                                    {method}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    )}

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
                                notificationEnabled={notifications.fajr}
                                onToggleNotification={() => toggleNotification('fajr')}
                            />
                            <PrayerCard
                                name="Dhuhr"
                                time={prayerTimes.dhuhr}
                                icon="partly-sunny"
                                isNext={next?.key === 'dhuhr'}
                                notificationEnabled={notifications.dhuhr}
                                onToggleNotification={() => toggleNotification('dhuhr')}
                            />
                            <PrayerCard
                                name="Asr"
                                time={prayerTimes.asr}
                                icon="cloudy"
                                isNext={next?.key === 'asr'}
                                notificationEnabled={notifications.asr}
                                onToggleNotification={() => toggleNotification('asr')}
                            />
                            <PrayerCard
                                name="Maghrib"
                                time={prayerTimes.maghrib}
                                icon="moon"
                                isNext={next?.key === 'maghrib'}
                                notificationEnabled={notifications.maghrib}
                                onToggleNotification={() => toggleNotification('maghrib')}
                            />
                            <PrayerCard
                                name="Isha"
                                time={prayerTimes.isha}
                                icon="star"
                                isNext={next?.key === 'isha'}
                                notificationEnabled={notifications.isha}
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
