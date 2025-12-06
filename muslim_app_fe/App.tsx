/**
 * Muslim App - React Native Application
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

// Import navigator
import AppNavigator from './src/navigations/AppNavigator';
import { SettingsProvider } from './src/context/SettingsContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
