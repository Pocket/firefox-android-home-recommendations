FROM node:16-bullseye-slim@sha256:f8cbee4ec39cbe5264fc67a8afcd254ea6ed9b5ad77c258a82100e2c6b3df6fd

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
