import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CompassHeading from 'react-native-compass-heading';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Ionicons from '@react-native-vector-icons/ionicons';
import { styles } from './qibla-style';
import {
  getCurrentLocation,
  requestLocationPermission,
} from '../../utils/getCoordinates';
import { calculateQiblaDirection } from '../../utils/qibla';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.65;

export default function QiblaCompassScreen() {
  const [compassHeading, setCompassHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rotation = useSharedValue(0);
  const qiblaRotation = useSharedValue(0);

  useEffect(() => {
    initializeCompass();
    return () => {
      CompassHeading.stop();
    };
  }, []);

  const initializeCompass = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError(
          'Izin lokasi ditolak. Aktifkan izin lokasi untuk menggunakan kompas kiblat.',
        );
        setLoading(false);
        return;
      }

      // Get user location
      const location = await getCurrentLocation();
      setUserLocation({
        lat: location.latitude,
        lon: location.longitude,
      });

      // Calculate Qibla direction
      const qibla = calculateQiblaDirection(
        location.latitude,
        location.longitude,
      );
      setQiblaDirection(qibla);

      // Start compass
      const degreeUpdateRate = 3;
      CompassHeading.start(
        degreeUpdateRate,
        ({ heading }: { heading: number }) => {
          setCompassHeading(heading);
        },
      );

      setLoading(false);
    } catch (err) {
      console.error('Compass initialization error:', err);
      setError(
        'Gagal mendapatkan lokasi atau memulai kompas. Pastikan GPS aktif.',
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qiblaDirection !== null) {
      // Rotate compass opposite to heading
      rotation.value = withSpring(-compassHeading, {
        damping: 20,
        stiffness: 50,
      });

      // Rotate Qibla indicator to point to Qibla
      const qiblaAngle = qiblaDirection - compassHeading;
      qiblaRotation.value = withSpring(qiblaAngle, {
        damping: 20,
        stiffness: 50,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compassHeading, qiblaDirection]);

  const compassAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const qiblaAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${qiblaRotation.value}deg` }],
    };
  });

  const getCardinalPosition = (angle: number) => {
    const radius = COMPASS_SIZE / 2 - 30;
    const radian = ((angle - 90) * Math.PI) / 180;
    return {
      left: COMPASS_SIZE / 2 + radius * Math.cos(radian) - 20,
      top: COMPASS_SIZE / 2 + radius * Math.sin(radian) - 20,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#14be86" />
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FFCDD2" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const qiblaAngle = qiblaDirection !== null ? Math.round(qiblaDirection) : 0;
  const relativeAngle =
    qiblaDirection !== null
      ? Math.round((qiblaDirection - compassHeading + 360) % 360)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kiblat</Text>
      </View>

      <View style={styles.compassContainer}>
        <Animated.View style={[styles.compassCircle, compassAnimatedStyle]}>
          {/* Cardinal directions */}
          <View style={[styles.cardinalMarker, getCardinalPosition(0)]}>
            <Text style={styles.cardinalText}>U</Text>
          </View>
          <View style={[styles.cardinalMarker, getCardinalPosition(90)]}>
            <Text style={styles.cardinalText}>T</Text>
          </View>
          <View style={[styles.cardinalMarker, getCardinalPosition(180)]}>
            <Text style={styles.cardinalText}>S</Text>
          </View>
          <View style={[styles.cardinalMarker, getCardinalPosition(270)]}>
            <Text style={styles.cardinalText}>B</Text>
          </View>

          <View style={styles.compassInner}>
            <Ionicons name="business" size={60} color="#14be86" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              width: COMPASS_SIZE,
              height: COMPASS_SIZE,
            },
            qiblaAnimatedStyle,
          ]}
        >
          <View style={styles.directionMarker} />
        </Animated.View>
      </View>

      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.degreeText}>{relativeAngle}°</Text>
          <Text style={styles.degreeLabel}>Arah Kiblat</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="compass-outline" size={20} color="#14be86" />
            <Text style={styles.infoLabel}>Arah Kompas</Text>
            <Text style={styles.infoValue}>{Math.round(compassHeading)}°</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="navigate-outline" size={20} color="#14be86" />
            <Text style={styles.infoLabel}>Arah Kiblat</Text>
            <Text style={styles.infoValue}>{qiblaAngle}°</Text>
          </View>
        </View>

        {userLocation && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#14be86" />
              <Text style={styles.infoLabel}>Lokasi Anda</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Latitude</Text>
              <Text style={styles.infoValue}>
                {userLocation.lat.toFixed(6)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Longitude</Text>
              <Text style={styles.infoValue}>
                {userLocation.lon.toFixed(6)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
