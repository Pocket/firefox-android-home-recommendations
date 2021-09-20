import * as Sentry from '@sentry/node';
import { config } from './config';
import {
  FAHRecommendation,
  ClientApiRecommendation,
  ClientApiItem,
} from './types';

/**
 * takes a slate object from client API and transforms it to match the expected
 * schema.
 * @param slateData - a slate as returned from client API
 * @returns array of formatted recommendations
 */
export function transformSlateRecs(
  rawRecs: ClientApiRecommendation[],
  category: string
): FAHRecommendation[] {
  const recs: FAHRecommendation[] = [];
  let rec: FAHRecommendation;

  // iterate over each recommendation in the slate
  rawRecs.forEach((rawRec: ClientApiRecommendation) => {
    rec = {
      category,
      url: rawRec.item.resolvedUrl,
      title: rawRec.item.title,
      imageUrl: buildCdnImageUrl(rawRec.item.topImageUrl),
      // item.domainMetadata.name is either the proper name ("New York Times")
      // or the root domain ("nytimes.com")
      publisher: derivePublisher(rawRec.item),
      timeToRead: rawRec.item.timeToRead, // this might be null
    };

    recs.push(rec);
  });

  return recs;
}

/**
 * takes a recommendation and, if it's a syndicated article, returns the
 * original publisher (instead of "Pocket"). otherwise, returns the publisher
 * from the domain. returns an empty string if no publisher could be derived.
 * @param item ClientAPIItem the raw item from client API
 * @returns string
 */
export function derivePublisher(item: ClientApiItem): string {
  let publisher;

  if (item.syndicatedArticle?.publisher?.name) {
    publisher = item.syndicatedArticle.publisher.name;
  } else if (item.domainMetadata?.name) {
    publisher = item.domainMetadata.name;
  } else {
    // log to sentry so we can see recommendations without publishers
    Sentry.captureException(
      new Error(
        `No publisher could be derived for resolvedUrl: ${item.resolvedUrl}`
      )
    );

    publisher = '';
  }

  return publisher;
}

/**
 * return the category based on the slate's ID. this is inherently brittle /
 * a too tight coupling between Recs API and this app. however, we don't have
 * a better way (yet) to do this mapping.
 *
 * @param slateId slate ID from client API
 * @returns category name
 */
export function deriveCategory(slateId: string): string {
  // if an unknown slate ID is passed in, this will result in a value of
  // `undefined`
  let category = config.app.slateIdCategoryMap[slateId];

  // if the above does result in `undefined`, default to the `general` category
  if (!category) {
    // log to sentry so we can find out if unknown slates are being sent
    Sentry.captureException(
      new Error(
        `Unexpected slate ID: ${slateId}. No category could be derived. (A slate may have changed in Recs API?)`
      )
    );

    // defaulting to `general` so firefox android can still use the
    // recommendation
    category = 'general';
  }

  return category;
}

/**
 * creates a CDN url from an image url
 * @param url - original url returned by client API
 * @returns a CDN-based url for the provided image url
 */
export function buildCdnImageUrl(url: string): string {
  return `${config.app.imageCdnPrefix}${encodeURIComponent(url)}`;
}
