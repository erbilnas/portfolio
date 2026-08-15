import { listAdminMissing } from "../../../utils/admin-session";

export default defineEventHandler((event) => {
  const missing = listAdminMissing(event);
  return { configured: missing.length === 0, missing };
});
