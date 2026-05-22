# Dockerfile
# 1) Build Stage
FROM docker.io/hugomods/hugo:debian-ci-0.154.5 AS build
WORKDIR /src
COPY . .
RUN hugo --minify

# 2) Runtime Stage
FROM docker.io/library/nginx:1.31.1-alpine
COPY --from=build /src/public /usr/share/nginx/html
