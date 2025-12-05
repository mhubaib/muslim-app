export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTransliteration: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  ayahs: Ayah[];
}

export interface Ayah {
  id: number;
  textArabic: string;
  numberInSurah: number;
  juz: number;
  page?: number;
  textLatin?: string | null;
  textTranslation?: string | null;
  audioUrl?: string;
}

export interface QuranApiResponse<T> {
  success: boolean;
  data: T;
}
