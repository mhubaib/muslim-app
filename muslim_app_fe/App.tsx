/**
 * Muslim App - React Native Application
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';

// Import navigator
import AppNavigator from './src/navigations/AppNavigator';
import { SettingsProvider } from './src/context/SettingsContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { FCMService } from './src/services/fcm.service';
import {
  getCurrentLocation,
  requestLocationPermission,
} from './src/utils/getCoordinates';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    initializeFCM();
  }, []);

  const initializeFCM = async () => {
    try {
      // Request location permission
      const hasLocationPermission = await requestLocationPermission();
      if (!hasLocationPermission) {
        console.log('Location permission denied');
        return;
      }

      // Get current location
      const location = await getCurrentLocation();

      // Initialize FCM
      await FCMService.initialize(
        location.latitude,
        location.longitude,
        notification => {
          console.log('Notification pressed:', notification);
          // Handle notification press (navigate to specific screen, etc.)
        },
      );

      console.log('FCM initialized successfully');
    } catch (error) {
      console.error('Error initializing FCM:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <NotificationProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </NotificationProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
