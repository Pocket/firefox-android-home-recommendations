import { deriveCategory, transformSlateRecs, buildCdnImageUrl } from './lib';
import { FAHRecommendation, ClientApiRecommendation } from './types';

describe('test lib', () => {
  describe('deriveCategory', () => {
    // descriptions below are the descriptions returned from each slate from
    // recommendation-api. why don't we use this map in the `deriveCategory`
    // function itself? well, the idea behind creating a slatelineup is that we
    // can swap out slates without changing code in this application - we just
    // refer to the slatelineup. that being the case, checking on sub-strings
    // in the `deriveCategory` function gives us a *bit* more resiliency if
    // and when we change out the underlying slates.
    //
    // yes, it's still inherently brittle. :/
    const slateDescriptionMap = [
      {
        category: 'general',
        desc: 'Curated items including syndicated that are at most a week old',
      },
      {
        category: 'quick-reads',
        desc: 'Curated short reads excluding syndicated',
      },
      {
        category: 'must-reads',
        desc: 'Curated items excluding syndicated that are at most a week old',
      },
      {
        category: 'technology',
        desc: 'Curated Technology Slate',
      },
      {
        category: 'health',
        desc: 'Curated Health Slate',
      },
      {
        category: 'self-improvement',
        desc: 'Curated Self-Improvement Slate',
      },
      {
        category: 'food',
        desc: 'Curated Food Slate',
      },
      {
        category: 'science',
        desc: 'Curated Science Slate',
      },
      {
        category: 'entertainment',
        desc: 'Curated Entertainment Slate',
      },
      {
        category: 'career',
        desc: 'Curated Career Slate',
      },
    ];

    it('should derive the expected category from a slate description', () => {
      slateDescriptionMap.forEach((map) => {
        expect(deriveCategory(map.desc)).toEqual(map.category);
      });
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
