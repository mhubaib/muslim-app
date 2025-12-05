export const getAyahAudioUrl = (
  ayahGlobalNumber: number,
  qari: string = 'ar.alafasy',
  quality: '64' | '128' = '128',
): string => {
  return `https://cdn.islamic.network/quran/audio/${quality}/${qari}/${ayahGlobalNumber}.mp3`;
};

export const AVAILABLE_QARIS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit' },
  { id: 'ar.saadalghamidi', name: 'Saad Al-Ghamdi' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Hussary' },
  { id: 'ar.ahmedajamy', name: 'Ahmed Al-Ajamy' },
];
