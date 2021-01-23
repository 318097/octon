import axios from "axios";
import _ from "lodash";
import { setAppLoading } from "../app/actions";
import { SET_KEY } from "./constants";
import { setSession } from "../app/actions";

export const getTimeline = () => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));
    const groupId = _.get(getState(), "data.timeline.groupId");
    const {
      data: { timeline },
    } = await axios.get(`/timeline`, {
      params: {
        groupId,
        // page,
      },
    });
    // if (page > 1) {
    //   setData((data) => [...data, ...timeline]);
    // } else {
    //   setData(timeline);
    // }

    dispatch(setData("timeline", { data: timeline }));
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const saveTimelinePost = (data, post) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));
    const { mode, date, content } = data;
    const { data: previousData, groupId } = _.get(getState(), "data.timeline");
    let updatedTimeline;
    if (mode === "EDIT") {
      await axios.put(`/timeline/${post._id}`, {
        content,
        date: date.format(),
      });
      updatedTimeline = previousData.map((item) => {
        if (post._id === item._id) return { ...item, content, date };
        return item;
      });
    } else {
      const {
        data: { result },
      } = await axios.post(`/timeline`, {
        content,
        date: date.format(),
        groupId,
      });
      updatedTimeline = [result, ...previousData];
    }
    dispatch(setData("timeline", { data: updatedTimeline }));
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const updateAppData = (data) => async (dispatch, getState) => {
  try {
    const {
      app: { session },
    } = getState();
    dispatch(setAppLoading(true));
    const {
      data: { result },
    } = await axios.put(`/users/app-data`, data, {
      params: { action: "CREATE_TIMELINE_GROUP" },
    });
    dispatch(setSession({ ...session, timeline: result.timeline }));
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
