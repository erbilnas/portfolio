import {
  adminCallbackUrl,
  createOAuthState,
  requireAdminConfigured,
  setOAuthStateCookie,
} from "../../../utils/admin-session";

export default defineEventHandler((event) => {
  const runtime = requireAdminConfigured(event);
  const state = createOAuthState();
  setOAuthStateCookie(event, state);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", runtime.clientId);
  url.searchParams.set("redirect_uri", adminCallbackUrl(event));
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);

  return sendRedirect(event, url.toString());
});
