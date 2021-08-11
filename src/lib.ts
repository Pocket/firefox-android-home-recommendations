import { config } from './config';
import { FAHRecommendation, ClientApiRecommendation } from './types';

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
  rawRecs.forEach((rawRec) => {
    rec = {
      category,
      url: rawRec.item.resolvedUrl,
      title: rawRec.item.title,
      imageUrl: buildCdnImageUrl(rawRec.item.topImageUrl),
      // item.domainMetadata.name is either the proper name ("New York Times")
      // or the root domain ("nytimes.com")
      publisher: rawRec.item.domainMetadata.name,
      timeToRead: rawRec.item.timeToRead, // this might be null
    };

    recs.push(rec);
  });

  return recs;
}

/**
 * parses a slate's description, e.g. "Curated Technology Slate" or
 * "Curated items excluding syndicated that are at most a week old" (ugh)
 * into a pre-defined category name.
 *
 * yes, this is the only data point we have to work from.
 * @param slateDesc slate description from client API
 * @returns category name
 */
export function deriveCategory(slateDesc: string): string {
  let category;

  slateDesc = slateDesc.toLowerCase();

  // i don't like any of this, but it's the most straight forward and semi
  // future-proof approach i could think of.
  if (slateDesc.includes('short reads')) {
    category = 'quick-reads';
  } else if (slateDesc.includes('technology')) {
    category = 'technology';
  } else if (slateDesc.includes('health')) {
    category = 'health';
  } else if (slateDesc.includes('self-improvement')) {
    category = 'self-improvement';
  } else if (slateDesc.includes('food')) {
    category = 'food';
  } else if (slateDesc.includes('science')) {
    category = 'science';
  } else if (slateDesc.includes('entertainment')) {
    category = 'entertainment';
  } else if (slateDesc.includes('career')) {
    category = 'career';
  } else if (slateDesc.includes('excluding syndicated')) {
    // this one is particularly heinous
    category = 'must-reads';
  } else {
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
