import { SET_SESSION, SEND_APP_NOTIFICATION } from "./constants";

export const setSession = session => ({ type: SET_SESSION, payload: session });

export const sendAppNotification = ({ type = "success", message }) => ({
  type: SEND_APP_NOTIFICATION,
  payload: { type, message }
});
