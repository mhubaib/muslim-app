# 📱 Prayer Notification System - Documentation

## 📋 Overview

Sistem notifikasi jadwal shalat yang lengkap dengan manajemen device token FCM, scheduling otomatis, dan processing real-time.

## 🏗️ Arsitektur

### **Flow Notifikasi**

```
┌─────────────────────────────────────────────────────────────┐
│  1. Device Registration (Frontend)                          │
│     - Get FCM Token from Firebase                           │
│     - Send to Backend: POST /device/register                │
│     - Include: token, location, preferences                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Daily Scheduling (Cron Job - 1 AM)                      │
│     - Get all devices with prayer notifications enabled     │
│     - For each device:                                      │
│       * Get prayer times based on location                  │
│       * Schedule notifications (X minutes before)           │
│       * Save to NotificationSchedule table                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Processing (Cron Job - Every Minute)                    │
│     - Get pending notifications (scheduleAt <= now)         │
│     - Send via FCM to specific device token                 │
│     - Mark as sent                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Cleanup (Cron Jobs)                                     │
│     - Clean old notifications (7 days) - Daily 3 AM         │
│     - Clean inactive devices (30 days) - Weekly Sunday 2 AM │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema

### **DeviceToken**

```prisma
model DeviceToken {
  id          Int      @id @default(autoincrement())
  token       String   @unique              // FCM Token
  deviceId    String?                       // Device identifier
  platform    String?                       // 'android' or 'ios'

  // Location for prayer time notifications
  latitude    Float?
  longitude   Float?
  timezone    String?

  // Notification preferences
  enablePrayerNotifications Boolean @default(true)
  enableEventNotifications  Boolean @default(true)
  notifyBeforePrayer Int @default(5)        // Minutes before prayer

  lastActiveAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  notifications NotificationSchedule[]
}
```

### **NotificationSchedule**

```prisma
model NotificationSchedule {
  id          Int      @id @default(autoincrement())
  type        NotificationType              // AZAN, EVENT_ISLAMIC, CUSTOM
  title       String
  body        String
  scheduleAt  DateTime
  meta        Json?

  // For device-specific notifications
  deviceTokenId Int?
  deviceToken   DeviceToken? @relation(...)

  // Tracking
  sent        Boolean @default(false)
  sentAt      DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔌 API Endpoints

### **Device Management**

#### 1. Register Device

```http
POST /device/register
Content-Type: application/json

{
  "token": "FCM_TOKEN_HERE",
  "deviceId": "unique-device-id",
  "platform": "android",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "timezone": "Asia/Jakarta"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "token": "FCM_TOKEN_HERE",
    "enablePrayerNotifications": true,
    "enableEventNotifications": true,
    "notifyBeforePrayer": 5,
    ...
  }
}
```

#### 2. Update Preferences

```http
PUT /device/:token/preferences
Content-Type: application/json

{
  "enablePrayerNotifications": true,
  "enableEventNotifications": false,
  "notifyBeforePrayer": 10,
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

#### 3. Get Device Info

```http
GET /device/:token
```

#### 4. Unregister Device

```http
DELETE /device/:token
```

## 🔧 Services

### **DeviceTokenService**

```typescript
class DeviceTokenService {
  // Register or update device
  registerDevice(data: RegisterDeviceDto);

  // Update notification preferences
  updatePreferences(token: string, preferences: UpdateDevicePreferencesDto);

  // Get device by token
  getDeviceByToken(token: string);

  // Unregister device
  unregisterDevice(token: string);

  // Get devices with prayer notifications enabled
  getDevicesWithPrayerNotifications();

  // Clean inactive devices (30 days)
  cleanInactiveDevices();
}
```

### **PrayerNotificationService**

```typescript
class PrayerNotificationService {
  // Schedule prayer notifications for all devices (Daily 1 AM)
  scheduleDailyPrayerNotifications();

  // Schedule for specific device
  schedulePrayerNotificationsForDevice(
    deviceId: number,
    deviceToken: string,
    latitude: number,
    longitude: number,
    notifyBeforeMinutes: number
  );

  // Process pending notifications (Every minute)
  processPendingPrayerNotifications();

  // Clean old notifications (7 days)
  cleanOldNotifications();
}
```

### **NotificationService**

```typescript
class NotificationService {
  // Send to FCM topic (broadcast)
  sendToTopic(data: SendNotificationDto);

  // Send to specific device
  sendToDevice(token: string, data: SendNotificationDto);

  // Send to multiple devices
  sendToMultipleDevices(tokens: string[], data: SendNotificationDto);

  // Schedule notification
  scheduleNotification(data: ScheduleNotificationDto);

  // Process pending notifications
  processPendingNotifications();
}
```

## ⏰ Cron Jobs

### **1. Daily Prayer Notification Scheduling (1 AM)**

```typescript
cron.schedule("0 1 * * *", async () => {
  await prayerNotificationService.scheduleDailyPrayerNotifications();
});
```

- Runs every day at 1 AM
- Gets all devices with prayer notifications enabled
- Schedules notifications for all 5 prayers
- Calculates prayer times based on device location

### **2. Process Prayer Notifications (Every Minute)**

```typescript
cron.schedule("* * * * *", async () => {
  await prayerNotificationService.processPendingPrayerNotifications();
});
```

- Runs every minute
- Gets pending notifications (scheduleAt <= now)
- Sends via FCM to device token
- Marks as sent

### **3. Clean Inactive Devices (Weekly - Sunday 2 AM)**

```typescript
cron.schedule("0 2 * * 0", async () => {
  await deviceTokenService.cleanInactiveDevices();
});
```

- Removes devices not active for 30 days

### **4. Clean Old Notifications (Daily 3 AM)**

```typescript
cron.schedule("0 3 * * *", async () => {
  await prayerNotificationService.cleanOldNotifications();
});
```

- Removes sent notifications older than 7 days

## 📱 Frontend Integration (React Native)

### **1. Setup Firebase Messaging**

```typescript
import messaging from "@react-native-firebase/messaging";

// Request permission
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
};

