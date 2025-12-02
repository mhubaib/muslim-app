// Navigation types for the app

export type RootStackParamList = {
    Onboarding: undefined;
    MainTabs: undefined;
    QuranDetail: {
        surahId: number;
        surahName: string;
    };
    Settings: undefined;
};

export type MainTabParamList = {
    PrayerTime: undefined;
    QiblaCompass: undefined;
    Calendar: undefined;
    Quran: undefined;
};
