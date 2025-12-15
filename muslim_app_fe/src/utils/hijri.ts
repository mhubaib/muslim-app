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
  month: number;
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

  let iYear = 10631.0 / 30.0;
  let epochAstro = 1948084;

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
    month: im - 1,
    year: iy,
  };
}

export function getIslamicMonthName(monthIndex: number): string {
  return islamicMonths[monthIndex] || '';
}