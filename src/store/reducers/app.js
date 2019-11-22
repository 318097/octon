import { SET_APP_LOADING } from '../constants/app';

const initialState = {
  appLoading: false
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP_LOADING:
      return {
        ...state,
        appLoading: action.payload
      }
    default:
      return state;
  }
};

export default appReducer;