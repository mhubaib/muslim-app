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

const { width } = Dimensions.get('window');

export default function BottomTab({ state, navigation, descriptors }: BottomTabBarProps) {
    const overlayPosition = useSharedValue(0);

    const tabWidth = width / state.routes.length;

    useEffect(() => {
        overlayPosition.value = withSpring(state.index * tabWidth, {
            damping: 25,
            stiffness: 100,
        });
    }, [state.index, tabWidth]);

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
            <Animated.View style={[styles.overlay, { width: tabWidth }, overlayStyle]} />

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
                    color={isFocused ? '#2E7D32' : '#757575'}
                    style={animatedIconStyle}
                />
            </View>
            <Text style={[styles.label, { color: isFocused ? '#2E7D32' : '#757575' }]} numberOfLines={1}>
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
        backgroundColor: '#FFFFFF',
        height: 80,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        elevation: 8,
    },
    overlay: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#dbfaddff',
        borderRadius: 0,
        top: 0,
        left: 0,
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