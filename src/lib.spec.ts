import { config } from './config';
import { deriveCategory, transformSlateRecs, buildCdnImageUrl } from './lib';
import { FAHRecommendation, ClientApiRecommendation } from './types';

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
