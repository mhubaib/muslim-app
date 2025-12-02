import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OnBoardingProps {
    onComplete: () => void;
}

export default function OnBoardingScreen({ onComplete }: OnBoardingProps) {
    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            onComplete();
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Selamat Datang di Muslim App</Text>
                <Text style={styles.subtitle}>
                    Aplikasi pendamping ibadah harian Anda
                </Text>

                <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🕌</Text>
                        <Text style={styles.featureTitle}>Jadwal Sholat</Text>
                        <Text style={styles.featureDesc}>
                            Dapatkan jadwal sholat akurat sesuai lokasi Anda
                        </Text>
                    </View>

                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🧭</Text>
                        <Text style={styles.featureTitle}>Arah Kiblat</Text>
                        <Text style={styles.featureDesc}>
                            Temukan arah kiblat dengan mudah menggunakan kompas
                        </Text>
                    </View>

                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📖</Text>
                        <Text style={styles.featureTitle}>Al-Quran Digital</Text>
                        <Text style={styles.featureDesc}>
                            Baca Al-Quran lengkap dengan terjemahan
                        </Text>
                    </View>

                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📅</Text>
                        <Text style={styles.featureTitle}>Kalender Islam</Text>
                        <Text style={styles.featureDesc}>
                            Lihat tanggal penting dan event muslim
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleComplete}>
                <Text style={styles.buttonText}>Mulai</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2E7D32',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 40,
    },
    featuresContainer: {
        gap: 24,
    },
    feature: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    featureIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#2E7D32',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
