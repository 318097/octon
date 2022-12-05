import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import config from "../config";
import sessionManager from "../lib/sessionManager";

const httpLink = createHttpLink({
  uri: config.GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "access-control-allow-origin": "*",
      authorization: sessionManager.getToken(),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
    fetchOptions: {
    mode: 'no-cors',
  },
});

export default client;
