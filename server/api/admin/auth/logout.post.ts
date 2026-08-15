import { clearAdminSession } from "../../../utils/admin-session";

export default defineEventHandler(async (event) => {
  clearAdminSession(event);
  return { status: "ok" };
});
