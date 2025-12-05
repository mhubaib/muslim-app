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
  number: number;
  textArabic: string;
  numberInSurah: number;
  juz: number;
  page?: number;
  textLatin?: string | null;
  textTranslation?: string | null;
}

export interface QuranApiResponse<T> {
  success: boolean;
  data: T;
}
