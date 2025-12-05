import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PrayerTimeScreen from '../screens/prayer-time/PrayerTime';
import QiblaCompassScreen from '../screens/QiblaCompass';
import CalendarScreen from '../screens/Calendar';
import QuranScreen from '../screens/Quran';
import BottomTab from '../components/BottomTab';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <BottomTab {...props} />}
            screenOptions={{
                tabBarActiveTintColor: '#2E7D32',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}>
            <Tab.Screen
                name="PrayerTime"
                component={PrayerTimeScreen}
                options={{
                    tabBarLabel: 'Prayers'
                }}
            />
            <Tab.Screen
                name="QiblaCompass"
                component={QiblaCompassScreen}
                options={{
                    tabBarLabel: 'Qibla'
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarLabel: 'Calendar'
                }}
            />
            <Tab.Screen
                name="Quran"
                component={QuranScreen}
                options={{
                    tabBarLabel: 'Quran'
                }}
            />
        </Tab.Navigator>
    );
}
