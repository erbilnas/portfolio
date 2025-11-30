/**
 * Normalizes category names for display in tabs
 */
export const normalizeCategoryName = (categoryName: string): string => {
  const mapping: Record<string, string> = {
    Favorites: "Favorites",
    "Frontend Development": "Frontend",
    "Backend Development": "Backend",
    DevOps: "DevOps",
    AI: "AI",
    Design: "Design",
    Languages: "Language",
  };
  return mapping[categoryName] || categoryName;
};

