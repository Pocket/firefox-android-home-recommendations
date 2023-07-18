FROM node:16-bullseye-slim@sha256:e8b9a589fbeb75b8a2c8e15ef664fbd75b146e3fc6bc7151f235113a8c07bdf4

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
