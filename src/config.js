import { getServerURL } from "@codedrops/lib";

const {
  NODE_ENV,
  REACT_APP_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  REACT_APP_SENTRY_URL: SENTRY_URL,
  REACT_APP_SENTRY_RELEASE: SENTRY_RELEASE,
  REACT_APP_MIXPANEL_TRACKING_ID: MIXPANEL_TRACKING_ID,
} = process.env;

const isProd = NODE_ENV === "production";

const urlConfig = getServerURL({
  env: NODE_ENV,
  shouldReturnUrlObj: true,
  serverType: "render",
});

const config = {
  BASE_URL: urlConfig.base,
  GRAPHQL_URL: urlConfig.graphql,
  SERVER_URL: urlConfig.rest,
  GOOGLE_CLIENT_ID,
  SENTRY_URL,
  NODE_ENV,
  SENTRY_RELEASE,
  MIXPANEL_TRACKING_ID,
  IS_PROD: isProd,
};

export default config;
