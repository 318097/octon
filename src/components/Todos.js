import React, { Fragment, useState, useEffect } from "react";
import {
  Radio,
  PageHeader,
  InputNumber,
  Input,
  Button,
  Modal,
  DatePicker,
  Icon,
  List,
  Popconfirm
} from "antd";
import moment from "moment";
import axios from "axios";
import "./Todos.scss";

const Todos = () => {
  const [todo, setTodo] = useState({
    type: "SINGLE"
  });
  const [todosList, setTodosList] = useState([]);
  const [addTodoVisibility, setAddTodoVisibility] = useState(false);

  useEffect(() => {
    fetchTodosList();
  }, []);

  const fetchTodosList = async () => {
    const {
      data: { todos }
    } = await axios.get(`todos`);
    setTodosList(todos);
  };

  const addTodo = async () => {
    await axios.post("/todos", { ...todo });
    fetchTodosList();
    setAddTodoVisibility(false);
  };

  const setData = (key, value) => {
    const data = todo;
    data[key] = value;
    setTodo({ ...data });
  };

  return (
    <Fragment>
      <TodoHeader setAddTodoVisibility={setAddTodoVisibility} />

      <TodoList
        todosList={todosList}
        fetchTodosList={fetchTodosList}
        type="SINGLE"
      />
      <br />
      <TodoList
        todosList={todosList}
        fetchTodosList={fetchTodosList}
        type="WEEKLY"
      />

      <Modal
        visible={addTodoVisibility}
        title="Add Todo"
        onCancel={() => setAddTodoVisibility(false)}
        okText="Add"
        onOk={addTodo}
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

const TodoHeader = ({ setAddTodoVisibility }) => {
  return (
    <div className="todo-header">
      <h3>Todos</h3>
      <Icon onClick={() => setAddTodoVisibility(true)} type="plus-circle" />
    </div>
  );
};

const TodoList = ({ todosList, fetchTodosList, type }) => {
  const todos = todosList.filter(todo => todo.type === type);

  const markTodo = async (id, type) => {
    await axios.put(`/todos/${id}/stamp`, { date: moment().toDate(), type });
    fetchTodosList();
  };

  const deleteTodo = async id => {
    await axios.delete(`/todos/${id}`);
    fetchTodosList();
  };

  const renderTodoItem = todo => {
    let status, percentRatio;
    if (todo.type === "WEEKLY") {
      let markedToday = false;
      const weekNo = moment().week();
      if (todo["stamps"] && todo["stamps"][`week-${weekNo}`]) {
        const currentWeekStamps = todo["stamps"][`week-${weekNo}`];
        if (currentWeekStamps.length) {
          const lastAttended = moment(
            currentWeekStamps[currentWeekStamps.length - 1]
          ).format("DD-MM-YYYY");
          const today = moment().format("DD-MM-YYYY");
          markedToday = lastAttended === today;
        }

        percentRatio = Math.round(
          (currentWeekStamps.length / todo.frequency) * 100
        );
      }
      status = markedToday;
    } else {
      status = todo.status === "COMPLETE";
    }

    const actionButton = (
      <Icon
        type="check-circle"
        className={status ? "success" : null}
        onClick={() => (status ? null : markTodo(todo._id, todo.type))}
      />
    );

    return (
      <List.Item
        actions={[
          actionButton,
          <Popconfirm title="Delete?" onConfirm={() => deleteTodo(todo._id)}>
            <Icon type="delete" />
          </Popconfirm>
        ]}
      >
        <span className={status ? "disabled" : null}>{todo.task}</span>
        &nbsp;
        {type === "WEEKLY" && (
          <span className="percent-ratio">{percentRatio}%</span>
        )}
      </List.Item>
    );
  };

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
