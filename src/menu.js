import React from "react";
import { Icon } from "@ant-design/compatible";

const routes = ({ isAuthenticated, filterKey }) =>
  [
    {
      route: "/expenses",
      label: "Expenses",
      icon: <Icon type="wallet" />,
      description: "Track daily expenses & investments",
      visible: true,
      showInHomePage: true,
    },
    {
      route: "/tasks",
      label: "Tasks",
      icon: <Icon type="unordered-list" />,
      description: "Track progress, goals, and todos",
      visible: true,
      showInHomePage: true,
    },
    {
      route: "/timeline",
      label: "Timeline",
      icon: <Icon type="hourglass" />,
      description: "Personal timeline",
      visible: true,
      showInHomePage: true,
    },
    {
      route: "/scratch-pad",
      label: "Scratch Pad",
      icon: <Icon type="file-text" />,
    },
    {
      route: "/settings",
      label: "Settings",
      icon: <Icon type="setting" />,
      visible: isAuthenticated,
    },
  ].filter((i) => i[filterKey]);

export default routes;
