import React, { Fragment } from "react";
import { Card, Popconfirm, Calendar, Tooltip } from "antd";
import moment from "moment";
import colors, { Icon } from "@codedrops/react-ui";
import "./Tasks.scss";
import _ from "lodash";

const formatDate = (date) => {
  return date ? moment(parseInt(date)).format("DD MMM, YY") : "";
};

const getMatch = (date, stamps) =>
  _.find(
    stamps,
    (stamp) =>
      moment(stamp.date).format("DD-MM-YYYY") === date.format("DD-MM-YYYY")
  );

// const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// const WeekStatus = ({ week }) =>
//   weekDays.map((day, index) => {
//     let status = false;
//     week.forEach((date) => {
//       if (moment(date).weekday() === index) status = true;
//     });
//     return (
//       <span key={index} className={`${status ? "active" : ""} day`}>
//         {day}
//       </span>
//     );
//   });

const Task = ({ item, markTodo, deleteTodo, setActiveDateObj }) => {
  const {
    type,
    _id,
    status,
    content,
    deadline,
    completedOn,
    stamps = [],
  } = item;
  const isCompleted = status === "COMPLETED";

  // const weekNo = moment().week();
  // const currentWeekStamps = stamps[`week-${weekNo}`] || [];
  // const today = moment().format("DD-MM-YYYY");

  // if (currentWeekStamps.length) {
  //   const lastAttended = moment(
  //     currentWeekStamps[currentWeekStamps.length - 1]
  //   ).format("DD-MM-YYYY");
  //   isCompleted = lastAttended === today;
  // }

  // const percentRatio = Math.round(
  //   (currentWeekStamps.length / frequency) * 100
  // );
  // const fraction = `${currentWeekStamps.length}/${frequency}`;

  // const info = (
  //   <Fragment>
  //     <span>{percentRatio}%</span>
  //     <Divider type="vertical" />
  //     <span>{fraction}</span>
  //     <Divider type="vertical" />
  //     <span>
  //       <WeekStatus week={currentWeekStamps} />
  //     </span>
  //   </Fragment>
  // );

  const actionButton = [
    <Icon
      type="check"
      size={12}
      fill={isCompleted ? "green" : "bar"}
      onClick={() => (isCompleted ? null : markTodo(item))}
    />,
    <Popconfirm
      placement="bottomRight"
      title="Delete?"
      onConfirm={() => deleteTodo(_id)}
    >
      <Icon size={12} type="delete" />
    </Popconfirm>,
  ];

  const showPopup = (date) => {
    const match = getMatch(date, stamps);
    setActiveDateObj({ match, activeDate: date.toISOString(), task: item });
  };

  const dateCellRender = (date) => {
    const match = getMatch(date, stamps);

    return (
      <div className="fcc">
        <Tooltip title="prompt text">
          <div
            className={`day${match ? " active-day" : ""}`}
            onClick={console.log}
          >
            {date.date()}
          </div>
        </Tooltip>
      </div>
    );
  };

  const getInfo = () => {
    if (type === "GOAL") {
      const remainingTime = deadline
        ? moment(parseInt(deadline)).from(moment())
        : "";
      const isExpired = moment().isAfter(moment(deadline));
      const customStyles = {
        color: isCompleted ? colors.green : isExpired ? colors.red : null,
      };
      return (
        <Fragment>
          <div className="date">{`Deadline: ${formatDate(deadline)}`}</div>
          <div style={customStyles}>
            {isCompleted
              ? `Completed: ${formatDate(completedOn)}`
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
      title={type}
      size="small"
      extra={actionButton}
      style={isCompleted ? { background: colors.feather } : {}}
    >
      <div className="task-container">
        <div className={isCompleted ? "task disabled" : "task"}>{content}</div>
        <div className="info">{getInfo()}</div>
      </div>
    </Card>
  );
};

export default Task;
