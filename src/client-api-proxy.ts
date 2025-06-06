import * as Sentry from '@sentry/node';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import gql from 'graphql-tag';
import fetch from 'cross-fetch';
import { config } from './config';
import {
  ClientApiResponse,
  ClientApiSlate,
  FAHRecommendation,
  FAHRecommendationResponse,
} from './types';
import { transformSlateRecs, deriveCategory } from './lib';
import { serverLogger } from './main';

const client = new ApolloClient({
  link: new HttpLink({ fetch, uri: 'https://client-api.getpocket.com' }),
  name: config.app.apolloClientName,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache', // Cache is required, but can be disabled.
    },
  },
  version: config.app.version,
});

/**
 * entry point to this module. retrieves data from client API and transforms it
 * to match expected schema.
 * @returns
 */
export async function getRecommendations(): Promise<FAHRecommendationResponse> {
  let recs: FAHRecommendation[] = [];
  let data: ClientApiResponse | null = null;

  try {
    data = await getData();
  } catch (err) {
    serverLogger.error(`getRecommendations: error retrieving recommendations`, {
      error: err,
    });
    Sentry.captureException(err);
  }

  if (data) {
    data.data.getSlateLineup.slates.forEach((slate: ClientApiSlate) => {
      const category = deriveCategory(slate.id);
      recs = recs.concat(transformSlateRecs(slate.recommendations, category));
    });
  }

  return {
    recommendations: recs,
  };
}

/**
 * calls client API to get the configured slatelineup
 * @returns JSON response from client API
 */
async function getData(): Promise<ClientApiResponse | null> {
  const data = await client.query({
    query: gql`
      query Query($slateLineupId: String!, $slateCount: Int) {
        getSlateLineup(slateLineupId: $slateLineupId, slateCount: $slateCount) {
          slates {
            id
            recommendations {
              item {
                resolvedUrl
                timeToRead
                domainMetadata {
                  name
                }
                syndicatedArticle {
                  publisher {
                    name
                  }
                }
                corpusItem {
                  title
                  imageUrl
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      slateLineupId: config.app.slateLineupId,
      slateCount: config.app.slateCount,
    },
  });

  if (!data.data?.getSlateLineup?.slates) {
    Sentry.captureException(
      new Error('No data returned from Firefox Android Home slate lineup'),
    );

    return null;
  }

  return data;
}
