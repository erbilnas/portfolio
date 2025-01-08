import type { Component } from "vue";

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
  status: "playing" | "completed";
}

export interface GameDetails {
  playing: SingleGameDetail;
  last_completed: SingleGameDetail;
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

export type CardType = "game" | "music" | "blog" | "map" | "error";

export interface CardProps {
  game?: SingleGameDetail;
  player?: MusicPlayerData;
  post?: MediumPost;
  map?: unknown;
  isActive?: boolean;
}

export interface Card {
  type: CardType;
  data?: SingleGameDetail | MusicPlayerData | MediumPost;
  component: Component;
}
