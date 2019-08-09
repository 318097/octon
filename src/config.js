const config = {
  SERVER_URL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_SERVER_URL
      : "http://localhost:3000/api"
};

export default config;
