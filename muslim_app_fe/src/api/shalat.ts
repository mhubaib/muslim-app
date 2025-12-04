import axios, { AxiosError } from 'axios';
import { PrayerTimes, ResponseApi } from '../types/PrayerTimes';

const API_KEY = 'muslim_app_api_key_e296eee60d7435cc4ac7dbd5f4cc33a6293bea8853ad37b82536e05e59dd738c'

const BASE_URL = 'http://172.20.0.106:3000/'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }
})

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