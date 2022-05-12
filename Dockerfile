FROM node:16-bullseye-slim@sha256:14af3fc10c3b85be74621ae6f0066ee4b2ab1ae1d6c0c87e0ada9ca193346071

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
