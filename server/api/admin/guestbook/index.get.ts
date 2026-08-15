import { readAllEntries } from "../../../utils/guestbook";
import { requireAdmin } from "../../../utils/admin-session";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const entries = await readAllEntries();
  const rank: Record<string, number> = {
    pending: 0,
    approved: 1,
    rejected: 2,
  };
  return {
    entries: [...entries].sort((a, b) => {
      const byStatus = (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
      if (byStatus !== 0) {
        return byStatus;
      }
      return b.createdAt.localeCompare(a.createdAt);
    }),
  };
});
