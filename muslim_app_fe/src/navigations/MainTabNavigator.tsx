import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons';

import PrayerTimeScreen from '../screens/PrayerTime';
import QiblaCompassScreen from '../screens/QiblaCompass';
import CalendarScreen from '../screens/Calendar';
import QuranScreen from '../screens/Quran';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: IoniconsIconName = 'time-outline';

                    if (route.name === 'PrayerTime') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'QiblaCompass') {
                        iconName = focused ? 'compass' : 'compass-outline';
                    } else if (route.name === 'Calendar') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Quran') {
                        iconName = focused ? 'book' : 'book-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
                tabBarStyle: {
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
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
