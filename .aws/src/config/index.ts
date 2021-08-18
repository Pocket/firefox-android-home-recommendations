const name = 'FirefoxAndroidHomeRecommendations';
const isDev = process.env.NODE_ENV === 'development';
const branch = isDev ? 'dev' : 'main';
const githubConnectionArn = isDev
  ? 'arn:aws:codestar-connections:us-east-1:410318598490:connection/7426c139-1aa0-49e2-aabc-5aef11092032'
  : 'arn:aws:codestar-connections:us-east-1:996905175585:connection/5fa5aa2b-a2d2-43e3-ab5a-72ececfc1870';

let environment;
let domain;

if (process.env.NODE_ENV === 'development') {
  environment = 'Dev';
  domain = 'firefox-android-home-recommendations.getpocket.dev';
} else {
  environment = 'Prod';
  domain = 'firefox-android-home-recommendations.getpocket.com';
}

export const config = {
  name,
  isDev,
  prefix: `${name}-${environment}`,
  circleCIPrefix: `/${name}/CircleCI/${environment}`,
  shortName: 'FAHREC',
  environment,
  domain,
  tags: {
    service: name,
    environment,
  },
  codePipeline: {
    githubConnectionArn,
    repository: 'pocket/parser-graphql-wrapper',
    branch,
  },
  healthCheck: {
    command: [
      'CMD-SHELL',
      'curl -f http://localhost:4005/.well-known/server-health || exit 1',
    ],
    interval: 15,
    retries: 3,
    timeout: 5,
    startPeriod: 0,
  },
};
