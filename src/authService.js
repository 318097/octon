const getToken = () => localStorage.getItem("bbox-token");

const isLoggedIn = () => !!getToken();

const setToken = token => {
  localStorage.clear();
  localStorage.setItem("bbox-token", token);
};

module.exports = {
  getToken,
  isLoggedIn,
  setToken
};
