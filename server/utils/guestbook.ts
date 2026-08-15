import {
  NAME_MAX,
  NOTE_MAX,
  RATE_WINDOW_MS,
  createRateLimiter,
  isHoneypotFilled,
  sanitizeField,
} from "./guestbook-sanitize.mjs";

export type GuestbookStatus = "pending" | "approved" | "rejected";

export interface GuestbookEntry {
  id: string;
  name: string;
  note: string;
  createdAt: string;
  status: GuestbookStatus;
}

const ENTRIES_KEY = "entries";
const APPROVED_CAP = 40;

const limiter = createRateLimiter(RATE_WINDOW_MS);

const storage = () => useStorage("guestbook");

export async function readAllEntries(): Promise<GuestbookEntry[]> {
  const items = await storage().getItem<GuestbookEntry[]>(ENTRIES_KEY);
  return Array.isArray(items) ? items : [];
}

async function writeAllEntries(entries: GuestbookEntry[]) {
  await storage().setItem(ENTRIES_KEY, entries);
}

export function listApproved(entries: GuestbookEntry[]) {
  return entries
    .filter((entry) => entry.status === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, APPROVED_CAP)
    .map(({ id, name, note, createdAt }) => ({ id, name, note, createdAt }));
}

export function parseSignBody(body: {
  name?: unknown;
  note?: unknown;
  website?: unknown;
}) {
  if (isHoneypotFilled(body.website)) {
    return { honeypot: true as const };
  }
  const name = sanitizeField(body.name, NAME_MAX);
  const note = sanitizeField(body.note, NOTE_MAX);
  if (!name || !note) {
    return { invalid: true as const };
  }
  return { name, note };
}

export function allowSign(ip: string) {
  return limiter.allow(ip || "unknown");
}

export async function addPending(name: string, note: string) {
  const entries = await readAllEntries();
  const entry: GuestbookEntry = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    note,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  entries.push(entry);
  await writeAllEntries(entries);
  return entry.id;
}

export async function moderateEntry(
  id: string,
  action: "approve" | "reject",
): Promise<boolean> {
  const entries = await readAllEntries();
  const target = entries.find((entry) => entry.id === id);
  if (!target) {
    return false;
  }
  target.status = action === "approve" ? "approved" : "rejected";
  await writeAllEntries(entries);
  return true;
}

export async function deleteEntry(id: string): Promise<boolean> {
  const entries = await readAllEntries();
  const next = entries.filter((entry) => entry.id !== id);
  if (next.length === entries.length) {
    return false;
  }
  await writeAllEntries(next);
  return true;
}
