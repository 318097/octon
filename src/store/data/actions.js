import axios from "axios";
import _ from "lodash";
import { setAppLoading } from "../app/actions";
import { SET_KEY } from "./constants";
import { setSession } from "../app/actions";

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
