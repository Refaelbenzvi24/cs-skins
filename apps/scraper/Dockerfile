FROM node:18.12-alpine3.16 AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
USER root
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=scraper --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18.12-alpine3.16 AS installer
USER root
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/full/ .
RUN yarn global add pnpm
RUN pnpm install

# Build the project and its dependencies
COPY turbo.json turbo.json

FROM node:18.12-alpine3.16 AS runner
WORKDIR /app

COPY --from=installer /app .
WORKDIR /app/apps/scraper

RUN addgroup --system --gid 1001 scraper
RUN adduser --system --uid 1001 scraper
USER scraper
CMD ["npm", "start"]
