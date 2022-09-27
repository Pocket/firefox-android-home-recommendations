FROM node:16-bullseye-slim@sha256:4f7b6c1cab5a1d7e3754911e912ca15ba48ee56003d7de7ac2bb0e201c262acd

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
