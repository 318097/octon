import { SET_APP_LOADING, SET_SESSION } from './constants';

const initialState = {
  appLoading: false,
  session: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP_LOADING:
      return {
        ...state,
        appLoading: action.payload
      }
    case SET_SESSION:
      return {
        ...state,
        session: action.payload
      }
    default:
      return state;
  }
};

export default appReducer;