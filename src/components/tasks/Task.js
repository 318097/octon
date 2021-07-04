import React from "react";
import { Card, Popconfirm, Calendar } from "antd";
import moment from "moment";
import colors, { Icon } from "@codedrops/react-ui";
import { formatDate } from "@codedrops/lib";
import "./Tasks.scss";
import _ from "lodash";

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
    createdAt,
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
    if (isCompleted) return;
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
    let completionStatus = isCompleted ? (
      <div style={{ color: colors.green }}>
        Completed: {formatDate(completedOn)}
      </div>
    ) : null;

    const creationDate = isCompleted ? (
      <div>Created: {formatDate(createdAt)}</div>
    ) : null;

    let elem;

    if (type === "GOAL") {
      const remainingTime = deadline ? moment(deadline).from(moment()) : "";
      const isExpired = moment().isAfter(moment(deadline), "day");
      const expiryStyles = {
        color: isExpired ? colors.red : null,
      };

      const expiryStatus = (
        <div style={expiryStyles}>
          {isExpired ? `Expired ${remainingTime}` : `Expires ${remainingTime}`}
        </div>
      );

      elem = <div className="date">{`Deadline: ${formatDate(deadline)}`}</div>;
      completionStatus = isCompleted ? completionStatus : expiryStatus;
    } else if (type === "PROGRESS") {
      elem = (
        <Calendar
          fullscreen={false}
          onSelect={showPopup}
          dateFullCellRender={dateCellRender}
        />
      );
    }

    return (
      <>
        {elem}
        <span>
          {creationDate} {completionStatus}
        </span>
      </>
    );
  };

  return (
    <Card
      // className="mb"
      className={isCompleted ? "task complete" : "task"}
      title={`${type}: ${content}`}
      size="small"
      extra={actionButton}
      // style={isCompleted ? { background: colors.feather } : {}}
    >
      <div className="task-container">
        {/* <div className={isCompleted ? "task disabled" : "task"}>{content}</div> */}
        <div className="info">{getInfo()}</div>
      </div>
    </Card>
  );
};

export default Task;
