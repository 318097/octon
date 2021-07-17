import React, { Fragment } from "react";
import { Radio, Input, Modal, DatePicker } from "antd";
import { CREATE_TASK } from "../../graphql/mutations";
import { GET_ALL_TASKS } from "../../graphql/queries";
import { useMutation } from "@apollo/client";
import { useObject, useToggle } from "@codedrops/lib";
import tracking from "../../lib/mixpanel";
import "./Tasks.scss";
import { Icon } from "@codedrops/react-ui";

const AddTodo = () => {
  const [addTodoVisibility, , setAddTodoVisibility] = useToggle();
  const [addTask, { loading }] = useMutation(CREATE_TASK);
  const [task, setTask, resetData] = useObject({
    type: "TODO",
  });

  const addTodo = async () => {
    await addTask({
      variables: { input: task },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    });
    setAddTodoVisibility(false);
    tracking.track("ADD_TASK", { type: task.type });
    resetData();
  };

  return (
    <Fragment>
      <Icon onClick={() => setAddTodoVisibility(true)} type="plus" size={12} />
      <Modal
        wrapClassName="react-ui"
        visible={addTodoVisibility}
        title="Add Task"
        onCancel={() => setAddTodoVisibility(false)}
        okText="Add"
        onOk={addTodo}
        width={380}
        confirmLoading={loading}
      >
        <Radio.Group
          value={task.type}
          buttonStyle="solid"
          className="mb"
          onChange={(e) => setTask({ type: e.target.value })}
        >
          <Radio.Button value="TODO">Todo</Radio.Button>
          <Radio.Button value="GOAL">Goal</Radio.Button>
          <Radio.Button value="PROGRESS">Progress</Radio.Button>
        </Radio.Group>
        <br />
        {task.type === "GOAL" && (
          <DatePicker
            onChange={(date) => setTask({ deadline: date })}
            className="mb"
            placeholder="Deadline"
          />
        )}

        <Input
          placeholder="Content"
          autoFocus
          value={task.content}
          onChange={(e) => setTask({ content: e.target.value })}
        />
      </Modal>
    </Fragment>
  );
};

export default AddTodo;
