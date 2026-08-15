export type NavbarSection =
  | "welcome"
  | "about-me"
  | "skills"
  | "experience"
  | "projects"
  | "current-vibes"
  | "guestbook";

export interface NavigationItem {
  id?: string;
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

