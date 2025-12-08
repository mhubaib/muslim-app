import { View, Text } from 'react-native';
import { styles } from './calendar-style';

export default function CalendarScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kalender Islam</Text>
            <Text style={styles.subtitle}>Screen untuk menampilkan kalender dan event muslim</Text>
        </View>
    );
}
