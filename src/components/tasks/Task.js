import React, { Fragment } from "react";
import { Card, Popconfirm, Calendar } from "antd";
import moment from "moment";
import colors, { Icon } from "@codedrops/react-ui";
import "./Tasks.scss";
import _ from "lodash";

const formatDate = (date) => {
  return date ? moment(date).format("DD MMM, YY") : "";
};

const getMatch = (date, stamps) =>
  _.find(
    stamps,
    (stamp) =>
      moment(stamp.date).format("DD-MM-YYYY") === date.format("DD-MM-YYYY")
  );

const Task = ({ task, markTodo, deleteTodo, setTaskObj }) => {
  const {
    type,
    _id,
    status,
    content,
    deadline,
    completedOn,
    stamps = [],
  } = task;
  const isCompleted = status === "COMPLETED";

  const actionButton = [
    <Icon
      key="check"
      type="check"
      size={12}
      fill={isCompleted ? "lightgrey" : "bar"}
      onClick={() => (isCompleted ? null : markTodo(task))}
    />,
    <Popconfirm
      key="delete"
      placement="bottomRight"
      title="Delete?"
      onConfirm={() => deleteTodo(_id)}
    >
      <Icon size={12} type="delete" />
    </Popconfirm>,
  ];

  const showPopup = (date) => {
    const subTask = getMatch(date, stamps);
    setTaskObj({
      visible: true,
      subTask,
      date: date.toISOString(),
      task,
    });
  };

  const dateCellRender = (date) => {
    const subTask = getMatch(date, stamps);

    return (
      <div className={`day${subTask ? " active-day" : ""}`}>{date.date()}</div>
    );
  };

  const getInfo = () => {
    if (type === "GOAL") {
      const remainingTime = deadline ? moment(deadline).from(moment()) : "";
      const isExpired = moment().isAfter(moment(deadline), "day");
      const customStyles = {
        color: isCompleted ? colors.green : isExpired ? colors.red : null,
      };
      return (
        <Fragment>
          <div className="date">{`Deadline: ${formatDate(deadline)}`}</div>
          <div style={customStyles}>
            {isCompleted
              ? `Completed: ${formatDate(completedOn)}`
              : isExpired
              ? `Expired ${remainingTime}`
              : `Expires ${remainingTime}`}
          </div>
        </Fragment>
      );
    } else if (type === "PROGRESS") {
      return (
        <Calendar
          fullscreen={false}
          onSelect={showPopup}
          dateFullCellRender={dateCellRender}
        />
      );
    } else return null;
  };

  return (
    <Card
      className="mb"
      title={`${type}: ${content}`}
      size="small"
      extra={actionButton}
      style={isCompleted ? { background: colors.feather } : {}}
    >
      <div className="task-container">
        {/* <div className={isCompleted ? "task disabled" : "task"}>{content}</div> */}
        <div className="info">{getInfo()}</div>
      </div>
    </Card>
  );
};

export default Task;
