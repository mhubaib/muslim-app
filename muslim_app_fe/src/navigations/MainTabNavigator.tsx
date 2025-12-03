import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PrayerTimeScreen from '../screens/PrayerTime';
import QiblaCompassScreen from '../screens/QiblaCompass';
import CalendarScreen from '../screens/Calendar';
import QuranScreen from '../screens/Quran';
import BottomTab from '../components/BottomTab';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <BottomTab {...props} />}
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
            })}>
            <Tab.Screen
                name="PrayerTime"
                component={PrayerTimeScreen}
                options={{
                    title: 'Jadwal Sholat',
                    headerTitle: 'Jadwal Sholat',
                }}
            />
            <Tab.Screen
                name="QiblaCompass"
                component={QiblaCompassScreen}
                options={{
                    title: 'Kiblat',
                    headerTitle: 'Arah Kiblat',
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    title: 'Kalender',
                    headerTitle: 'Kalender Islam',
                }}
            />
            <Tab.Screen
                name="Quran"
                component={QuranScreen}
                options={{
                    title: 'Al-Quran',
                    headerTitle: 'Al-Quran',
                }}
            />
        </Tab.Navigator>
    );
}
