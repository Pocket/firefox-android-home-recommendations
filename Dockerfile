FROM node:16-bullseye-slim@sha256:f6935acdafe69f822d887e26863314ebbc211f9662b7f4d21ea5531832cfdb20

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
