FROM ghcr.io/chneau/meteor:3.0-rc.2 AS builder
WORKDIR /app
COPY --chown=meteor:meteor ./package*.json .
RUN meteor npm ci
COPY --chown=meteor:meteor . .
RUN meteor build --server-only --directory bundle
RUN cd bundle/bundle/programs/server && meteor npm install

FROM node:20-bullseye-slim AS final
RUN useradd --no-create-home --shell /bin/bash meteor
USER meteor
WORKDIR /app
COPY --from=builder /app/bundle/bundle .
CMD exec node main.js
