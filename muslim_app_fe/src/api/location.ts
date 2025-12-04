import { AxiosError } from 'axios';
import { axiosInstance } from './axiosInstance';
import { ResponseApi } from '../types/PrayerTimes';

export type LocationResponse = {
  lat: number;
  lon: number;
  address: string;
  city: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  postalCode: string | null;
  displayName: string;
};

export type Cordinates = {
  lat: number;
  lon: number;
};

export const getLocationName = async (cordinates: Cordinates) => {
  try {
    const location = await axiosInstance.get<ResponseApi<LocationResponse>>('/location/reverse', {
      params: {
        lat: cordinates.lat,
        lon: cordinates.lon,
      },
    });
    return location.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof AxiosError
        ? error.response?.data
        : 'Error ambil data lokasi',
    );
  }
};
