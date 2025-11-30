export type NavbarSection =
  | "welcome"
  | "about-me"
  | "skills"
  | "experience"
  | "projects"
  | "current-vibes";

export interface NavigationItem {
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

