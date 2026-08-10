export type TravelPlace = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
  /** When true, listed under Highlighted stops in Travel. */
  highlighted?: boolean;
};

export type TravelPlaceGroup = {
  country: string;
  places: TravelPlace[];
};

function isTravelPlace(value: unknown): value is TravelPlace {
  if (!value || typeof value !== "object") {
    return false;
  }
  const entry = value as Record<string, unknown>;
  const hasCore =
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.name === "string" &&
    entry.name.length > 0 &&
    typeof entry.lat === "number" &&
    Number.isFinite(entry.lat) &&
    typeof entry.lng === "number" &&
    Number.isFinite(entry.lng);

  if (!hasCore) {
    return false;
  }

  if (
    entry.country !== undefined &&
    (typeof entry.country !== "string" || !entry.country.trim())
  ) {
    return false;
  }

  if (
    entry.highlighted !== undefined &&
    typeof entry.highlighted !== "boolean"
  ) {
    return false;
  }

  return true;
}

/** Parse TRAVEL_PLACES env JSON. Invalid / missing → []. */
export function parseTravelPlaces(raw: string | undefined): TravelPlace[] {
  if (!raw?.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isTravelPlace).map((place) => ({
      id: place.id,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      country: place.country?.trim() || undefined,
      highlighted: place.highlighted === true,
    }));
  } catch {
    return [];
  }
}

/** Group places by country (unsorted countries → count desc, then name). */
export function groupTravelPlacesByCountry(
  places: TravelPlace[],
  fallbackCountry: string,
): TravelPlaceGroup[] {
  const byCountry = new Map<string, TravelPlace[]>();

  for (const place of places) {
    const country = place.country || fallbackCountry;
    const list = byCountry.get(country);
    if (list) {
      list.push(place);
    } else {
      byCountry.set(country, [place]);
    }
  }

  return [...byCountry.entries()]
    .map(([country, grouped]) => ({
      country,
      places: [...grouped].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => {
      const byCount = b.places.length - a.places.length;
      if (byCount !== 0) {
        return byCount;
      }
      return a.country.localeCompare(b.country);
    });
}
