import React from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';
import { useNotificationSettings } from '../../contexts/NotificationContext';
import { FCMService } from '../../services/fcm.service';
import { styles } from './notification-settings-styles';
import { getCurrentLocation } from '../../utils/getCoordinates';

const notifyBeforeOptions = [
  { label: '1 menit sebelum', value: 1 },
  { label: '5 menit sebelum', value: 5 },
  { label: '10 menit sebelum', value: 10 },
  { label: '15 menit sebelum', value: 15 },
  { label: '20 menit sebelum', value: 20 },
  { label: '30 menit sebelum', value: 30 },
];

const prayerNames = {
  fajr: 'Subuh',
  dhuhr: 'Dzuhur',
  asr: 'Ashar',
  maghrib: 'Maghrib',
  isha: 'Isya',
};

export default function NotificationSettingsScreen() {
  const { settings, updateSettings, togglePrayer } = useNotificationSettings();

  const handleTogglePrayerNotifications = async (value: boolean) => {
    await updateSettings({ enablePrayerNotifications: value });

    // Update backend
    try {
      const location = await getCurrentLocation();
      await FCMService.updatePreferences({
        enablePrayerNotifications: value,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleToggleEventNotifications = async (value: boolean) => {
    await updateSettings({ enableEventNotifications: value });

    // Update backend
    await FCMService.updatePreferences({
      enableEventNotifications: value,
    });
  };

  const handleChangeNotifyBefore = async (value: number) => {
    await updateSettings({ notifyBeforePrayer: value });

    // Update backend
    await FCMService.updatePreferences({
      notifyBeforePrayer: value,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Prayer Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifikasi Shalat</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                Aktifkan Notifikasi Shalat
              </Text>
              <Text style={styles.settingDescription}>
                Terima pengingat waktu shalat
              </Text>
            </View>
            <Switch
              value={settings.enablePrayerNotifications}
              onValueChange={handleTogglePrayerNotifications}
              trackColor={{ false: '#767577', true: '#14be86' }}
              thumbColor={
                settings.enablePrayerNotifications ? '#fff' : '#f4f3f4'
              }
            />
          </View>

          {settings.enablePrayerNotifications && (
            <>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Waktu Notifikasi</Text>
                <View style={styles.dropdownContainer}>
                  <Dropdown
                    data={notifyBeforeOptions}
                    labelField="label"
                    valueField="value"
                    value={settings.notifyBeforePrayer}
                    onChange={item => handleChangeNotifyBefore(item.value)}
                    style={styles.dropdown}
                    selectedTextStyle={styles.dropdownText}
                    placeholderStyle={styles.dropdownText}
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.subsectionTitle}>Waktu Shalat</Text>
              <Text style={styles.subsectionDescription}>
                Pilih waktu shalat yang ingin diingatkan
              </Text>

              {Object.entries(prayerNames).map(([key, name]) => (
                <View key={key} style={styles.prayerRow}>
                  <Text style={styles.prayerLabel}>{name}</Text>
                  <Switch
                    value={
                      settings.enabledPrayers[
                        key as keyof typeof settings.enabledPrayers
                      ]
                    }
                    onValueChange={async () => {
                      await togglePrayer(
                        key as keyof typeof settings.enabledPrayers,
                      );

                      // Sync to backend
                      try {
                        const location = await getCurrentLocation();
                        await FCMService.updatePreferences({
                          latitude: location.latitude,
                          longitude: location.longitude,
                          enabledPrayers: {
                            ...settings.enabledPrayers,
                            [key]:
                              !settings.enabledPrayers[
                                key as keyof typeof settings.enabledPrayers
                              ],
                          },
                        });
                      } catch (error) {
                        console.error('Error syncing prayer toggle:', error);
                      }
                    }}
                    trackColor={{ false: '#767577', true: '#14be86' }}
                    thumbColor={
                      settings.enabledPrayers[
                        key as keyof typeof settings.enabledPrayers
                      ]
                        ? '#fff'
                        : '#f4f3f4'
                    }
                  />
                </View>
              ))}
            </>
          )}
        </View>

        {/* Event Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifikasi Event Islam</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Aktifkan Notifikasi Event</Text>
              <Text style={styles.settingDescription}>
                Terima pengingat hari besar Islam
              </Text>
            </View>
            <Switch
              value={settings.enableEventNotifications}
              onValueChange={handleToggleEventNotifications}
              trackColor={{ false: '#767577', true: '#14be86' }}
              thumbColor={
                settings.enableEventNotifications ? '#fff' : '#f4f3f4'
              }
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            💡 Notifikasi akan dikirim sesuai dengan lokasi Anda saat ini
          </Text>
          <Text style={styles.infoText}>
            📍 Pastikan GPS aktif untuk mendapatkan waktu shalat yang akurat
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
