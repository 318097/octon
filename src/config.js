const { REACT_APP_GOOGLE_CLIENT_ID, NODE_ENV, REACT_APP_SERVER_URL } =
  process.env;

const BASE_URL =
  NODE_ENV === "production" ? REACT_APP_SERVER_URL : "http://localhost:7000";

const config = {
  BASE_URL,
  GRAPHQL_URL: `${BASE_URL}/graphql`,
  SERVER_URL: `${BASE_URL}/api`,
  GOOGLE_CLIENT_ID: REACT_APP_GOOGLE_CLIENT_ID,
};

export default config;
