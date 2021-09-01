export const config = {
  app: {
    environment: process.env.NODE_ENV || 'development',
    apolloClientName: 'FirefoxAndroidHomeRecommendations',
    version: `${process.env.GIT_SHA ?? 'local'}`,
    port: 4005,
    slateCount: 10, // this is the total number of slates in the lineup
    slateLineupId: 'a26db39b-a68a-4e01-b680-443a466f9c36',
    // this results in a tight coupling between Recs API and this repo.
    // this isn't great, but is the best as of now because:
    // - it follows pre-existing Recs API practices of using a slate lineup
    // - there are no plans to run experiments on this slate lineup,
    //   meaning the ids below should not change
    //
    // if we end up wanting to run experiments on these recommendations, we
    // would likely move to one slate lineup per category.
    slateIdCategoryMap: {
      '0737b00e-a21e-4875-a4c7-3e14926d4acf': 'general',
      '2e3ddc90-8def-46d7-b85f-da7525c66fb1': 'must-reads',
      '626397d3-fa4e-4299-8d07-cbeaa269ebc1': 'quick-reads',
      'e0d7063a-9421-4148-b548-446e9fbc8566': 'technology',
      '7cb4f497-fd05-42c5-9f78-3650e9ddba21': 'health',
      '6d1273a5-055e-4de0-8a5b-5f2b79d37e5c': 'self-improvement',
      '1a634351-361b-4115-a9d5-b79131b1f95a': 'food',
      'b64c873e-7f05-496e-8be4-bfae929c8a04': 'science',
      'e9df8a81-19af-48e2-a90f-05e9a37491ca': 'entertainment',
      'b4032752-155b-4f09-ac1e-f5337df19e88': 'career',
    },
    // TODO: check with petru on placeholder dimensions below & quality level
    imageCdnPrefix:
      'https://img-getpocket.cdn.mozilla.net/{wh}/filters:format(jpeg):quality(60):no_upscale():strip_exif()/',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    release: process.env.GIT_SHA || '',
    environment: process.env.NODE_ENV || 'development',
  },
};
