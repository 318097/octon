import React, { useState, useEffect } from "react";
import { Modal, Button, PageHeader } from "antd";
import axios from "axios";
import { useQuery, useMutation } from "@apollo/client";
import AddTask from "./AddTask";
// import { PageHeader } from "@codedrops/react-ui";
import "./Tasks.scss";
import { GET_ALL_TASKS } from "../../graphql/queries";
import _ from "lodash";
import { STAMP_TASK } from "../../graphql/mutations";
import Task from "./Task";
import moment from "moment";

const Tasks = () => {
  const { loading, error, data } = useQuery(GET_ALL_TASKS);
  const [stampTask, updatedTask] = useMutation(STAMP_TASK);
  const [activeDateObj, setActiveDateObj] = useState({});

  const todoList = _.get(data, "atom.getAllTasks", []);

  const markTodo = async (item) => {
    const { _id, type, marked, status, activeDate, stampId } = item;
    let action, date;
    if (type === "PROGRESS") {
      action = marked ? "UNMARK" : "MARK";
      date = activeDate;
    } else {
      action = status === "COMPLETED" ? "UNMARK" : "MARK";
      date = moment().toISOString();
    }

    const input = { _id, type, date, action, stampId };

    stampTask({
      variables: { input },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    });
    setActiveDateObj({});
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/tasks/${id}`);
    //  fetchTodoList();
  };

  return (
    <section id="tasks">
      <PageHeader
        ghost={false}
        // className="site-page-header"
        onBack={() => null}
        title="Tasks"
        extra={[<AddTask key="add-todo" />]}
      />
      {/* <PageHeader
        title={"Tasks"}
        extra={[
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
      /> */}
      {todoList.map((item) => (
        <Task
          item={item}
          markTodo={markTodo}
          deleteTodo={deleteTodo}
          setActiveDateObj={setActiveDateObj}
        />
      ))}
      <Modal
        width={320}
        visible={activeDateObj.activeDate}
        title={_.get(activeDateObj, "task.content")}
        onCancel={() => setActiveDateObj({})}
        footer={null}
      >
        {moment(_.get(activeDateObj, "activeDate")).format("DD MMM, YYYY")}
        <br />
        {_.get(activeDateObj, "match.message", "No Message")}
        <br />
        <Button
          onClick={() =>
            markTodo({
              ...activeDateObj.task,
              marked: !!activeDateObj.match,
              activeDate: activeDateObj.activeDate,
              stampId: _.get(activeDateObj, "match._id"),
            })
          }
        >
          {_.get(activeDateObj, "match") ? "Unmark" : "Mark"}
        </Button>
      </Modal>
    </section>
  );
};

export default Tasks;
