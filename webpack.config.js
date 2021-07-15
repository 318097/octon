const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  // other webpack configuration
  devtool: "source-map",
  plugins: [
    new SentryWebpackPlugin({
      // sentry-cli configuration
      authToken: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
      org: "mehul-lakhanpals-projects",
      project: "octon",
      release: process.env.REACT_APP_SENTRY_RELEASE,
      // webpack-specific configuration
      include: ".",
      ignore: ["node_modules", "webpack.config.js"],
    }),
  ],
};
