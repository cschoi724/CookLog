FROM node:24.18.0-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY tests ./tests
COPY contracts ./contracts
RUN npm run build && npm prune --omit=dev

FROM node:24.18.0-bookworm-slim AS runtime

ENV NODE_ENV=production \
    COOKLOG_ENV=production \
    HOST=0.0.0.0

WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist/src ./dist/src

USER node
EXPOSE 8080

CMD ["node", "dist/src/app/server.js"]
