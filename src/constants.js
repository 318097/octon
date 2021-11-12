import React from "react";
import { Icon } from "@ant-design/compatible";

const routes = ({ isAuthenticated, filterKey }) =>
  [
    {
      route: "/expenses",
      label: "Expenses",
      icon: <Icon type="wallet" />,
      description: "Track daily expenses & investments",
      showInNavBar: isAuthenticated,
      showInHomePage: true,
    },
    {
      route: "/tasks",
      label: "Tasks",
      icon: <Icon type="unordered-list" />,
      description: "Track progress, goals, and todos",
      showInNavBar: isAuthenticated,
      showInHomePage: true,
    },
    {
      route: "/timeline",
      label: "Timeline",
      icon: <Icon type="hourglass" />,
      description: "Personal timeline",
      showInNavBar: isAuthenticated,
      showInHomePage: true,
    },
    {
      route: "/scratch-pad",
      label: "Scratch Pad",
      icon: <Icon type="file-text" />,
      showInNavBar: isAuthenticated,
      showInHomePage: true,
    },
    {
      route: "/settings",
      label: "Settings",
      icon: <Icon type="setting" />,
      showInNavBar: isAuthenticated,
      showInHomePage: false,
    },
  ].filter((i) => i[filterKey]);

export default routes;
