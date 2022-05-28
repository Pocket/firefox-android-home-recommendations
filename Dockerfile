FROM node:16-bullseye-slim@sha256:3aad7003a7fb4839b4d6ce596572fa0722f0b05fad25805925aa9bfe6c106850

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
