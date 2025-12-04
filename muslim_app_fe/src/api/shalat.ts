import { AxiosError } from 'axios';
import { PrayerTimes, ResponseApi } from '../types/PrayerTimes';
import { axiosInstance } from './axiosInstance';

export const getTodayPrayerTimes = async ({ lat, lon }: { lat: number, lon: number }) => {
    try {
        const prayerTimes = await axiosInstance.get<ResponseApi<PrayerTimes>>('/prayer/today', {
            params: {
                lat,
                lon
            }
        })

        if (!prayerTimes.data.success) {
            throw new Error(prayerTimes.data.error)
        }

        return prayerTimes.data.data
    } catch (error) {
        console.error(error)
        throw new Error(error instanceof AxiosError ? error.response?.data : 'Error ambil data waktu sholat')
    }
}