/**
 * Parse a date string in format "Month YYYY" (e.g., "July 2021", "October 2019")
 */
export function parseDate(dateStr: string): Date | null {
  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const parts = dateStr.split(" ");
  if (parts.length !== 2) return null;

  const monthName = parts[0].toLowerCase();
  const year = parseInt(parts[1], 10);

  if (!months[monthName] && months[monthName] !== 0) return null;
  if (isNaN(year)) return null;

  return new Date(year, months[monthName], 1);
}

/**
 * Parse a year string in format "YYYY - Present" or "YYYY - YYYY"
 */
export function parseYear(yearStr: string): Date | null {
  const parts = yearStr.split(" - ");
  if (parts.length !== 2) return null;

  const startYear = parseInt(parts[0].trim(), 10);
  if (isNaN(startYear)) return null;

  return new Date(startYear, 0, 1);
}

