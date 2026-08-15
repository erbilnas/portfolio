import { deleteEntry } from "../../../utils/guestbook";
import { requireAdmin } from "../../../utils/admin-session";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const id = getRouterParam(event, "id") || "";
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid" });
  }
  const ok = await deleteEntry(id);
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }
  return { status: "ok" };
});
