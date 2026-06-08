FROM node:22-alpine AS build
WORKDIR /app

# Install deps — separate layer for caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Inject API URL from build arg into the environment files before building
ARG FRONTEND_API_URL=http://localhost:5034/api
COPY . .
RUN sed -i "s|https://localhost:7207/api|${FRONTEND_API_URL}|g" \
        src/environments/environment.ts \
        src/environments/environment.prod.ts

RUN npx ng build --configuration production

FROM nginx:alpine AS runtime
COPY --from=build /app/dist/front-end-task-management/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
