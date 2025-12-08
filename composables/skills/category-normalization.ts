/**
 * Normalizes category names for display in tabs
 * Handles both English and Turkish translations
 */
export const normalizeCategoryName = (categoryName: string): string => {
  const mapping: Record<string, string> = {
    // English
    Favorites: "Favorites",
    "Frontend Development": "Frontend",
    "Backend Development": "Backend",
    DevOps: "DevOps",
    AI: "AI",
    Design: "Design",
    Languages: "Language",
    // Turkish
    Favoriler: "Favoriler",
    "Frontend Geliştirme": "Frontend",
    "Backend Geliştirme": "Backend",
    "Yapay Zeka": "Yapay Zeka",
    Tasarım: "Tasarım",
    Diller: "Dil",
  };
  return mapping[categoryName] || categoryName;
};

