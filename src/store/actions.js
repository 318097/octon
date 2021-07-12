import {
  SET_SESSION,
  SEND_APP_NOTIFICATION,
  SET_APP_LOADING,
  SET_KEY,
} from "./constants";
import axios from "axios";
import _ from "lodash";

export const updateUserSettings =
  (data, params) => async (dispatch, getState) => {
    try {
      const {
        app: { session },
      } = getState();
      dispatch(setAppLoading(true));
      const {
        data: { result },
      } = await axios.put(`/user/settings`, data, {
        params,
      });
      dispatch(setSession({ ...session, ...result }));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setAppLoading(false));
    }
  };

export const setData = (key, data) => async (dispatch, getState) => {
  const prev = _.get(getState(), ["data", key]);
  dispatch({ type: SET_KEY, payload: { [key]: { ...prev, ...data } } });
};

export const setSession = (session) => ({
  type: SET_SESSION,
  payload: session,
});

export const setAppLoading = (status) => ({
  type: SET_APP_LOADING,
  payload: status,
});

export const sendAppNotification = ({
  type = "error",
  message = "Error.",
} = {}) => ({
  type: SEND_APP_NOTIFICATION,
  payload: { type, message },
});
