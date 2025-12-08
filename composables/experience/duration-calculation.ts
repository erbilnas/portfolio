import { parseDate } from "./date-parsing";

/**
 * Composable for calculating duration between two dates in a period string
 * Format: "Month YYYY - Month YYYY" or "Month YYYY - Present"
 */
export function useCalculateYears() {
  const { t } = useI18n();

  return (period: string): string => {
    const parts = period.split(" - ");
    if (parts.length !== 2) return "";

    const startStr = parts[0].trim();
    const endStr = parts[1].trim();

    // Parse start date
    const startDate = parseDate(startStr);
    if (!startDate) return "";

    // Parse end date
    let endDate: Date | null = null;
    const presentText = t("experience.duration.present").toLowerCase();
    if (
      endStr.toLowerCase() === "present" ||
      endStr.toLowerCase() === presentText
    ) {
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
      return months === 1
        ? `1 ${t("experience.duration.month")}`
        : `${months} ${t("experience.duration.months")}`;
    }

    const years = Math.floor(diffYears);
    const remainingMonths = Math.round((diffYears - years) * 12);

    if (years === 0) {
      return remainingMonths === 1
        ? `1 ${t("experience.duration.month")}`
        : `${remainingMonths} ${t("experience.duration.months")}`;
    }

    if (remainingMonths === 0) {
      return years === 1
        ? `1 ${t("experience.duration.year")}`
        : `${years} ${t("experience.duration.years")}`;
    }

    return `${years} ${
      years === 1
        ? t("experience.duration.year")
        : t("experience.duration.years")
    } ${remainingMonths} ${
      remainingMonths === 1
        ? t("experience.duration.month")
        : t("experience.duration.months")
    }`;
  };
}

/**
 * Composable for calculating the duration from a year string
 * Format: "YYYY - Present" or "YYYY - YYYY"
 */
export function useCalculateYearsFromYear() {
  const { t } = useI18n();

  return (yearStr: string): string => {
    const parts = yearStr.split(" - ");
    if (parts.length !== 2) return "";

    const startYear = parseInt(parts[0].trim(), 10);
    const endStr = parts[1].trim();

    if (isNaN(startYear)) return "";

    let endYear: number;
    const presentText = t("experience.duration.present").toLowerCase();
    if (
      endStr.toLowerCase() === "present" ||
      endStr.toLowerCase() === presentText
    ) {
      endYear = new Date().getFullYear();
    } else {
      endYear = parseInt(endStr, 10);
      if (isNaN(endYear)) return "";
    }

    const diffYears = endYear - startYear + 1;

    if (diffYears === 1) {
      return `1 ${t("experience.duration.year")}`;
    }

    return `${diffYears} ${t("experience.duration.years")}`;
  };
}
