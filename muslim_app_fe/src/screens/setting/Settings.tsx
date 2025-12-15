import { View, Text } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { AVAILABLE_QARIS } from '../../utils/quranAudio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './settings-styles';
import { Dropdown } from 'react-native-element-dropdown';

export default function SettingsScreen() {
  const { qari, setQari } = useSettings();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
    </SafeAreaView>
  );
}
