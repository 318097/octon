import React, { useState, useEffect } from "react";
import { Radio } from "antd";
import axios from "axios";

import AddTodo from "./AddTodo";
import TodoList from "./TodoList";
import { PageHeader } from "../../UIComponents";
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
      <PageHeader>
        <div className="page-header">
          <h3 className="custom-header">Todos</h3>
          <Radio.Group
            defaultValue={todoType}
            buttonStyle="solid"
            onChange={(e) => setTodoType(e.target.value)}
          >
            <Radio.Button value="SINGLE">SINGLE</Radio.Button>
            <Radio.Button value="WEEKLY">WEEKLY</Radio.Button>
          </Radio.Group>
        </div>
        <AddTodo fetchTodoList={fetchTodoList} />
      </PageHeader>

      <TodoList
        todoList={todoList.filter((todo) => todo.type === todoType)}
        fetchTodoList={fetchTodoList}
        type={todoType}
      />
    </section>
  );
};

export default Todos;
