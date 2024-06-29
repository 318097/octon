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

export const THEME = {
  token: {
    colorPrimary: "#4a279e",
    borderRadius: 2,
    padding: 6,
    paddingLG: 12,
    paddingContentHorizontal: 12,
    paddingContentVertical: 12,
    paddingContentHorizontalLG: 12,
    paddingContentVerticalLG: 12,
    fontSize: 12,
  },
  components: {
    Modal: {
      titleLineHeight: 1,
    },
  },
};

export const MODAL_PROPS = {
  wrapClassName: "react-ui",
  footer: null,
  centered: true,
  closable: false,
};

export default config;
