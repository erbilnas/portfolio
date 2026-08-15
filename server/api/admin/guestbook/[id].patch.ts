import { moderateEntry } from "../../../utils/guestbook";
import { requireAdmin } from "../../../utils/admin-session";

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const id = getRouterParam(event, "id") || "";
  const body = await readBody<{ action?: unknown }>(event);
  const action = body?.action;
  if (!id || (action !== "approve" && action !== "reject")) {
    throw createError({ statusCode: 400, statusMessage: "Invalid" });
  }
  const ok = await moderateEntry(id, action);
  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }
  return { status: "ok" };
});
