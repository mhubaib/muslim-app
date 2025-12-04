import prisma from '../../config/database.js';
import { httpGet } from '../../utils/http.js';

interface QuranApiSurah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs?: QuranApiAyah[];
}

interface QuranApiAyah {
  number: number;
  text: string;
  numberInSurah: number;
}

interface QuranApiResponse {
  data: QuranApiSurah;
}

interface QuranApiAllSurahsResponse {
  data: QuranApiSurah[];
}

export class QuranService {
  private readonly QURAN_API_BASE = 'https://api.alquran.cloud/v1';

  async initializeQuranCache() {
    try {
      const surahCount = await prisma.surah.count();

      if (surahCount === 114) {
        console.log('Quran cache already initialized');
        return;
      }

      console.log('Initializing Quran cache...');

      // Fetch all surahs with their ayahs
      for (let i = 1; i <= 114; i++) {
        const response = await httpGet<QuranApiResponse>(`${this.QURAN_API_BASE}/surah/${i}`);

        const surahData = response.data;

        // Create or update surah
        await prisma.surah.upsert({
          where: { id: surahData.number },
          update: {},
          create: {
            id: surahData.number,
            name: surahData.name,
            englishName: surahData.englishName,
            numberOfAyahs: surahData.numberOfAyahs,
            revelationType: surahData.revelationType,
          },
        });

        // Create ayahs
        if (surahData.ayahs) {
          for (const ayah of surahData.ayahs) {
            await prisma.ayah.upsert({
              where: {
                id: ayah.number,
              },
              update: {},
              create: {
                ayahNumber: ayah.numberInSurah,
                surahId: surahData.number,
                textArabic: ayah.text,
                textLatin: null,
                textTranslation: null,
              },
            });
          }
        }

        console.log(`Cached Surah ${i}/114: ${surahData.englishName}`);
      }

      console.log('Quran cache initialization completed!');
    } catch (error) {
      console.error('Error initializing Quran cache:', error);
      throw error;
    }
  }

  async getAllSurahs() {
    try {
      const surahs = await prisma.surah.findMany({
        orderBy: { id: 'asc' },
      });
      return surahs;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  }

  async getSurahById(id: number) {
    try {
      const surah = await prisma.surah.findUnique({
        where: { id },
        include: {
          ayahs: {
            orderBy: { ayahNumber: 'asc' },
          },
        },
      });

      if (!surah) {
        throw new Error('Surah not found');
      }

      return surah;
    } catch (error) {
      console.error('Error fetching surah:', error);
      throw error;
    }
  }

  async getAyah(surahId: number, ayahNumber: number) {
    try {
      const ayah = await prisma.ayah.findFirst({
        where: {
          surahId,
          ayahNumber,
        },
        include: {
          surah: true,
        },
      });

      if (!ayah) {
        throw new Error('Ayah not found');
      }

      return ayah;
    } catch (error) {
      console.error('Error fetching ayah:', error);
      throw error;
    }
  }
}
