import {
  adminCallbackUrl,
  consumeOAuthState,
  requireAdminConfigured,
  setAdminSession,
} from "../../../utils/admin-session";

export default defineEventHandler(async (event) => {
  const runtime = requireAdminConfigured(event);
  const query = getQuery(event);
  const code = typeof query.code === "string" ? query.code : "";
  const state = typeof query.state === "string" ? query.state : "";

  if (!code || !consumeOAuthState(event, state)) {
    return sendRedirect(event, "/admin/login?error=state");
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: runtime.clientId,
      client_secret: runtime.clientSecret,
      code,
      redirect_uri: adminCallbackUrl(event),
    }),
  });

  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };
  if (!tokenJson.access_token) {
    return sendRedirect(event, "/admin/login?error=oauth");
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenJson.access_token}`,
      "User-Agent": "erbilnas-com-admin",
    },
  });
  const user = (await userRes.json()) as { login?: string };
  const login = String(user.login || "").toLowerCase();

  if (!login || login !== runtime.allowedLogin) {
    return sendRedirect(event, "/admin/login?error=forbidden");
  }

  setAdminSession(event, login);
  return sendRedirect(event, "/admin");
});
