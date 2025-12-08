export const AVAILABLE_QARIS = [
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit', bitrate: '64' },
  { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar', bitrate: '64' },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdurrahmaan As-Sudais',
    bitrate: '64',
  },
  { id: 'ar.abdulsamad', name: 'Abdul Samad', bitrate: '64' },
  { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree', bitrate: '64' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy', bitrate: '128' },
  { id: 'ar.alafasy', name: 'Alafasy', bitrate: '128' },
  { id: 'ar.hanirifai', name: 'Hani Rifai', bitrate: '64' },
  { id: 'ar.husary', name: 'Husary', bitrate: '64' },
  { id: 'ar.husarymujawwad', name: 'Husary (Mujawwad)', bitrate: '64' },
  { id: 'ar.hudhaify', name: 'Hudhaify', bitrate: '64' },
  { id: 'ar.ibrahimakhbar', name: 'Ibrahim Akhdar', bitrate: '64' },
  { id: 'ar.mahermuaiqly', name: 'Maher Al Muaiqly', bitrate: '64' },
  { id: 'ar.minshawi', name: 'Minshawi', bitrate: '64' },
  { id: 'ar.minshawimujawwad', name: 'Minshawy (Mujawwad)', bitrate: '64' },
  { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyoub', bitrate: '64' },
  { id: 'ar.muhammadjibreel', name: 'Muhammad Jibreel', bitrate: '64' },
  {
    id: 'ar.saoodshuraym',
    name: 'Saood bin Ibraaheem Ash-Shuraym',
    bitrate: '64',
  },
  { id: 'en.walk', name: 'Ibrahim Walk', bitrate: '64' },
  {
    id: 'fa.hedayatfarfooladvand',
    name: 'Fooladvand - Hedayatfar',
    bitrate: '64',
  },
  { id: 'ar.parhizgar', name: 'Parhizgar', bitrate: '64' },
  { id: 'ur.khan', name: 'Shamshad Ali Khan', bitrate: '64' },
  { id: 'zh.chinese', name: 'Chinese', bitrate: '64' },
  { id: 'fr.leclerc', name: 'Youssouf Leclerc', bitrate: '64' },
  { id: 'ar.aymanswoaid', name: 'Ayman Sowaid', bitrate: '64' },
  { id: 'ru.kuliev-audio', name: 'Elmir Kuliev by 1MuslimApp', bitrate: '64' },
  {
    id: 'ru.kuliev-audio-2',
    name: 'Elmir Kuliev 2 by 1MuslimApp',
    bitrate: '64',
  },
];

export const getAyahAudioUrl = (
  ayahGlobalNumber: number,
  qariId: string = 'ar.alafasy',
): string => {
  const qari = AVAILABLE_QARIS.find(q => q.id === qariId);
  const quality = qari?.bitrate || '64';
  return `https://cdn.islamic.network/quran/audio/${quality}/${qariId}/${ayahGlobalNumber}.mp3`;
};
