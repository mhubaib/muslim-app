import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PagerView from 'react-native-pager-view';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
  interpolate,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';
import Ionicons from '@react-native-vector-icons/ionicons';
import { styles } from './on-boarding-style';

interface OnBoardingProps {
  onComplete: () => void;
}

const DATA = [
  {
    id: '1',
    title: 'Waktu Sholat Akurat',
    description:
      'Dapatkan jadwal sholat yang presisi berdasarkan lokasi Anda agar ibadah tetap tepat waktu.',
    icon: 'time-outline',
  },
  {
    id: '2',
    title: 'Al-Quran & Kiblat',
    description:
      'Baca Al-Quran di mana saja dan temukan arah kiblat dengan mudah menggunakan kompas digital.',
    icon: 'compass-outline',
  },
  {
    id: '3',
    title: 'Tetap Terhubung',
    description:
      'Pantau hari-hari besar Islam dan tingkatkan ketaqwaan Anda bersama Muslim App.',
    icon: 'notifications-outline',
  },
];

const AnimatedView = Animated.createAnimatedComponent(View);

export default function OnBoardingScreen({ onComplete }: OnBoardingProps) {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollOffset = useSharedValue(0);
  const position = useSharedValue(0);

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const handleNext = () => {
    if (currentPage < DATA.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const onPageScroll = (event: any) => {
    position.value = event.nativeEvent.position;
    scrollOffset.value = event.nativeEvent.offset;
  };

  const onPageSelected = (event: any) => {
    setCurrentPage(event.nativeEvent.position);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleComplete}>
        <Text style={styles.skipText}>Lewati</Text>
      </TouchableOpacity>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageScroll={onPageScroll}
        onPageSelected={onPageSelected}
      >
        {DATA.map((item, index) => (
          <View key={item.id} style={styles.page}>
            <PageContent
              item={item}
              index={index}
              position={position}
              scrollOffset={scrollOffset}
            />
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {DATA.map((_, index) => (
            <PaginationDot
              key={index}
              index={index}
              position={position}
              scrollOffset={scrollOffset}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentPage === DATA.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface PageContentProps {
  item: (typeof DATA)[0];
  index: number;
  position: SharedValue<number>;
  scrollOffset: SharedValue<number>;
}

function PageContent({
  item,
  index,
  position,
  scrollOffset,
}: PageContentProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = position.value + scrollOffset.value;
    const opacity = interpolate(
      input,
      [index - 0.5, index, index + 0.5],
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      input,
      [index - 0.5, index, index + 0.5],
      [50, 0, 50],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      input,
      [index - 0.5, index, index + 0.5],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <AnimatedView style={[styles.page, animatedStyle]}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={120} color="#2E7D32" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </AnimatedView>
  );
}

interface PaginationDotProps {
  index: number;
  position: SharedValue<number>;
  scrollOffset: SharedValue<number>;
}

function PaginationDot({ index, position, scrollOffset }: PaginationDotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = position.value + scrollOffset.value;
    const width = interpolate(
      input,
      [index - 1, index, index + 1],
      [8, 20, 8],
      Extrapolation.CLAMP,
    );
    const backgroundColor = interpolateColor(
      input,
      [index - 1, index, index + 1],
      ['#E0E0E0', '#2E7D32', '#E0E0E0'],
    );

    return {
      width,
      backgroundColor,
    };
  });

  return <AnimatedView style={[styles.dot, animatedStyle]} />;
}
