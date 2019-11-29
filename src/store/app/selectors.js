import { createSelector } from 'reselect';

const selectApp = state => state.app;

const getSession = createSelector(
  selectApp,
  app => app.session
);

const getAppNotification = createSelector(
  selectApp,
  app => app.appNotification
);

export { getSession, getAppNotification };
