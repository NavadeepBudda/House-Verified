FROM node:20-slim
RUN apt-get update && apt-get install -y curl ca-certificates openssl && rm -rf /var/lib/apt/lists/*
# Install c2patool (replace URL with platform-appropriate tarball)
# Example placeholder:
# RUN curl -L -o /usr/local/bin/c2patool https://example.com/c2patool-linux && chmod +x /usr/local/bin/c2patool

WORKDIR /app
COPY backend/package.json backend/tsconfig.json ./
RUN npm ci
COPY backend ./
COPY sample-assets ./sample-assets
COPY backend/keys ./keys
ENV STORAGE_DIR=/app/sample-assets/output
ENV C2PA_BIN=/usr/local/bin/c2patool
CMD ["npm","run","dev"]