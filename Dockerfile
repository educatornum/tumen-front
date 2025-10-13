# Build static site
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Allow toggling GH_PAGES at build time; default off
ARG GH_PAGES=false
ARG NEXT_PUBLIC_BACKEND_API_URL
ENV GH_PAGES=$GH_PAGES
ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
RUN npm run build

# Serve with Caddy on 443
FROM caddy:2-alpine
WORKDIR /srv
COPY --from=builder /app/out /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 443
EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

