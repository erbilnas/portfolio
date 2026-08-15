import { listApproved, readAllEntries } from "../utils/guestbook";

export default defineEventHandler(async () => {
  const entries = await readAllEntries();
  return { entries: listApproved(entries) };
});
