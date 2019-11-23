import { createStore } from 'redux';
import { combineReducers } from 'redux';

import appReducer from './app/reducer';

const rootReducer = combineReducers({
  app: appReducer
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;