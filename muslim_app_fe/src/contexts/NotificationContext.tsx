import React, {
  createContext,
  useContext,
  useState,
  FC,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
  enablePrayerNotifications: boolean;
  enableEventNotifications: boolean;
  notifyBeforePrayer: number;
  enabledPrayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  togglePrayer: (
    prayer: keyof NotificationSettings['enabledPrayers'],
  ) => Promise<void>;
  isInitialized: boolean;
  loadSettings: () => Promise<void>;
}

const defaultSettings: NotificationSettings = {
  enablePrayerNotifications: true,
  enableEventNotifications: true,
  notifyBeforePrayer: 5,
  enabledPrayers: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const STORAGE_KEY = '@notification_settings';

export const NotificationProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  };

  const togglePrayer = async (
    prayer: keyof NotificationSettings['enabledPrayers'],
  ) => {
    const updated = {
      ...settings,
      enabledPrayers: {
        ...settings.enabledPrayers,
        [prayer]: !settings.enabledPrayers[prayer],
      },
    };
    setSettings(updated);
    await saveSettings(updated);
  };

  return (
    <NotificationContext.Provider
      value={{ settings, updateSettings, togglePrayer, isInitialized, loadSettings }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationSettings = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationSettings must be used within NotificationProvider',
    );
  }
  return context;
};
