FROM node:16-bullseye-slim@sha256:4aa1ccb69da04d4b04fcfe01fde3c58bf8af4bb6e8898e152fb636f280f84241

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
