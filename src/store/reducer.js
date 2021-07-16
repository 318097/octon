import { SET_APP_LOADING, SET_SESSION, SET_KEY } from "./constants";

const initialState = {
  appLoading: false,
  appNotification: null,
  timeline: {
    groupId: undefined,
    filters: {
      search: "",
      page: 1,
      limit: 25,
      tags: [],
    },
  },
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP_LOADING:
      return {
        ...state,
        appLoading: action.payload,
      };
    case SET_SESSION:
      return {
        ...state,
        session: action.payload,
      };
    case SET_KEY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default appReducer;
