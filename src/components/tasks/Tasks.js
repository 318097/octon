import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import axios from "axios";
import { useQuery } from "@apollo/client";
import AddTask from "./AddTask";
import TaskList from "./TaskList";
import { PageHeader } from "@codedrops/react-ui";
import "./Tasks.scss";
import { GET_ALL_TASKS } from "../../graphql/queries";
import _ from "lodash";

const Tasks = () => {
  const { loading, error, data } = useQuery(GET_ALL_TASKS);
  return (
    <section id="tasks">
      <PageHeader
        title={"Tasks"}
        actions={[
          // <Radio.Group
          //   key="todo-type"
          //   className="mr"
          //   defaultValue={todoType}
          //   buttonStyle="solid"
          //   onChange={(e) => setTodoType(e.target.value)}
          // >
          //   <Radio.Button value="SINGLE">SINGLE</Radio.Button>
          //   <Radio.Button value="WEEKLY">WEEKLY</Radio.Button>
          // </Radio.Group>,
          <AddTask key="add-todo" />,
        ]}
      />

      <TaskList todoList={_.get(data, "atom.getAllTasks", [])} />
    </section>
  );
};

export default Tasks;
