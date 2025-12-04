/**
 * EXAMPLE USAGE OF LOCATION HELPERS
 * 
 * This file demonstrates how to use the location helper functions
 * in your React Native components.
 */

import { useEffect, useState } from 'react';
import {
    getCurrentLocation,
    watchLocation,
    clearLocationWatch,
    requestLocationPermission,
    LocationCoordinates,
    LocationError,
} from './getLocation';

// ============================================
// EXAMPLE 1: Get Current Location Once
// ============================================

export const useCurrentLocation = () => {
    const [location, setLocation] = useState<LocationCoordinates | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            // Request permission first
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                setError('Location permission denied');
                setLoading(false);
                return;
            }

            // Get current location
            const coords = await getCurrentLocation();
            setLocation(coords);
        } catch (err) {
            const locationError = err as LocationError;
            setError(locationError.message);
        } finally {
            setLoading(false);
        }
    };

    return { location, loading, error, fetchLocation };
};

// ============================================
// EXAMPLE 2: Watch Location Changes
// ============================================

export const useWatchLocation = () => {
    const [location, setLocation] = useState<LocationCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);

    const startWatching = async () => {
        // Request permission first
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            setError('Location permission denied');
            return;
        }

        // Start watching location
        const id = watchLocation(
            (coords) => {
                setLocation(coords);
                setError(null);
            },
            (err) => {
                setError(err.message);
            }
        );

        setWatchId(id);
    };

    const stopWatching = () => {
        if (watchId !== null) {
            clearLocationWatch(watchId);
            setWatchId(null);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchId !== null) {
                clearLocationWatch(watchId);
            }
        };
    }, [watchId]);

    return { location, error, startWatching, stopWatching, isWatching: watchId !== null };
};

// ============================================
// EXAMPLE 3: Component Usage
// ============================================

/*
import React, { useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useCurrentLocation, useWatchLocation } from './utils/locationExamples';

// Example 1: Get location once
const PrayerTimeScreen = () => {
    const { location, loading, error, fetchLocation } = useCurrentLocation();

    useEffect(() => {
        fetchLocation();
    }, []);

    if (loading) return <ActivityIndicator />;
    if (error) return <Text>Error: {error}</Text>;
    if (!location) return <Text>No location data</Text>;

    return (
        <View>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Accuracy: {location.accuracy}m</Text>
            <Button title="Refresh Location" onPress={fetchLocation} />
        </View>
    );
};

// Example 2: Watch location continuously
const QiblaCompassScreen = () => {
    const { location, error, startWatching, stopWatching, isWatching } = useWatchLocation();

    useEffect(() => {
        startWatching();
        return () => stopWatching();
    }, []);

    if (error) return <Text>Error: {error}</Text>;
    if (!location) return <Text>Waiting for location...</Text>;

    return (
        <View>
            <Text>Current Position:</Text>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Text>Heading: {location.heading}°</Text>
            <Text>Speed: {location.speed} m/s</Text>

            <Button
                title={isWatching ? "Stop Watching" : "Start Watching"}
                onPress={isWatching ? stopWatching : startWatching}
            />
        </View>
    );
};
*/

// ============================================
// EXAMPLE 4: Direct Usage (without hooks)
// ============================================

/*
import { getCurrentLocation, requestLocationPermission } from './utils/getLocation';

const handleGetLocation = async () => {
    try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.log('Permission denied');
            return;
        }

        const location = await getCurrentLocation();
        console.log('Current location:', location);
        
        // Use the location data
        fetchPrayerTimes(location.latitude, location.longitude);
    } catch (error) {
        console.error('Location error:', error);
    }
};
*/
