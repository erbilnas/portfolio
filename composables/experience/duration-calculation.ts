import { parseDate } from "./date-parsing";

/**
 * Calculate the duration between two dates in a period string
 * Format: "Month YYYY - Month YYYY" or "Month YYYY - Present"
 */
export function calculateYears(period: string): string {
  const parts = period.split(" - ");
  if (parts.length !== 2) return "";

  const startStr = parts[0].trim();
  const endStr = parts[1].trim();

  // Parse start date
  const startDate = parseDate(startStr);
  if (!startDate) return "";

  // Parse end date
  let endDate: Date | null = null;
  if (endStr.toLowerCase() === "present") {
    endDate = new Date();
  } else {
    endDate = parseDate(endStr);
  }

  if (!endDate) return "";

  // Calculate difference in years
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  if (diffYears < 1) {
    const months = Math.round(diffYears * 12);
    return months === 1 ? "1 month" : `${months} months`;
  }

  const years = Math.floor(diffYears);
  const remainingMonths = Math.round((diffYears - years) * 12);

  if (years === 0) {
    return remainingMonths === 1 ? "1 month" : `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  }

  return `${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${
    remainingMonths === 1 ? "month" : "months"
  }`;
}

/**
 * Calculate the duration from a year string
 * Format: "YYYY - Present" or "YYYY - YYYY"
 */
export function calculateYearsFromYear(yearStr: string): string {
  const parts = yearStr.split(" - ");
  if (parts.length !== 2) return "";

  const startYear = parseInt(parts[0].trim(), 10);
  const endStr = parts[1].trim();

  if (isNaN(startYear)) return "";

  let endYear: number;
  if (endStr.toLowerCase() === "present") {
    endYear = new Date().getFullYear();
  } else {
    endYear = parseInt(endStr, 10);
    if (isNaN(endYear)) return "";
  }

  const diffYears = endYear - startYear + 1;

  if (diffYears === 1) {
    return "1 year";
  }

  return `${diffYears} years`;
}

