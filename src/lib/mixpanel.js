import { EventTracker } from "@codedrops/lib";
import config from "../config";

const events = {
  INIT: { name: "Init", fields: ["path"] },
  CLICK_ACTION: { name: "Click action", fields: ["target"] }, // Any button click
  REGISTER: { name: "Register" },
  LOGIN: { name: "Login" },
  LOGOUT: { name: "Logout" },
  NAVIGATION: { name: "Navigation", fields: ["name"] },
  // BUY_ME_A_COFFEE: { name: "Buy me a coffee" },
  // CLICKED_SOCIAL_ICON: {
  //   name: "Clicked social icon",
  //   fields: ["platform"],
  // },
  // SUBMITTED_FEEDBACK: { name: "Submitted feedback" },
  VIEW_POST: { name: "View post", fields: ["slug", "title"] },
  ADD_EXPENSE: { name: "Add Expense" },
  UPDATE_EXPENSE: { name: "Update Expense" },
  DELETE_EXPENSE: { name: "Delete Expense" },
  ADD_TASK: { name: "Add Task", fields: ["type"] },
  UPDATE_TASK: { name: "Update Task" },
  ADD_TIMELINE_POST: { name: "Add timeline post" },
  UPDATE_TIMELINE_POST: { name: "Update timeline post" },
  DELET_TIMELINE_POST: { name: "Delete timeline post" },
};

const tracker = new EventTracker({
  events,
  trackingId: config.MIXPANEL_TRACKING_ID,
  isDev: !config.IS_PROD,
});

export default tracker;
