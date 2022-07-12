FROM node:16-bullseye-slim@sha256:76b7e3649beccce688512bba1b69ab1c8154041307d0a84e8eb75ef4c65f1f14

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
