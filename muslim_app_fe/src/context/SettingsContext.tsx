import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsContextType = {
  qari: string;
  setQari: (qari: string) => Promise<void>;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType>({
  qari: 'ar.alafasy',
  setQari: async () => {},
  isLoading: true,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [qari, setQariState] = useState('ar.alafasy');
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = '@settings_qari';

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedQari = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedQari) {
          setQariState(savedQari);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const setQari = async (newQari: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newQari);
      setQariState(newQari);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ qari, setQari, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

