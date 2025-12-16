import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import MainTabNavigator from './MainTabNavigator';

import OnBoardingScreen from '../screens/on-boarding/OnBoarding';
import QuranDetailScreen from '../screens/quran-detail/QuranDetail';
import SettingsScreen from '../screens/setting/Settings';
import NotificationSettingsScreen from '../screens/notification-settings/NotificationSettings';
import { useNotificationSettings } from '../contexts/NotificationContext';

const AppStack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const { loadSettings } = useNotificationSettings();

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  useEffect(() => {
    checkOnboardingStatus();
    loadSettings();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!hasCompletedOnboarding ? (
        <AppStack.Screen
          name="Onboarding"
          children={() => (
            <OnBoardingScreen onComplete={handleOnboardingComplete} />
          )}
        />
      ) : (
        <>
          <AppStack.Screen name="MainTabs" component={MainTabNavigator} />
          <AppStack.Screen
            name="QuranDetail"
            component={QuranDetailScreen}
            options={{
              headerShown: false,
              title: 'Detail Surah',
            }}
          />
          <AppStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Pengaturan',
              headerStyle: {
                backgroundColor: '#20493bff',
              },
              headerTintColor: '#FFFFFF',
            }}
          />
          <AppStack.Screen
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{
              headerShown: true,
              title: 'Pengaturan Notifikasi',
              headerStyle: {
                backgroundColor: '#20493bff',
              },
              headerTintColor: '#FFFFFF',
            }}
          />
        </>
      )}
    </AppStack.Navigator>
  );
}
