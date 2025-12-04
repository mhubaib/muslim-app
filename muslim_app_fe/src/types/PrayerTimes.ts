export interface ResponseApi<T> {
    success: boolean;
    message: string;
    data: T;
    error: string;
}

export interface PrayerTimes {
    date: string;
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
}


export interface PrayerNotificationSettings {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
}

export interface PrayerCardProps {
    name: string;
    time: string;
    icon: string;
    isNext: boolean;
    notificationEnabled: boolean;
    onToggleNotification: () => void;
}

