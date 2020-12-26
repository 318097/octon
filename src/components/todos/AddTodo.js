import React, { useState, Fragment } from "react";
import { Radio, InputNumber, Input, Modal } from "antd";
import axios from "axios";

import "./Todos.scss";
import { Icon } from "@codedrops/react-ui";

const AddTodo = ({ fetchTodoList }) => {
  const [addTodoVisibility, setAddTodoVisibility] = useState(false);
  const [todo, setTodo] = useState({
    type: "SINGLE",
  });

  const setData = (updatedValue) =>
    setTodo((todo) => ({
      ...todo,
      ...updatedValue,
    }));

  const addTodo = async () => {
    await axios.post("/todos", todo);
    fetchTodoList();
    setAddTodoVisibility(false);
    setData({ task: "" });
  };

  return (
    <Fragment>
      <Icon
        onClick={() => setAddTodoVisibility(true)}
        type="plus"
        background={true}
      />
      <Modal
        wrapClassName="react-ui"
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
          onChange={(e) => setData({ type: e.target.value })}
        >
          <Radio.Button value="SINGLE">Single</Radio.Button>
          <Radio.Button value="WEEKLY">Weekly</Radio.Button>
        </Radio.Group>

        <Input
          className="input"
          placeholder="Task"
          autoFocus
          onChange={(e) => setData({ task: e.target.value })}
        />
        <br />
        {todo.type === "WEEKLY" ? (
          <InputNumber
            className="input"
            min={1}
            placeholder="Frequency"
            onChange={(value) => setData({ frequency: value })}
          />
        ) : null}
      </Modal>
    </Fragment>
  );
};

export default AddTodo;
