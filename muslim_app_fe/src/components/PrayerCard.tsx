import Ionicons from "@react-native-vector-icons/ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { PrayerCardProps } from "../types/PrayerTimes";

export default function PrayerCard({ name, time, icon, isNext, notificationEnabled, onToggleNotification }: PrayerCardProps) {
    const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
    const bellRotation = useSharedValue(0);
    const bellScale = useSharedValue(1);
    const cardScale = useSharedValue(1);

    const animateBell = () => {
        bellRotation.value = withSequence(
            withTiming(-20, { duration: 100 }),
            withTiming(20, { duration: 100 }),
            withTiming(-20, { duration: 100 }),
            withTiming(20, { duration: 100 }),
            withTiming(0, { duration: 100 })
        );
        bellScale.value = withSequence(
            withSpring(1.2),
            withSpring(1)
        );
    };

    const bellAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${bellRotation.value}deg` },
            { scale: bellScale.value }
        ]
    }));

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }]
    }));

    const handleToggle = () => {
        animateBell();
        onToggleNotification();
    };

    return (
        <Animated.View style={[styles.prayerCard, isNext && styles.prayerCardNext, cardAnimatedStyle]}>
            <View style={styles.prayerCardLeft}>
                <Ionicons name={icon as any} size={24} color="#FFFFFF" />
                <View style={styles.prayerInfo}>
                    <Text style={[styles.prayerName, isNext && styles.prayerNameNext]}>{name}</Text>
                    <Text style={[styles.prayerTime, isNext && styles.prayerTimeNext]}>{time}</Text>
                </View>
            </View>
            <View style={styles.prayerCardRight}>
                {isNext && (
                    <View style={styles.nextBadge}>
                        <Text style={styles.nextBadgeText}>Berikutnya</Text>
                    </View>
                )}
                <Pressable
                    style={styles.notificationToggle}
                    onPress={handleToggle}
                >
                    <AnimatedIcon
                        name={notificationEnabled ? "notifications" : "notifications-off-outline"}
                        size={22}
                        color={notificationEnabled ? "#14be86" : "#999"}
                        style={bellAnimatedStyle}
                    />
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    prayerCard: {
        backgroundColor: '#20493bff',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    prayerCardNext: {
        backgroundColor: '#507265ff',
    },
    prayerCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    prayerCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    prayerInfo: {
        flex: 1,
    },
    prayerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    prayerNameNext: {
        color: '#fff',
    },
    prayerTime: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    prayerTimeNext: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    notificationToggle: {
        padding: 4,
    },
    nextBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nextBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
})