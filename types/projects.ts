export interface Project {
  key: string;
  name: string;
  description: string;
  github?: string;
  visit?: string;
  /** Glaze Store listing URL — shown with brand icon like GitHub */
  glaze?: string;
}
