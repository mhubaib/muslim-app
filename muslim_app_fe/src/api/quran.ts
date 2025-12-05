import { AxiosError } from 'axios';
import { Surah, QuranApiResponse } from '../types/Quran';
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

export const getSurahById = async (id: number): Promise<Surah> => {
  try {
    const response = await axiosInstance.get<QuranApiResponse<Surah>>(`/quran/surah/${id}`);
    return response.data.data as Surah;
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw new Error(error instanceof AxiosError ? error.response?.data.message : 'Failed to fetch surah');
  }
};
