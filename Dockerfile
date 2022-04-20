FROM node:16-bullseye-slim@sha256:c8a3b11d3d4f2ba5e4e7468a6c65963e53bd8525e658f2b5d2a69754fab10291

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
