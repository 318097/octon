const isLoggedIn = () => !!getToken();

const getToken = () => localStorage.getItem("bbox-token");

const setToken = token => {
  localStorage.clear();
  localStorage.setItem("bbox-token", token);
};

const setUser = user =>
  sessionStorage.setItem("bbox-user", JSON.stringify(user));

const getUser = () => JSON.parse(sessionStorage.getItem("bbox-user") || "{}");

module.exports = {
  isLoggedIn,
  getToken,
  setToken,
  setUser,
  getUser
};
