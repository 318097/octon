import { getServerURL } from "@codedrops/lib";

const {
  NODE_ENV,
  REACT_APP_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  REACT_APP_SENTRY_URL: SENTRY_URL,
  REACT_APP_SENTRY_RELEASE: SENTRY_RELEASE,
} = process.env;

const isProd = NODE_ENV === "production";
const { baseURL, serverURL, graphqlURL } = getServerURL({
  isProd,
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
};

export default config;
