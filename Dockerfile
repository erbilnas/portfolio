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
WORKDIR /app
COPY --from=build /app/.output/ ./
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "server/index.mjs"]
