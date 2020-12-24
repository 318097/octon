import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import axios from "axios";

import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import { PageHeader } from "@codedrops/react-ui";
import "./Todos.scss";

const Todos = () => {
  const [todoList, setTodoList] = useState([]);
  const [todoType, setTodoType] = useState("WEEKLY");

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    const {
      data: { todos },
    } = await axios.get(`todos`);
    setTodoList(todos);
  };

  return (
    <section id="todos">
      <PageHeader
        title={
          <div className="fcc">
            <h3 className="underline mr">Todos</h3>
            <Radio.Group
              defaultValue={todoType}
              buttonStyle="solid"
              onChange={(e) => setTodoType(e.target.value)}
            >
              <Radio.Button value="SINGLE">SINGLE</Radio.Button>
              <Radio.Button value="WEEKLY">WEEKLY</Radio.Button>
            </Radio.Group>
          </div>
        }
        actions={<AddTodo fetchTodoList={fetchTodoList} />}
      />

      <TodoList
        todoList={todoList.filter((todo) => todo.type === todoType)}
        fetchTodoList={fetchTodoList}
        type={todoType}
      />
    </section>
  );
};

export default Todos;
