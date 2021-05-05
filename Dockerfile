FROM node:10.16.3-jessie-slim AS builder

WORKDIR /app
COPY . .

ARG BUILD_SPRINT=''
ARG BUILD_TIMESTAMP=''

RUN sed -i "s/build_sprint/${BUILD_SPRINT}/g" src/app/config.json
RUN sed -i "s/build_timestamp/${BUILD_TIMESTAMP}/g" src/app/config.json

RUN npm install && \
    npm run build

FROM nginx:1.17.4-alpine

COPY --from=builder /app/www/ /usr/share/nginx/html/
COPY prod.conf /etc/nginx/conf.d/default.conf
