import * as Sentry from '@sentry/node';
import { createHttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'cross-fetch';
import { config } from './config';
import { ClientApiResponse, ClientApiSlate, FAHRecommendation } from './types';
import { transformSlateRecs, deriveCategory } from './lib';

const client = new ApolloClient({
  link: createHttpLink({ fetch, uri: 'https://client-api.getpocket.com' }),
  cache: new InMemoryCache(),
});

/**
 * entry point to this module. retrieves data from client API and transforms it
 * to match expected schema.
 * @returns
 */
export async function getRecommendations(): Promise<FAHRecommendation[]> {
  let recs: FAHRecommendation[] = [];
  let data: ClientApiResponse | null = null;

  try {
    data = await getData();
  } catch (err) {
    console.log('error retrieving recommendations!');
    console.log(err);
    Sentry.captureException(err);
  }

  if (data) {
    data.data.getSlateLineup.slates.forEach((slate: ClientApiSlate) => {
      const category = deriveCategory(slate.description);
      recs = recs.concat(transformSlateRecs(slate.recommendations, category));
    });
  }

  return recs;
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
            description
            recommendations {
              item {
                resolvedUrl
                title
                topImageUrl
                timeToRead
                domainMetadata {
                  name
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
      new Error('No data returned from Firefox Android Home slate lineup')
    );

    return null;
  }

  return data;
}
