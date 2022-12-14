FROM node:16-bullseye-slim@sha256:e3b0c2c85ab824ec7671e1c2140190147da6c6a699a625a6bd6b3b0b92c70ad7

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
