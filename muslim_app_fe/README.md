# Muslim App - React Native Frontend

Aplikasi Muslim yang menyediakan fitur jadwal sholat, kompas kiblat, kalender Islam, dan Al-Quran digital.

## 📱 Features

- ✅ **Jadwal Sholat** - Waktu sholat akurat berdasarkan lokasi
- ✅ **Kompas Kiblat** - Arah kiblat dengan kompas digital
- ✅ **Kalender Islam** - Kalender Hijriyah dengan event-event penting
- ✅ **Al-Quran Digital** - Baca Al-Quran lengkap dengan terjemahan
- ✅ **Onboarding** - Pengenalan fitur untuk pengguna baru
- ✅ **Notifikasi** - Pengingat waktu sholat (coming soon)

## 🏗️ Tech Stack

- **React Native** 0.82.1
- **TypeScript** 5.8.3
- **React Navigation** 7.x
  - Stack Navigator
  - Bottom Tab Navigator
- **AsyncStorage** - Persistent storage
- **Vector Icons** - Ionicons
- **Firebase** - Push notifications (FCM)

## 📁 Project Structure

```
muslim_app_fe/
├── src/
│   ├── navigations/
│   │   ├── AppNavigator.tsx          # Root Stack Navigator
│   │   └── MainTabNavigator.tsx      # Bottom Tab Navigator
│   ├── screens/
│   │   ├── OnBoarding.tsx            # Onboarding screen
│   │   ├── PrayerTimeScreen.tsx      # Jadwal Sholat
│   │   ├── QiblaCompassScreen.tsx    # Kompas Kiblat
│   │   ├── CalendarScreen.tsx        # Kalender Islam
│   │   ├── QuranScreen.tsx           # List Surah
│   │   ├── QuranDetailScreen.tsx     # Detail Surah
│   │   └── SettingsScreen.tsx        # Pengaturan
│   ├── components/                   # Reusable components
│   ├── types/
│   │   └── navigation.ts             # Navigation types
│   └── assets/                       # Images, fonts, etc
├── App.tsx                           # Entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm atau yarn
- React Native development environment setup
  - For Android: Android Studio, JDK
  - For iOS: Xcode, CocoaPods (macOS only)

Lihat [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) untuk panduan lengkap.

### Installation

1. **Clone repository**
   ```bash
   cd muslim_app_fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS only - Install CocoaPods**
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

### Running the App

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   ```

## 🧭 Navigation Structure

### Root Navigator (Stack)
```
AppNavigator
├── Onboarding (conditional - first time only)
└── MainTabs (after onboarding)
    ├── QuranDetail (stack screen)
    └── Settings (stack screen)
```

### Bottom Tabs
```
MainTabNavigator
├── PrayerTime    (Jadwal Sholat)
├── QiblaCompass  (Kompas Kiblat)
├── Calendar      (Kalender Islam)
└── Quran         (Al-Quran)
```

Lihat [NAVIGATION.md](./NAVIGATION.md) untuk detail lengkap struktur navigasi.

## 📝 Development Guide

### Onboarding Flow

Aplikasi menggunakan AsyncStorage untuk menyimpan status onboarding:
- Key: `hasCompletedOnboarding`
- Value: `'true'` atau `null`

Onboarding hanya ditampilkan sekali saat pertama kali install aplikasi.

### Adding New Screens

1. Buat file screen baru di `src/screens/`
2. Tambahkan route di navigator yang sesuai
3. Update types di `src/types/navigation.ts`

### State Management

Untuk state management global, disarankan menggunakan:
- Redux Toolkit
- Zustand
- React Context (untuk state sederhana)

### API Integration

Backend API tersedia di: `http://localhost:3000/api/v1`

Endpoints:
- `/quran` - Al-Quran data
- `/prayer` - Prayer times
- `/events` - Islamic events
- `/notifications` - Push notifications

## 🎨 Styling

- Menggunakan StyleSheet dari React Native
- Color palette:
  - Primary: `#2E7D32` (Green)
  - Background: `#FFFFFF`
  - Text: `#333333`
  - Secondary text: `#666666`

## 📦 Main Dependencies

```json
{
  "@react-navigation/native": "^7.1.22",
  "@react-navigation/native-stack": "^7.8.2",
  "@react-navigation/bottom-tabs": "^7.8.8",
  "@react-native-async-storage/async-storage": "^1.24.0",
  "@react-native-vector-icons/ionicons": "^12.3.0",
  "@react-native-firebase/app": "^23.5.0",
  "@react-native-firebase/messaging": "^23.5.0",
  "axios": "^1.13.2"
}
```

## 🔧 Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run lint       # Run ESLint
npm test           # Run tests
```

## 📱 Testing

### Reset Onboarding

Untuk testing onboarding flow, hapus AsyncStorage:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Di Dev Menu atau console
AsyncStorage.removeItem('hasCompletedOnboarding');
```

Kemudian reload aplikasi.

## 🐛 Troubleshooting

### Metro bundler error
```bash
npm start -- --reset-cache
```

### Android build error
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS build error
```bash
cd ios
bundle exec pod install
cd ..
npm run ios
```

## 📄 License

Private project - All rights reserved

## 👥 Team

Developed by Muslim App Team

---

## 🎯 Next Steps

- [ ] Implement Prayer Time API integration
- [ ] Add Qibla compass with device sensors
- [ ] Implement Quran reader with audio
- [ ] Add Islamic calendar with events
- [ ] Setup push notifications
- [ ] Add dark mode support
- [ ] Implement offline mode
- [ ] Add unit tests
- [ ] Add E2E tests

Lihat [STRUCTURE_SUMMARY.md](./STRUCTURE_SUMMARY.md) untuk detail implementasi.
