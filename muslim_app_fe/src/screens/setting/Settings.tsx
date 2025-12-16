import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { AVAILABLE_QARIS } from '../../utils/quranAudio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './settings-styles';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { qari, setQari } = useSettings();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        {/* Notification Settings */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings' as never)}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={24} color="#14be86" />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Pengaturan Notifikasi</Text>
              <Text style={styles.menuItemDescription}>
                Atur notifikasi shalat dan event Islam
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="rgba(255,255,255,0.5)"
          />
        </TouchableOpacity>

        {/* Qari Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Qari (Pengisi Suara)</Text>
          <Text style={styles.sectionDescription}>
            Suara ini akan digunakan saat memutar audio murattal.
          </Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={AVAILABLE_QARIS}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder="Pilih Qari"
            searchPlaceholder="Cari..."
            value={qari}
            onChange={item => {
              setQari(item.id);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
