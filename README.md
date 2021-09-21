# Firefox Android Home Recommendations API

Provides recommendations to be consumed by Firefox for Android.

## Application Overview

[Express](https://expressjs.com/) is the Node framework, [Apollo Client](https://www.apollographql.com/docs/apollo-server/) is used in Express to request data from [Client API](https://github.com/Pocket/client-api/).

### Caching

Because all Firefox Android clients will be hitting this endpoint, caching is _very_ aggressive.

In AWS (but _not_ for local development), our cache header on the Express endpoint is `'Cache-control', 'public, max-age=1800'`. We also have a CDN in place which respects this cache header, meaning the _most_ frequent the underlying service will be hit is every 30 minutes.

As of this writing (2021-08-19), the underlying recommendation service will update _at most_ every hour. We have chosen a 30 minute cache for practicality (a faster expire time just in case), and performance reasons (2 service hits per hour is well within our application service limits).

## Local Development

### Fresh Setup

Clone the repo:

- `git clone git@github.com:Pocket/firefox-android-home-recommendations.git`
- `cd firefox-android-home-recommendations`

Install the packages:

- `npm install`

### Running Tests

Test are run via `npm` commands:

- Unit/functional: `npm test`

#### Testing Client API

- Run `npm run start:dev`.
- Load up `http://localhost:4005` in your browser. There you go.
