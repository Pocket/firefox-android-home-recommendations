import AWSXRay from 'aws-xray-sdk-core';
import xrayExpress from 'aws-xray-sdk-express';
import * as Sentry from '@sentry/node';
import https from 'https';
import express from 'express';
import { config } from './config';
import { getRecommendations } from './client-api-proxy';

// TODO: copy .aws directory from client-api

//Set XRAY to just log if the context is missing instead of a runtime error
AWSXRay.setContextMissingStrategy('LOG_ERROR');

//Add the AWS XRAY ECS plugin that will add ecs specific data to the trace
AWSXRay.config([AWSXRay.plugins.ECSPlugin]);

//Capture all https traffic this service sends
//This is to auto capture node fetch requests (like to client API)
AWSXRay.captureHTTPsGlobal(https, true);

//Capture all promises that we make
AWSXRay.capturePromise();

// Initialize sentry
// TODO: read sentry confluence page
Sentry.init({
  ...config.sentry,
  debug: config.sentry.environment == 'development',
});

const app = express();

//If there is no host header (really there always should be..) then use collection-api as the name
app.use(xrayExpress.openSegment('firefox-android-home-recommendations'));

//Set XRay to use the host header to open its segment name.
AWSXRay.middleware.enableDynamicNaming('*');

app.use(express.json());

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

//Make sure the express app has the xray close segment handler
app.use(xrayExpress.closeSegment());

app.listen({ port: config.app.port }, () => {
  console.log(
    `🚀 Firefox Android Home Recommendations ready at http://localhost:${config.app.port}`,
  );
});
