// We use the native Intl API to handle Persian dates without heavy libraries.

const faFormatter = new Intl.DateTimeFormat('fa-IR', {
  calendar: 'persian',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const faMonthFormatter = new Intl.DateTimeFormat('fa-IR', {
  calendar: 'persian',
  month: 'long',
});

const faYearFormatter = new Intl.DateTimeFormat('fa-IR', {
  calendar: 'persian',
  year: 'numeric',
});

export const toPersianDigits = (str: string | number): string => {
  return str.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

export const getJalaliDateParts = (date: Date) => {
  // Format: 1402/05/20 (example)
  const parts = faFormatter.formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value || '';
  const month = parts.find((p) => p.type === 'month')?.value || '';
  const day = parts.find((p) => p.type === 'day')?.value || '';
  return { year, month, day };
};

export const getJalaliMonthName = (date: Date) => {
  return faMonthFormatter.format(date);
};

export const getJalaliYear = (date: Date) => {
  return faYearFormatter.format(date);
};

// Helper to get ISO string key (YYYY-MM-DD)
export const getDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isSameDay = (d1: Date, d2: Date) => {
  return getDateKey(d1) === getDateKey(d2);
};

// Get the start and end Gregorian dates for the Persian Month of the given date
// Since we don't have a math library, we iterate. Safe because months are max 31 days.
export const getPersianMonthRange = (currentDate: Date) => {
  const targetParts = getJalaliDateParts(currentDate);
  const currentMonthVal = targetParts.month;

  // Find Start
  let startDate = new Date(currentDate);
  // Walk back max 31 days
  for (let i = 0; i < 32; i++) {
    const prevDate = new Date(startDate);
    prevDate.setDate(prevDate.getDate() - 1);
    const parts = getJalaliDateParts(prevDate);
    if (parts.month !== currentMonthVal) {
      break;
    }
    startDate = prevDate;
  }

  // Find End
  let endDate = new Date(currentDate);
  for (let i = 0; i < 32; i++) {
    const nextDate = new Date(endDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const parts = getJalaliDateParts(nextDate);
    if (parts.month !== currentMonthVal) {
      break;
    }
    endDate = nextDate;
  }

  return { startDate, endDate };
};

export const getWeekDays = (currentDate: Date) => {
  // Start from Saturday (Persian week start)
  const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat
  // Calculate diff to get to Saturday.
  // Sat=6 (0 diff), Sun=0 (1 diff), Mon=1 (2 diff)... Fri=5 (6 diff)
  const diffToSat = (dayOfWeek + 1) % 7;
  
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - diffToSat);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    week.push(d);
  }
  return week;
};
