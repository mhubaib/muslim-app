export interface Surah {
  id: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs?: number;
}

// export interface Ayah {
//   number: number;
//   text: string;
//   transliteration: string;
//   translation: {
//     id: string;
//   };
// }

export interface QuranApiResponse {
  success: boolean;
  data: Surah | Surah[];
}
