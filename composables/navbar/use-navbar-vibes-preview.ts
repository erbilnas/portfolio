import type {
  GameDetails,
  GoodreadsBook,
  MusicPlayer,
  TraktWatchedDetail,
} from "~/types/current-vibes";

export type NavbarVibesKind = "music" | "game" | "trakt" | "reading";

export interface NavbarVibesPreview {
  kind: NavbarVibesKind;
  category: string;
  title: string;
  image?: string;
  isLive: boolean;
}

export const useNavbarVibesPreview = () => {
  const { t } = useI18n();

  const { data: musicData } = useFetch<MusicPlayer>("/api/music");
  const { data: gameData } = useFetch<
    GameDetails | { status: number; message: string }
  >("/api/video-games");
  const { data: readingData } = useFetch<
    GoodreadsBook | { status: number; message: string } | null
  >("/api/goodreads");
  const { data: traktData } = useFetch<TraktWatchedDetail | null>(
    "/api/trakt/history",
  );

  const preview = computed<NavbarVibesPreview | null>(() => {
    const player = musicData.value?.player;
    if (player?.name && player?.artist && player.is_playing) {
      return {
        kind: "music",
        category: t("currentVibes.cards.music.listeningTo"),
        title: `${player.name} · ${player.artist}`,
        image: player.album?.image || undefined,
        isLive: true,
      };
    }

    const games =
      gameData.value && !("status" in gameData.value)
        ? (gameData.value as GameDetails)
        : null;
    if (games?.playing?.title) {
      return {
        kind: "game",
        category: t("currentVibes.cards.game.currentlyPlaying"),
        title: games.playing.title,
        image: games.playing.image || undefined,
        isLive: true,
      };
    }

    const reading =
      readingData.value &&
      typeof readingData.value === "object" &&
      "title" in readingData.value &&
      !("message" in readingData.value)
        ? (readingData.value as GoodreadsBook)
        : null;
    if (reading?.status === "reading" && reading.title) {
      return {
        kind: "reading",
        category: t("currentVibes.cards.reading.currentlyReading"),
        title: reading.author
          ? `${reading.title} · ${reading.author}`
          : reading.title,
        image: reading.image || undefined,
        isLive: false,
      };
    }

    if (traktData.value?.title) {
      return {
        kind: "trakt",
        category: t("currentVibes.cards.trakt.lastWatched"),
        title: traktData.value.title,
        image: traktData.value.image || undefined,
        isLive: false,
      };
    }

    if (player?.name && player?.artist) {
      return {
        kind: "music",
        category: t("currentVibes.cards.music.lastPlayed"),
        title: `${player.name} · ${player.artist}`,
        image: player.album?.image || undefined,
        isLive: false,
      };
    }

    if (games?.last_completed?.title) {
      return {
        kind: "game",
        category: t("currentVibes.cards.game.recentlyCompleted"),
        title: games.last_completed.title,
        image: games.last_completed.image || undefined,
        isLive: false,
      };
    }

    return null;
  });

  return { preview };
};
