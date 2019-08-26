const config = {
  SERVER_URL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_SERVER_URL
      : "http://localhost:7000/api",
  GOOGLE_LOGIN_CLIENT_ID: process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID
};

export default config;
