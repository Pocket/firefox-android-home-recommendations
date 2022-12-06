FROM node:16-bullseye-slim@sha256:6c844c5174f6a6ec74cfe27b4f2be8ba7e63ab76f06137023eb00d36e0a3d257

ARG GIT_SHA

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV=production
ENV PORT 4005
ENV GIT_SHA=${GIT_SHA}
EXPOSE ${PORT}

#Add curl for our healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

CMD ["npm", "start"]
