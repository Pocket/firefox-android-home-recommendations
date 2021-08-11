# Firefox Android Home Recommendations API

Provides recommendations to be consumed by Firefox for Android.

## Application Overview

[Express](https://expressjs.com/) is the Node framework, [Apollo Client](https://www.apollographql.com/docs/apollo-server/) is used in Express to request data from [Client API](https://github.com/Pocket/client-api/).

### Caching

Because all Firefox Android clients will be hitting this endpoint, caching is _very_ aggressive.

TODO: describe our caching strategy as soon as we have it. CDN, headers, you know, probably stuff like that.

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

Load up `http://localhost:4005` in your browser. There you go.
