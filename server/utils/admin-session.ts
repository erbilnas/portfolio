import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { H3Event } from "h3";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_OAUTH_STATE_COOKIE = "admin_oauth_state";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const STATE_MS = 10 * 60 * 1000;

export interface AdminSession {
  login: string;
  exp: number;
}

function envTrim(value: unknown) {
  return String(value ?? "").trim();
}

export function getAdminRuntime(event?: H3Event) {
  const config = event ? useRuntimeConfig(event) : useRuntimeConfig();
  const fromEnv = (name: string, nested: unknown) =>
    envTrim(process.env[name]) || envTrim(nested);

  return {
    clientId: fromEnv("GITHUB_OAUTH_CLIENT_ID", config.admin?.githubClientId),
    clientSecret: fromEnv(
      "GITHUB_OAUTH_CLIENT_SECRET",
      config.admin?.githubClientSecret,
    ),
    sessionSecret: fromEnv("ADMIN_SESSION_SECRET", config.admin?.sessionSecret),
    allowedLogin: (
      fromEnv("ADMIN_GITHUB_LOGIN", config.admin?.allowedLogin) ||
      fromEnv("GITHUB_USERNAME", config.github?.username)
    ).toLowerCase(),
    siteUrl: envTrim(config.public.siteUrl).replace(/\/$/, ""),
  };
}

export function adminCallbackUrl(event?: H3Event) {
  if (event) {
    return `${getRequestURL(event).origin}/api/admin/auth/callback`;
  }
  return `${getAdminRuntime().siteUrl}/api/admin/auth/callback`;
}

function cookieSecure(event?: H3Event) {
  if (event) {
    return getRequestURL(event).protocol === "https:";
  }
  return getAdminRuntime().siteUrl.startsWith("https://");
}

function cookieBase(event?: H3Event) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: cookieSecure(event),
    path: "/",
  };
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signaturesMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function createOAuthState() {
  return randomBytes(16).toString("base64url");
}

export function setOAuthStateCookie(event: H3Event, state: string) {
  setCookie(event, ADMIN_OAUTH_STATE_COOKIE, state, {
    ...cookieBase(event),
    maxAge: STATE_MS / 1000,
  });
}

export function consumeOAuthState(event: H3Event, presented: string) {
  const stored = getCookie(event, ADMIN_OAUTH_STATE_COOKIE) || "";
  deleteCookie(event, ADMIN_OAUTH_STATE_COOKIE, { path: "/" });
  if (!stored || !presented || !signaturesMatch(stored, presented)) {
    return false;
  }
  return true;
}

export function encodeSession(login: string, secret: string) {
  const body = Buffer.from(
    JSON.stringify({
      login,
      exp: Date.now() + SESSION_MS,
    } satisfies AdminSession),
  ).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function decodeSession(
  token: string,
  secret: string,
): AdminSession | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) {
    return null;
  }
  const expected = sign(body, secret);
  if (!signaturesMatch(sig, expected)) {
    return null;
  }
  try {
    const data = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as AdminSession;
    if (!data.login || typeof data.exp !== "number" || data.exp < Date.now()) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setAdminSession(event: H3Event, login: string) {
  const { sessionSecret } = getAdminRuntime(event);
  setCookie(event, ADMIN_SESSION_COOKIE, encodeSession(login, sessionSecret), {
    ...cookieBase(event),
    maxAge: SESSION_MS / 1000,
  });
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, ADMIN_SESSION_COOKIE, { path: "/" });
}

export function getAdminSession(event: H3Event): AdminSession | null {
  const { sessionSecret } = getAdminRuntime(event);
  if (!sessionSecret) {
    return null;
  }
  const token = getCookie(event, ADMIN_SESSION_COOKIE);
  if (!token) {
    return null;
  }
  return decodeSession(token, sessionSecret);
}

export function requireAdmin(event: H3Event): AdminSession {
  const session = getAdminSession(event);
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  return session;
}

export function listAdminMissing(event?: H3Event) {
  const runtime = getAdminRuntime(event);
  const missing: string[] = [];
  if (!runtime.clientId) missing.push("GITHUB_OAUTH_CLIENT_ID");
  if (!runtime.clientSecret) missing.push("GITHUB_OAUTH_CLIENT_SECRET");
  if (!runtime.sessionSecret) missing.push("ADMIN_SESSION_SECRET");
  if (!runtime.allowedLogin) {
    missing.push("ADMIN_GITHUB_LOGIN or GITHUB_USERNAME");
  }
  return missing;
}

export function requireAdminConfigured(event?: H3Event) {
  const missing = listAdminMissing(event);
  if (missing.length) {
    throw createError({
      statusCode: 503,
      statusMessage: "Admin OAuth is not configured",
      data: { missing },
    });
  }
  return getAdminRuntime(event);
}
