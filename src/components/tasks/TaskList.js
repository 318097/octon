import React, { Fragment } from "react";
import { Card, Popconfirm, Divider } from "antd";
import moment from "moment";
import axios from "axios";
import colors, { Icon } from "@codedrops/react-ui";
import "./Tasks.scss";

const formatDate = (date) => {
  return date ? moment(parseInt(date)).format("DD MMM, YY") : "";
};

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const WeekStatus = ({ week }) =>
  weekDays.map((day, index) => {
    let status = false;
    week.forEach((date) => {
      if (moment(date).weekday() === index) status = true;
    });
    return (
      <span key={index} className={`${status ? "active" : ""} day`}>
        {day}
      </span>
    );
  });

const TodoList = ({ todoList, fetchTodoList, type }) => {
  const markTodo = async (id, type) => {
    await axios.put(`/tasks/${id}/stamp`, { date: moment().toDate(), type });
    fetchTodoList();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/tasks/${id}`);
    fetchTodoList();
  };

  return todoList.map((item) => (
    <CardItem item={item} markTodo={markTodo} deleteTodo={deleteTodo} />
  ));
};

const CardItem = ({ item, markTodo, deleteTodo }) => {
  const { type, _id, status, content, deadline, completedOn } = item;
  const isTodoMarked = type === "TODO" && status === "COMPLETE";

  // const weekNo = moment().week();
  // const currentWeekStamps = stamps[`week-${weekNo}`] || [];
  // const today = moment().format("DD-MM-YYYY");

  // if (currentWeekStamps.length) {
  //   const lastAttended = moment(
  //     currentWeekStamps[currentWeekStamps.length - 1]
  //   ).format("DD-MM-YYYY");
  //   isTodoMarked = lastAttended === today;
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
      className={isTodoMarked ? "success" : null}
      onClick={() => (isTodoMarked ? null : markTodo(_id, type))}
    />,
    <Popconfirm
      placement="bottomRight"
      title="Delete?"
      onConfirm={() => deleteTodo(_id)}
    >
      <Icon size={12} type="delete" />
    </Popconfirm>,
  ];

  const getInfo = () => {
    if (type === "GOAL") {
      const remainingTime = deadline
        ? moment(parseInt(deadline)).from(moment())
        : "";
      const isExpired = moment().isAfter(moment(deadline));
      const style = {
        background:
          status === "COMPLETED" ? colors.green : isExpired ? colors.red : null,
      };
      return (
        <Fragment>
          <div className="date">{`Deadline: ${formatDate(deadline)}`}</div>
          {status === "COMPLETED" ? (
            <div className="date">{`Completed: ${formatDate(
              completedOn
            )}`}</div>
          ) : (
            <div className="time">{`Expires ${remainingTime}`}</div>
          )}
        </Fragment>
      );
    } else return null;
  };

  return (
    <Card
      // className="task-list"
      title={type}
      size="small"
      extra={actionButton}
    >
      <div className="task-container">
        <div className={isTodoMarked ? "task disabled" : "task"}>{content}</div>
        <div className="info">{getInfo()}</div>
      </div>
    </Card>
  );
};

export default TodoList;
