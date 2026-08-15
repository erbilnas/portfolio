import { addPending, allowSign, parseSignBody } from "../utils/guestbook";

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  if (!allowSign(ip)) {
    setResponseStatus(event, 429);
    return { status: 429, message: "rate_limited" };
  }

  const body = await readBody<{
    name?: unknown;
    note?: unknown;
    website?: unknown;
  }>(event);
  const parsed = parseSignBody(body ?? {});

  if ("honeypot" in parsed) {
    return { status: "pending" };
  }
  if ("invalid" in parsed) {
    setResponseStatus(event, 400);
    return { status: 400, message: "invalid" };
  }

  await addPending(parsed.name, parsed.note);
  return { status: "pending" };
});
