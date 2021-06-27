const hasToken = () => !!getToken();

const getToken = () => getSessionFromStorage().token || "";

const setSessionInStorage = (data = {}) => {
  localStorage.clear();
  localStorage.setItem("bbox", JSON.stringify(data));
};

const getSessionFromStorage = () =>
  JSON.parse(localStorage.getItem("bbox") || "{}");

module.exports = {
  hasToken,
  getToken,
  setSessionInStorage,
  getSessionFromStorage,
};
