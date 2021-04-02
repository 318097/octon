import { SET_KEY } from "./constants";

const initialState = {
  timeline: {
    data: [],
    groupId: undefined,
    filters: {
      search: "",
      page: 1,
      limit: 25,
      tags: [],
    },
  },
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_KEY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default postReducer;
