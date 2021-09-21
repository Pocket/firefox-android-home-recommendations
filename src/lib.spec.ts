import { config } from './config';
import {
  deriveCategory,
  derivePublisher,
  transformSlateRecs,
  buildCdnImageUrl,
} from './lib';
import {
  FAHRecommendation,
  ClientApiRecommendation,
  ClientApiItem,
} from './types';

describe('test lib', () => {
  describe('deriveCategory', () => {
    it('should derive the expected category from a slate description', () => {
      for (const prop in config.app.slateIdCategoryMap) {
        expect(deriveCategory(prop)).toEqual(
          config.app.slateIdCategoryMap[prop]
        );
      }
    });

    it('should return `general` for an un-mapped slate ID', () => {
      expect(deriveCategory('some-unknown-slate-id')).toEqual('general');
    });
  });

  describe('derivePublisher', () => {
    let item: ClientApiItem;

    beforeEach(() => {
      item = {
        resolvedUrl:
          'https://getpocket.com/explore/item/7-incredible-benefits-of-lifting-weights-that-have-nothing-to-do-with-building-muscle',
        title:
          '7 Incredible Benefits of Lifting Weights That Have Nothing to Do With Building Muscle',
        topImageUrl:
          'https://pocket-image-cache.com/1200x/filters:format(jpg):extract_focal()/https%3A%2F%2Fpocket-syndicated-images.s3.amazonaws.com%2Farticles%2F6786%2F1628710235_61141fc464340.png',
        timeToRead: 6,
        domainMetadata: {
          name: 'Pocket',
        },
        // normally a value of 'Pocket' above would dictate syndication data -
        // omitting here for testing purposes.
        syndicatedArticle: null,
      };
    });

    it('should use the domain publisher if not a syndicated article', () => {
      expect(derivePublisher(item)).toEqual('Pocket');
    });

    it('should use the syndicated article publisher if present', () => {
      // mimic syndication data for the above
      item.syndicatedArticle = {
        publisher: {
          name: 'Prevention',
        },
      };

      expect(derivePublisher(item)).toEqual('Prevention');
    });

    it('should return an empty string if no publisher could be found', () => {
      item.domainMetadata = null;

      expect(derivePublisher(item)).toEqual('');
    });
  });

  describe('transformSlateRecs', () => {
    const url1 = 'https://getpocket.com/collections';
    const imageUrl1 = 'https://placedog.net/500/400';
    const title1 = 'Pocket has amazing collections, am I right?';
    const publisher1 = 'Pocket';
    const ttr1 = 12;

    const url2 = 'https://mozilla.org';
    const imageUrl2 = 'https://placedog.net/600/400';
    const title2 = 'Mozilla - did you know they are a non-profit?';
    const publisher2 = 'Mozilla';
    const ttr2 = 5;

    const category = 'career';

    let rawRec1: ClientApiRecommendation;
    let rawRec2: ClientApiRecommendation;

    beforeEach(() => {
      rawRec1 = {
        item: {
          resolvedUrl: url1,
          title: title1,
          topImageUrl: imageUrl1,
          timeToRead: ttr1,
          domainMetadata: {
            name: publisher1,
          },
          syndicatedArticle: null,
        },
      };

      rawRec2 = {
        item: {
          resolvedUrl: url2,
          title: title2,
          topImageUrl: imageUrl2,
          timeToRead: ttr2,
          domainMetadata: {
            name: publisher2,
          },
          syndicatedArticle: null,
        },
      };
    });

    it('should transform a slate recommendation correctly', () => {
      const rawRecs: ClientApiRecommendation[] = [rawRec1, rawRec2];

      const expected: FAHRecommendation[] = [
        {
          url: url1,
          publisher: publisher1,
          imageUrl: buildCdnImageUrl(imageUrl1),
          title: title1,
          timeToRead: ttr1,
          category: category,
        },
        {
          url: url2,
          publisher: publisher2,
          imageUrl: buildCdnImageUrl(imageUrl2),
          title: title2,
          timeToRead: ttr2,
          category: category,
        },
      ];

      expect(transformSlateRecs(rawRecs, category)).toEqual(expected);
    });

    it('should transform a slate recommendation that has a `null` time to read', () => {
      rawRec1.item.timeToRead = null;

      const rawRecs: ClientApiRecommendation[] = [rawRec1];

      const expected: FAHRecommendation = {
        url: url1,
        publisher: publisher1,
        imageUrl: buildCdnImageUrl(imageUrl1),
        title: title1,
        timeToRead: null,
        category,
      };

      expect(transformSlateRecs(rawRecs, category)).toEqual([expected]);
    });
  });
});
