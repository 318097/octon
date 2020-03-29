import {
  SET_TAGS,
  SET_POSTS,
  UPDATE_FILTER,
  GET_POST_BY_ID
} from "./constants";

const initialState = {
  posts: [],
  meta: null,
  tags: [],
  selectedPost: null,
  filters: {
    search: "",
    page: 1,
    limit: 25,
    tags: []
  }
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS: {
      return {
        ...state,
        posts: action.payload.posts,
        meta: action.payload.meta
      };
    }
    case SET_TAGS: {
      return {
        ...state,
        tags: action.payload
      };
    }
    case UPDATE_FILTER: {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    }
    case GET_POST_BY_ID: {
      return {
        ...state,
        selectedPost: action.payload
      };
    }
    default:
      return state;
  }
};

export default postReducer;
