import * as Sentry from '@sentry/node';
import express from 'express';
import { config } from './config';
import { getRecommendations } from './client-api-proxy';
import { setLogger, setMorgan } from '@pocket-tools/ts-logger';

export const serverLogger = setLogger();

// TODO: copy .aws directory from client-api

// Initialize sentry
// TODO: read sentry confluence page
Sentry.init({
  ...config.sentry,
  debug: config.sentry.environment == 'development',
});

const app = express();

app.use(express.json(), setMorgan(serverLogger));

app.get('/.well-known/server-health', (req, res) => {
  res.status(200).send('ok');
});

// TODO: return appropriate cache headers here
// let's start with 30 minutes
// need to research exact header names
app.get('/', async (req, res) => {
  // enable 30 minute cache when in AWS
  if (config.app.environment !== 'development') {
    res.set('Cache-control', 'public, max-age=1800');
  }

  res.json(await getRecommendations());
});

app.listen({ port: config.app.port }, () => {
  serverLogger.info(
    `🚀 Firefox Android Home Recommendations ready at http://localhost:${config.app.port}`,
  );
});
