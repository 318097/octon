import { getServerURL } from "@codedrops/lib";

const {
  NODE_ENV,
  REACT_APP_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  REACT_APP_SENTRY_URL: SENTRY_URL,
  REACT_APP_SENTRY_RELEASE: SENTRY_RELEASE,
  REACT_APP_MIXPANEL_TRACKING_ID: MIXPANEL_TRACKING_ID,
} = process.env;

const isProd = NODE_ENV === "production";

const { baseURL, serverURL, graphqlURL } = getServerURL({
  isProd,
  serverType: "heroku",
  returnObject: true,
});

const config = {
  BASE_URL: baseURL,
  GRAPHQL_URL: graphqlURL,
  SERVER_URL: serverURL,
  GOOGLE_CLIENT_ID,
  SENTRY_URL,
  NODE_ENV,
  SENTRY_RELEASE,
  MIXPANEL_TRACKING_ID,
  IS_PROD: isProd,
};

export default config;
