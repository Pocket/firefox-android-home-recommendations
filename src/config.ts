export const config = {
  app: {
    environment: process.env.NODE_ENV || 'development',
    apolloClientName: 'FirefoxAndroidHomeRecommendations',
    version: `${process.env.GIT_SHA ?? 'local'}`,
    port: 4005,
    slateCount: 10, // this is the total number of slates in the lineup
    slateLineupId: 'a26db39b-a68a-4e01-b680-443a466f9c36',
    // TODO: check with petru on placeholder dimensions below & quality level
    imageCdnPrefix:
      'https://img-getpocket.cdn.mozilla.net/600x400/filters:format(jpeg):quality(60):no_upscale():strip_exif()/',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    release: process.env.GIT_SHA || '',
    environment: process.env.NODE_ENV || 'development',
  },
};
