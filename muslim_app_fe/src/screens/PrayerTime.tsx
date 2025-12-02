import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrayerTimeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Jadwal Sholat</Text>
            <Text style={styles.subtitle}>Screen untuk menampilkan jadwal sholat</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
});
