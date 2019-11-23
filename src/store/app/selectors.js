import { createSelector } from 'reselect';

const selectApp = state => state.app;

const getSession = createSelector(
  selectApp,
  app => app.session
);

export { getSession }