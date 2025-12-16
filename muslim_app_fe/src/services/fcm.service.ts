import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { axiosInstance } from '../api/axiosInstance';

export class FCMService {
  /**
   * Request notification permission
   */
  static async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } else {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token
   */
  static async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Register device to backend
   */
  static async registerDevice(
    latitude: number,
    longitude: number,
    timezone?: string,
  ): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) {
        console.error('No FCM token available');
        return false;
      }

      const deviceId = await DeviceInfo.getUniqueId();

      const response = await axiosInstance.post('/device/register', {
        token,
        deviceId,
        platform: Platform.OS,
        latitude,
        longitude,
        timezone: timezone || 'Asia/Jakarta',
      });

      if (response.data.success) {
        console.log('Device registered successfully:', response.data.data);
        return true;
      } else {
        console.error('Failed to register device:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(preferences: {
    enablePrayerNotifications?: boolean;
    enableEventNotifications?: boolean;
    notifyBeforePrayer?: number;
    latitude?: number;
    longitude?: number;
  }): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) {
        console.error('No FCM token available');
        return false;
      }

      const response = await axiosInstance.put(
        `/device/${encodeURIComponent(token)}/preferences`,
        preferences,
      );

      if (response.data.success) {
        console.log('Preferences updated successfully:', response.data.data);
        return true;
      } else {
        console.error('Failed to update preferences:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Setup notification channel (Android)
   */
  static async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'prayer-notifications',
        name: 'Prayer Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }
  }

  /**
   * Setup foreground notification handler
   */
  static setupForegroundHandler() {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);

      // Display notification using notifee
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId: 'prayer-notifications',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      });
    });
  }

  /**
   * Setup background notification handler
   */
  static setupBackgroundHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background notification received:', remoteMessage);
    });
  }

  /**
   * Setup notification interaction handler
   */
  static setupNotificationInteractionHandler(
    onNotificationPress: (notification: any) => void,
  ) {
    // Handle notification press when app is in foreground/background
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification);
        onNotificationPress(detail.notification);
      }
    });

    // Handle notification press when app is killed
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Background notification pressed:', detail.notification);
      }
    });
  }

  /**
   * Initialize FCM
   */
  static async initialize(
    latitude: number,
    longitude: number,
    onNotificationPress?: (notification: any) => void,
  ): Promise<boolean> {
    try {
      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return false;
      }

      // Setup notification channel
      await this.setupNotificationChannel();

      // Setup handlers
      this.setupForegroundHandler();
      this.setupBackgroundHandler();

      if (onNotificationPress) {
        this.setupNotificationInteractionHandler(onNotificationPress);
      }

      // Register device
      const registered = await this.registerDevice(latitude, longitude);

      return registered;
    } catch (error) {
      console.error('Error initializing FCM:', error);
      return false;
    }
  }
}
