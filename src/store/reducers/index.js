import appReducer from './app';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  app: appReducer
});

export default rootReducer;
