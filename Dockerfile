FROM node:16-bullseye-slim@sha256:dadd13efdd7c4fad88ac4f23c1da85dc74b84a30d713c2c88cd0a19bb2164c2f

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
