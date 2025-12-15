export const islamicMonths = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  'Syaban',
  'Ramadan',
  'Syawal',
  'Dzulqaidah',
  'Dzulhijjah',
];

export interface HijriDate {
  day: number;
  month: number; // 0-indexed (0 = Muharram)
  year: number;
}

// Kuwaiti algorithm for Gregorian to Hijri conversion
export function toHijri(date: Date): HijriDate {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);

  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524;

  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  // w day is (jd + 1) % 7. 0=Sun, 1=Mon, etc. Unused in strict date conversion.
  // let wd = (jd + 1) % 7;

  let iYear = 10631.0 / 30.0;
  let epochAstro = 1948084;
  // let epochCivil = 1948085; // Unused

  let shift1 = 8.01 / 60.0;

  let z = jd - epochAstro;
  let cyc = Math.floor(z / 10631.0);
  z = z - 10631 * cyc;
  let j = Math.floor((z - shift1) / iYear);
  let iy = 30 * cyc + j;
  z = z - Math.floor(j * iYear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) im = 12;
  let id = z - Math.floor(29.5001 * im - 29);

  return {
    day: id,
    month: im - 1, // Adjust to 0-indexed
    year: iy,
  };
}

export function getIslamicMonthName(monthIndex: number): string {
  return islamicMonths[monthIndex] || '';
}

export const islamicEvents: {
  month: number;
  day: number;
  title: string;
  description: string;
}[] = [
  {
    month: 0,
    day: 1,
    title: 'Tahun Baru Islam',
    description: 'Awal tahun baru Hijriyah',
  },
  {
    month: 0,
    day: 10,
    title: 'Hari Asyura',
    description: 'Puasa sunnah Asyura',
  },
  {
    month: 2,
    day: 12,
    title: 'Maulid Nabi Muhammad SAW',
    description: 'Hari kelahiran Nabi Muhammad SAW',
  },
  {
    month: 6,
    day: 27,
    title: "Isra Mi'raj",
    description:
      'Perjalanan Nabi dari Masjidil Haram ke Masjidil Aqsa lalu ke Sidratul Muntaha',
  },
  {
    month: 8,
    day: 1,
    title: 'Awal Puasa Ramadan',
    description: 'Permulaan ibadah puasa wajib',
  },
  {
    month: 8,
    day: 17,
    title: 'Nuzulul Quran',
    description: 'Turunnya Al-Quran',
  },
  {
    month: 9,
    day: 1,
    title: 'Idul Fitri',
    description: 'Hari Raya Idul Fitri',
  },
  {
    month: 11,
    day: 9,
    title: 'Hari Arafah',
    description:
      'Puncak ibadah haji, disunnahkan puasa bagi yang tidak berhaji',
  },
  { month: 11, day: 10, title: 'Idul Adha', description: 'Hari Raya Kurban' },
];

export function getEventsForHijriDate(hijri: HijriDate) {
  return islamicEvents.filter(
    e => e.month === hijri.month && e.day === hijri.day,
  );
}

export function getUpcomingEvents(currentHijri: HijriDate, limit: number = 5) {
  // Sort events by month and day
  const sortedEvents = [...islamicEvents].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });

  const nextEvents = [];

  // Find events in currrent year after current date
  for (const event of sortedEvents) {
    if (
      event.month > currentHijri.month ||
      (event.month === currentHijri.month && event.day >= currentHijri.day)
    ) {
      nextEvents.push({ ...event, year: currentHijri.year });
    }
  }

  // Find events in next year
  if (nextEvents.length < limit) {
    for (const event of sortedEvents) {
      nextEvents.push({ ...event, year: currentHijri.year + 1 });
      if (nextEvents.length >= limit) break;
    }
  }

  return nextEvents.slice(0, limit);
}
