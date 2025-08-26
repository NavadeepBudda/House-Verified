FROM node:20-slim as build
WORKDIR /app
COPY frontend/package.json frontend/tailwind.config.js frontend/postcss.config.js frontend/tsconfig.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80