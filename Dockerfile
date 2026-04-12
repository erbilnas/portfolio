FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
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
ENV HOST=49.12.47.215
EXPOSE 3000
CMD ["node", "server/index.mjs"]
