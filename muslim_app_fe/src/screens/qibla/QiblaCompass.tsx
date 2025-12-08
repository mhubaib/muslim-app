import { View, Text } from 'react-native';
import { styles } from './qibla-style';

export default function QiblaCompassScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kompas Kiblat</Text>
            <Text style={styles.subtitle}>Screen untuk menampilkan arah kiblat</Text>
        </View>
    );
}

