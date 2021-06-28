import React, { useState, useEffect } from "react";
import { Modal, Button, PageHeader, Input, Radio } from "antd";
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
  const [temp, setTemp] = useState({});

  useEffect(() => {
    setTemp({
      status: !!_.get(activeDateObj, "match") ? "MARK" : "UNMARK",
      message: _.get(activeDateObj, "match.message", ""),
    });
  }, [activeDateObj]);

  const todoList = _.get(data, "atom.getAllTasks", []);

  const markTodo = async (item, progress = {}) => {
    const { _id, type, status } = item;
    let input = { _id, type };

    if (type === "PROGRESS") {
      const { message, progressItemAction, activeDate, stampId } = progress;

      input = {
        ...input,
        date: activeDate,
        action: progressItemAction,
        stampId,
        message,
      };
    } else {
      input = {
        ...input,
        action: status === "COMPLETED" ? "UNMARK" : "MARK",
        date: moment().toISOString(),
      };
    }

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
        className="page-header"
        ghost={false}
        onBack={null}
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
        wrapClassName="react-ui"
        width={320}
        visible={activeDateObj.activeDate}
        title={_.get(activeDateObj, "task.content")}
        onCancel={() => setActiveDateObj({})}
        footer={null}
      >
        <div className="flex column" style={{ gap: "10px" }}>
          {moment(_.get(activeDateObj, "activeDate")).format("DD MMM, YYYY")}

          <Input
            placeholder="Message"
            value={temp.message}
            onChange={({ target: { value } }) =>
              setTemp((prev) => ({ ...prev, message: value }))
            }
          />

          <Radio.Group
            value={temp.status}
            buttonStyle="solid"
            onChange={(e) =>
              setTemp((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <Radio.Button value="MARK">Mark</Radio.Button>
            <Radio.Button value="UNMARK">Unmark</Radio.Button>
          </Radio.Group>
          <Button
            onClick={() =>
              markTodo(activeDateObj.task, {
                message: temp.message,
                progressItemAction: temp.status,
                activeDate: activeDateObj.activeDate,
                stampId: _.get(activeDateObj, "match._id"),
              })
            }
          >
            Save
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default Tasks;