// Get FCM Token
const getFCMToken = async () => {
  const token = await messaging().getToken();
  return token;
};
```

### **2. Register Device**

```typescript
import Geolocation from "@react-native-community/geolocation";

const registerDevice = async () => {
  try {
    // Get FCM token
    const fcmToken = await getFCMToken();

    // Get location
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Register to backend
        const response = await fetch("http://your-api/device/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "YOUR_API_KEY",
          },
          body: JSON.stringify({
            token: fcmToken,
            deviceId: DeviceInfo.getUniqueId(),
            platform: Platform.OS,
            latitude,
            longitude,
            timezone: RNLocalize.getTimeZone(),
          }),
        });

        const data = await response.json();
        console.log("Device registered:", data);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  } catch (error) {
    console.error("Failed to register device:", error);
  }
};
```

### **3. Handle Notifications**

```typescript
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";

// Foreground handler
messaging().onMessage(async (remoteMessage) => {
  console.log("Foreground notification:", remoteMessage);

  // Display notification using notifee
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId: "prayer-notifications",
      sound: "azan", // Custom sound
      importance: AndroidImportance.HIGH,
    },
  });
});

// Background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background notification:", remoteMessage);
});
```

### **4. Update Preferences**

```typescript
const updateNotificationPreferences = async (
  fcmToken: string,
  preferences: {
    enablePrayerNotifications: boolean;
    notifyBeforePrayer: number;
  }
) => {
  try {
    const response = await fetch(
      `http://your-api/device/${fcmToken}/preferences`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY",
        },
        body: JSON.stringify(preferences),
      }
    );

    const data = await response.json();
    console.log("Preferences updated:", data);
  } catch (error) {
    console.error("Failed to update preferences:", error);
  }
};
```

## 🎯 Example Notification

### **Prayer Time Notification**

```json
{
  "notification": {
    "title": "🌅 Waktu Fajr",
    "body": "5 menit lagi masuk waktu Fajr (04:30)"
  },
  "data": {
    "prayerName": "Fajr",
    "prayerTime": "04:30",
    "notifyBeforeMinutes": "5"
  },
  "token": "DEVICE_FCM_TOKEN"
}
```

## 🔐 Security

1. **API Key Middleware**: Semua endpoint dilindungi dengan API key
2. **Token Validation**: FCM token divalidasi saat registrasi
3. **Device Cleanup**: Inactive devices dihapus otomatis
4. **Rate Limiting**: Implementasikan rate limiting untuk prevent abuse

## 📊 Monitoring

### **Logs to Monitor**

1. **Scheduling**: Berapa banyak notifikasi yang di-schedule
2. **Processing**: Success/failure rate pengiriman
3. **Cleanup**: Berapa device/notification yang dihapus
4. **Errors**: FCM errors, database errors

### **Metrics**

- Total active devices
- Notifications sent per day
- Success rate
- Average processing time

## 🚀 Deployment

### **Environment Variables**

```env
DATABASE_URL="postgresql://..."
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL="..."
API_KEY="your-secret-api-key"
PORT=3000
```

### **Start Server**

```bash
npm run dev    # Development
npm run build  # Build
npm start      # Production
```

## 🐛 Troubleshooting

### **Notifikasi tidak terkirim**

1. Cek FCM token masih valid
2. Cek device masih registered
3. Cek cron job berjalan
4. Cek logs untuk errors

### **Notifikasi terlambat**

1. Cek server time zone
2. Cek prayer time calculation
3. Cek cron job frequency

### **Device tidak menerima notifikasi**

1. Cek `enablePrayerNotifications` = true
2. Cek location data tersedia
3. Cek FCM token valid
4. Cek app permissions

## 📝 TODO / Future Improvements

- [ ] Add notification history endpoint
- [ ] Add analytics for notification delivery
- [ ] Support for custom notification sounds
- [ ] Add notification templates
- [ ] Support for multiple languages
- [ ] Add notification scheduling UI
- [ ] Implement notification grouping
- [ ] Add silent notifications for background updates
