export const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export function getMonthYearName(year: number, monthIndex: number): string {
  return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
}

export function isSameMonthYear(dateString: string, year: number, monthIndex: number): boolean {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;
    return d.getFullYear() === year && d.getMonth() === monthIndex;
  } catch {
    return false;
  }
}

export function formatDate(dateString: string): string {

  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const day = d.getDate();
    const month = MONTH_NAMES_ID[d.getMonth()].substring(0, 3);
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

export function formatDateFull(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTH_NAMES_ID[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

export function getCurrentMonthName(): string {
  const now = new Date();
  return `${MONTH_NAMES_ID[now.getMonth()]} ${now.getFullYear()}`;
}

export function isCurrentMonth(dateString: string): boolean {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return false;

    const now = new Date();
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  } catch {
    return false;
  }
}

export function parseYMD(ymdString: string): Date {
  if (!ymdString) return new Date();
  const parts = ymdString.split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    return new Date();
  }
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function formatYMD(dateObj: Date): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayYMD(): string {
  const now = new Date();
  return formatYMD(now);
}

