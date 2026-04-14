export type NavbarSection =
  | "welcome"
  | "about-me"
  | "sponsored-by-me"
  | "skills"
  | "experience"
  | "projects"
  | "current-vibes";

export interface NavigationItem {
  id?: string;
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

