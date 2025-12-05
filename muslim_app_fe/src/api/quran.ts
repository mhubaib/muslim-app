import { AxiosError } from 'axios';
import { Surah, QuranApiResponse, Ayah } from '../types/Quran';
import { axiosInstance } from './axiosInstance';

export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await axiosInstance.get<QuranApiResponse<Surah[]>>('/quran/surah');
    return response.data.data as Surah[];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw new Error(error instanceof AxiosError ? error.response?.data.message : 'Failed to fetch all surahs');
  }
};

export const getSurahById = async (id: number): Promise<Ayah[]> => {
  try {
    const response = await axiosInstance.get<QuranApiResponse<Ayah[]>>(`/quran/surah/${id}`);
    return response.data.data as Ayah[];
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw new Error(error instanceof AxiosError ? error.response?.data.message : 'Failed to fetch surah');
  }
};
