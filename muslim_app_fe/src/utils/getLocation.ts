import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude: number | null;
    heading: number | null;
    speed: number | null;
}

export interface LocationError {
    code: number;
    message: string;
}

export const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location to show prayer times for your area.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn('Error requesting location permission:', err);
            return false;
        }
    }
    return true;
};

export const getCurrentLocation = (
    timeout: number = 15000,
    maximumAge: number = 10000
): Promise<LocationCoordinates> => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                const coords: LocationCoordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                };
                resolve(coords);
            },
            (error) => {
                const locationError: LocationError = {
                    code: error.code,
                    message: getErrorMessage(error.code),
                };
                reject(locationError);
            },
            {
                enableHighAccuracy: true,
                timeout,
                maximumAge,
            }
        );
    });
};

/**
 * Watch location changes continuously
 * @param onLocationChange - Callback when location changes
 * @param onError - Callback when error occurs
 * @returns watchId that can be used to clear the watch
 */
export const watchLocation = (
    onLocationChange: (coords: LocationCoordinates) => void,
    onError?: (error: LocationError) => void
): number => {
    const watchId = Geolocation.watchPosition(
        (position) => {
            const coords: LocationCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                heading: position.coords.heading,
                speed: position.coords.speed,
            };
            onLocationChange(coords);
        },
        (error) => {
            if (onError) {
                const locationError: LocationError = {
                    code: error.code,
                    message: getErrorMessage(error.code),
                };
                onError(locationError);
            }
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 10, 
            interval: 5000, 
            fastestInterval: 2000, 
        }
    );

    return watchId;
};

/**
 * Clear location watch
 * @param watchId - The watch ID returned from watchLocation
 */
export const clearLocationWatch = (watchId: number): void => {
    Geolocation.clearWatch(watchId);
};

const getErrorMessage = (code: number): string => {
    switch (code) {
        case 1:
            return 'Location permission denied. Please enable location access in settings.';
        case 2:
            return 'Location unavailable. Please check if location services are enabled.';
        case 3:
            return 'Location request timed out. Please try again.';
        default:
            return 'An unknown error occurred while getting location.';
    }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};

const toRad = (degrees: number): number => {
    return (degrees * Math.PI) / 180;
};