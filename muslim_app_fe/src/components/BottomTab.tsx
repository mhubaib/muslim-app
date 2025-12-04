import Ionicons, { IoniconsIconName } from "@react-native-vector-icons/ionicons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
    Easing
} from "react-native-reanimated";
import { useEffect } from "react";
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get('window');

const OverlayAnimation = Animated.createAnimatedComponent(LinearGradient)

export default function BottomTab({ state, navigation, descriptors }: BottomTabBarProps) {
    const overlayPosition = useSharedValue(0);

    const tabWidth = width / state.routes.length;
    const overlaySize = 50;
    const overlayOffset = (tabWidth - overlaySize) / 2;

    useEffect(() => {
        overlayPosition.value = withSpring(state.index * tabWidth + overlayOffset, {
            damping: 25,
            stiffness: 150,
        });
    }, [state.index, tabWidth, overlayOffset]);

    const overlayStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: overlayPosition.value }]
    }));

    const iconName: any = (route: string) => {
        switch (route) {
            case 'PrayerTime':
                return 'time-outline';
            case 'QiblaCompass':
                return 'compass-outline';
            case 'Calendar':
                return 'calendar-outline';
            case 'Quran':
                return 'book-outline';
        }
    }

    return (
        <View style={styles.container}>
            <OverlayAnimation
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={[styles.overlay, { width: overlaySize, height: overlaySize }, overlayStyle]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                return (
                    <TabItem
                        key={route.key}
                        route={route}
                        index={index}
                        isFocused={isFocused}
                        iconName={iconName(route.name)}
                        label={label as string}
                        navigation={navigation}
                        tabWidth={tabWidth}
                    />
                );
            })}
        </View>
    );
}

interface TabItemProps {
    route: any;
    index: number;
    isFocused: boolean;
    iconName: IoniconsIconName;
    label: string;
    navigation: any;
    tabWidth: number;
}

function TabItem({ route, index, isFocused, iconName, label, navigation, tabWidth }: TabItemProps) {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

    const shake = () => {
        rotation.value = withSequence(
            withTiming(-8, { duration: 300 }),
            withTiming(8, { duration: 300 }),
            withTiming(-8, { duration: 300 }),
            withTiming(8, { duration: 300 }),
            withTiming(0, { duration: 300 })
        );

        scale.value = withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 300 })
        );
    };

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            { rotateZ: `${rotation.value}deg` },
            { scale: scale.value }
        ]
    }));

    const onPress = () => {
        shake();
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };

    const onLongPress = () => {
        navigation.emit({
            type: 'tabLongPress',
            target: route.key,
        });
    };

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, { width: tabWidth }]}
        >
            <View style={styles.iconContainer}>
                <AnimatedIcon
                    name={iconName}
                    size={26}
                    color={isFocused ? '#14be86' : '#dbd8d8ff'}
                    style={animatedIconStyle}
                />
            </View>
            <Text style={[styles.label, { color: isFocused ? '#14be86' : '#dbd8d8ff' }]} numberOfLines={1}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#20493bff',
        height: 85,
        elevation: 8,
    },
    overlay: {
        position: 'absolute',
        borderRadius: 25,
        top: 6,
        left: 0,
        zIndex: 0,
    },
    tabItem: {
        flex: 1,
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        zIndex: 1,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    }
})