import React, { useState, Fragment } from "react";
import { Radio, InputNumber, Input, Modal, DatePicker } from "antd";
import { CREATE_TASK } from "../../graphql/mutations";
import { GET_ALL_TASKS } from "../../graphql/queries";
import { useMutation } from "@apollo/client";

import "./Tasks.scss";
import { Icon } from "@codedrops/react-ui";

const AddTodo = () => {
  const [addTodoVisibility, setAddTodoVisibility] = useState(false);
  const [addTask, newTask] = useMutation(CREATE_TASK);
  const [task, setTask] = useState({
    type: "TODO",
  });

  const setData = (updatedValue) =>
    setTask((task) => ({
      ...task,
      ...updatedValue,
    }));

  const addTodo = async () => {
    await addTask({
      variables: { input: task },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    });
    setAddTodoVisibility(false);
    setTask({});
  };

  return (
    <Fragment>
      <Icon onClick={() => setAddTodoVisibility(true)} type="plus" size={12} />
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
          value={task.type}
          buttonStyle="solid"
          className="mb"
          onChange={(e) => setData({ type: e.target.value })}
        >
          <Radio.Button value="TODO">Todo</Radio.Button>
          <Radio.Button value="GOAL">Goal</Radio.Button>
          <Radio.Button value="PROGRESS">Progress</Radio.Button>
        </Radio.Group>

        {/* <Radio.Group
          defaultValue={task.type}
          buttonStyle="solid"
          className="mb"
          onChange={(e) => setData({ type: e.target.value })}
        >
          <Radio.Button value="SINGLE">Single</Radio.Button>
          <Radio.Button value="WEEKLY">Weekly</Radio.Button>
        </Radio.Group> */}
        <br />
        {task.type === "GOAL" && (
          <DatePicker
            onChange={(date) => setData({ deadline: date })}
            className="mb"
            placeholder="Deadline"
          />
        )}

        <Input
          placeholder="Content"
          autoFocus
          value={task.content}
          onChange={(e) => setData({ content: e.target.value })}
        />
        <br />
        {/* {task.type === "WEEKLY" ? (
          <InputNumber
            min={1}
            className="mt"
            placeholder="Frequency"
            onChange={(value) => setData({ frequency: value })}
          />
        ) : null} */}
      </Modal>
    </Fragment>
  );
};

export default AddTodo;
