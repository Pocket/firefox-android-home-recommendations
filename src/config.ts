export const config = {
  app: {
    environment: process.env.NODE_ENV || 'development',
    port: 4005,
    slateCount: 10, // this is the total number of slates in the lineup
    slateLineupId: 'a26db39b-a68a-4e01-b680-443a466f9c36',
    imageCdnPrefix: 'https://img-getpocket.cdn.mozilla.net/direct?url=',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    release: process.env.GIT_SHA || '',
    environment: process.env.NODE_ENV || 'development',
  },
};
