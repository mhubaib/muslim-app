import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './on-boarding-style';

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
