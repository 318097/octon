import React, { Fragment } from "react";
import { List, Popconfirm, Divider } from "antd";
import moment from "moment";
import axios from "axios";
import colors from "../../colors";
import { Icon } from "../../UIComponents";
import "./Todos.scss";

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WeekStatus = ({ week }) => {
  return weekDays.map((day, index) => {
    let status = false;
    week.forEach(date => {
      if (moment(date).weekday() === index) {
        status = true;
      }
    });
    return (
      <span key={index} className={`${status ? "active" : ""} day`}>
        {day}
      </span>
    );
  });
};

const TodoList = ({ todoList, fetchTodoList, type }) => {
  const markTodo = async (id, type) => {
    await axios.put(`/todos/${id}/stamp`, { date: moment().toDate(), type });
    fetchTodoList();
  };

  const deleteTodo = async id => {
    await axios.delete(`/todos/${id}`);
    fetchTodoList();
  };

  const renderTodoItem = todo => {
    const { stamps = {}, type, frequency, _id, status, task } = todo;
    let todoStatus, info, actionButton;

    if (type === "WEEKLY") {
      let percentRatio,
        fraction,
        markedToday = false;
      const weekNo = moment().week();
      const currentWeekStamps = stamps[`week-${weekNo}`] || [];
      const today = moment().format("DD-MM-YYYY");

      if (currentWeekStamps.length) {
        const lastAttended = moment(
          currentWeekStamps[currentWeekStamps.length - 1]
        ).format("DD-MM-YYYY");
        markedToday = lastAttended === today;
      }
      percentRatio = Math.round((currentWeekStamps.length / frequency) * 100);
      fraction = `${currentWeekStamps.length}/${frequency}`;

      todoStatus = markedToday;
      info = (
        <Fragment>
          <span>{percentRatio}%</span>
          <Divider type="vertical" />
          <span>{fraction}</span>
          <Divider type="vertical" />
          <span>
            <WeekStatus week={currentWeekStamps} />
          </span>
        </Fragment>
      );
    } else {
      // SINGLE
      todoStatus = status === "COMPLETE";
    }

    actionButton = [
      <Icon
        type="check"
        className={todoStatus ? "success" : null}
        onClick={() => (todoStatus ? null : markTodo(_id, type))}
      />,
      <Popconfirm
        placement="bottomRight"
        title="Delete?"
        onConfirm={() => deleteTodo(_id)}
      >
        <Icon type="delete" />
      </Popconfirm>
    ];

    return (
      <List.Item actions={actionButton}>
        <div className="task-container">
          <div className={todoStatus ? "task disabled" : "task"}>{task}</div>
          <div className="info">{info}</div>
        </div>
      </List.Item>
    );
  };

  const todos = todoList.filter(todo => todo.type === type);

  return (
    <List
      className="todo-list"
      style={{ background: colors.white }}
      size="small"
      header={`Todos: ${type}`}
      // footer={<div>Footer</div>}
      bordered
      dataSource={todos}
      renderItem={renderTodoItem}
    />
  );
};

export default TodoList;
