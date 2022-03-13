import { SET_SESSION, SET_APP_LOADING, SET_KEY } from "./constants";
import axios from "axios";
import _ from "lodash";
import handleError from "../lib/errorHandler";
import sessionManager from "../lib/sessionManager";

export const updateUserSettings =
  (data, params) => async (dispatch, getState) => {
    try {
      dispatch(setAppLoading(true));
      await axios.post(`/tags/operations`, data, {
        params,
      });
      dispatch(fetchSession());
    } catch (error) {
      handleError(error);
    } finally {
      dispatch(setAppLoading(false));
    }
  };

export const setData = (key, data) => async (dispatch, getState) => {
  const prev = _.get(getState(), key);
  dispatch({ type: SET_KEY, payload: { [key]: { ...prev, ...data } } });
};

export const setSession = (session) => ({
  type: SET_SESSION,
  payload: session,
});

export const fetchSession = () => async (dispatch) => {
  const token = sessionManager.getToken();
  const { data } = await axios.post(`/auth/account-status`, { token });
  dispatch(setSession({ isAuthenticated: true, info: "ON_LOAD", ...data }));
};

export const setAppLoading = (status) => ({
  type: SET_APP_LOADING,
  payload: status,
});
