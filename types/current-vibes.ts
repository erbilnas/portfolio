export interface MediumPost {
  title: string;
  link: string;
  published_at: string;
  description: string;
}

export interface SingleGameDetail {
  image: string;
  title: string;
  platform: string;
  progress: string;
  description: string;
  storefront: string;
  completion_time: number;
  status: "playing" | "completed";
}

export interface GameDetails {
  playing: SingleGameDetail | null;
  last_completed: SingleGameDetail | null;
}

export interface Album {
  name: string;
  image: string;
}

export interface MusicPlayerData {
  album: Album;
  artist: string;
  name: string;
  is_playing: boolean;
}

export interface MusicPlayer {
  player: MusicPlayerData;
}

export interface GitHubStats {
  username: string;
  publicRepos: number;
  totalContributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
}
