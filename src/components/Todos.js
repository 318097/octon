import React, { useState, useEffect, Fragment } from "react";
import {
  Radio,
  InputNumber,
  Input,
  Modal,
  Icon,
  List,
  Popconfirm,
  Divider
} from "antd";
import moment from "moment";
import axios from "axios";
import "./Todos.scss";

const WeekStatus = ({ week }) => {
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return weekDays.map((day, index) => {
    let status = false;
    week.forEach(date => {
      if (moment(date).weekday() === index) {
        status = true;
      }
    });
    return (
      <span key={index} className={status ? "day active" : "day"}>
        {day}
      </span>
    );
  });
};

const Todos = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoType, setTodoType] = useState("WEEKLY");

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    const {
      data: { todos }
    } = await axios.get(`todos`);
    setTodoList(todos);
  };

  return (
    <section>
      <div className="todo-header">
        <div>
          <h3>Todos</h3>
          <Radio.Group
            defaultValue={todoType}
            buttonStyle="solid"
            onChange={e => setTodoType(e.target.value)}
          >
            <Radio.Button value="SINGLE">SINGLE</Radio.Button>
            <Radio.Button value="WEEKLY">WEEKLY</Radio.Button>
          </Radio.Group>
        </div>
        <AddTodo fetchTodoList={fetchTodoList} />
      </div>

      <TodoList
        todoList={todoList}
        fetchTodoList={fetchTodoList}
        type={todoType}
      />
    </section>
  );
};

const AddTodo = ({ fetchTodoList }) => {
  const [addTodoVisibility, setAddTodoVisibility] = useState(false);
  const [todo, setTodo] = useState({
    type: "SINGLE"
  });

  const setData = (key, value) =>
    setTodo(todo => ({
      ...todo,
      [key]: value
    }));

  const addTodo = async () => {
    await axios.post("/todos", todo);
    fetchTodoList();
    setAddTodoVisibility(false);
  };

  return (
    <Fragment>
      <Icon onClick={() => setAddTodoVisibility(true)} type="plus-circle" />
      <Modal
        visible={addTodoVisibility}
        title="Add Todo"
        onCancel={() => setAddTodoVisibility(false)}
        okText="Add"
        onOk={addTodo}
        width={380}
      >
        <Radio.Group
          className="input"
          defaultValue={todo.type}
          buttonStyle="solid"
          onChange={e => setData("type", e.target.value)}
        >
          <Radio.Button value="SINGLE">Single</Radio.Button>
          <Radio.Button value="WEEKLY">Weekly</Radio.Button>
        </Radio.Group>

        <Input
          className="input"
          placeholder="Task"
          autoFocus
          onChange={e => setData("task", e.target.value)}
        />
        <br />
        {todo.type === "WEEKLY" ? (
          <InputNumber
            className="input"
            min={1}
            placeholder="Frequency"
            onChange={value => setData("frequency", value)}
          />
        ) : null}
      </Modal>
    </Fragment>
  );
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
        weekStatus,
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
        type="check-circle"
        className={todoStatus ? "success" : null}
        onClick={() => (todoStatus ? null : markTodo(_id, type))}
      />,
      <Popconfirm title="Delete?" onConfirm={() => deleteTodo(_id)}>
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
      size="small"
      header={`Todos: ${type}`}
      footer={<div>Footer</div>}
      bordered
      dataSource={todos}
      renderItem={renderTodoItem}
    />
  );
};

export default Todos;
