FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm i --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api/package.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
