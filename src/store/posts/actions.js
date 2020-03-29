import axios from "axios";
import { setAppLoading } from "../app/actions";

import {
  SET_TAGS,
  SET_POSTS,
  UPDATE_FILTER,
  GET_POST_BY_ID
} from "./constants";

export const fetchTags = () => async dispatch => {
  const {
    data: { tags }
  } = await axios.get("/posts/tags");

  const tagList = tags.map(({ _id, color, name }) => ({
    _id,
    color,
    label: name.toUpperCase(),
    value: name
  }));

  dispatch({
    type: SET_TAGS,
    payload: tagList
  });
};

export const fetchPosts = () => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));
    const {
      posts: { filters, posts }
    } = getState();
    const updatedPosts = filters && filters.page > 1 ? [...posts] : [];
    const {
      data: { posts: data, meta }
    } = await axios.get("/posts", { params: filters });
    updatedPosts.push(...data);
    dispatch({
      type: SET_POSTS,
      payload: {
        posts: updatedPosts,
        meta
      }
    });
  } catch (err) {
    console.log(err);
  } finally {
    dispatch(setAppLoading(false));
  }
};

export const setFilter = (filterUpdate, resetPage = true) => async (
  dispatch,
  getState
) => {
  const { filters } = getState();
  const updatedFiters = { ...filters, ...filterUpdate };
  if (resetPage) updatedFiters["page"] = 1;
  dispatch({ type: UPDATE_FILTER, payload: updatedFiters });
  dispatch(fetchPosts());
};

export const getPostById = postId => async (dispatch, getState) => {
  dispatch(setAppLoading(true));
  const {
    data: { post }
  } = await axios.get(`/posts/${postId}`);

  dispatch({ type: GET_POST_BY_ID, payload: post });
  dispatch(setAppLoading(false));
};
