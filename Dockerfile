# syntax=docker/dockerfile:1
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json bun.lock* ./
# Persist Bun's install cache across Coolify builds (BuildKit).
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN bun run build

# Nitro's node_modules layout (e.g. ipx → ofetch) follows Node resolution; Bun
# does not resolve sibling packages the same way and crashes at runtime.
FROM node:20-bookworm-slim
# Coolify Dockerfile deploys probe with curl/wget; slim has neither.
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/.output/ ./
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server/index.mjs"]
