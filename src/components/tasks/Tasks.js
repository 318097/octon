import React, { useState, useEffect } from "react";
import { Modal, PageHeader, Input, Radio } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import AddTask from "./AddTask";
import "./Tasks.scss";
import { GET_ALL_TASKS } from "../../graphql/queries";
import _ from "lodash";
import { STAMP_TASK, DELETE_TASK } from "../../graphql/mutations";
import Task from "./Task";
import moment from "moment";

const Tasks = () => {
  const { loading, error, data } = useQuery(GET_ALL_TASKS);
  const [stampTask] = useMutation(STAMP_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const [activeDateObj, setActiveDateObj] = useState({});

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

  const deleteTodo = async (_id) => {
    deleteTask({
      variables: { input: { _id } },
      refetchQueries: [{ query: GET_ALL_TASKS }],
    });
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
      {todoList.map((item) => (
        <Task
          key={item._id}
          item={item}
          markTodo={markTodo}
          deleteTodo={deleteTodo}
          setActiveDateObj={setActiveDateObj}
        />
      ))}

      <TaskDetail
        activeDateObj={activeDateObj}
        setActiveDateObj={setActiveDateObj}
        markTodo={markTodo}
      />
    </section>
  );
};

const TaskDetail = ({ activeDateObj, setActiveDateObj, markTodo }) => {
  const [temp, setTemp] = useState({});

  useEffect(() => {
    if (activeDateObj.visible)
      setTemp({
        status: !!_.get(activeDateObj, "match") ? "MARK" : "UNMARK",
        message: _.get(activeDateObj, "match.message", ""),
      });
  }, [activeDateObj]);

  const handleOk = () =>
    markTodo(activeDateObj.task, {
      message: temp.message,
      progressItemAction: temp.status,
      activeDate: activeDateObj.activeDate,
      stampId: _.get(activeDateObj, "match._id"),
    });

  const taskName = _.get(activeDateObj, "task.content");
  const taskType = _.get(activeDateObj, "task.type");
  const date = moment(_.get(activeDateObj, "activeDate")).format(
    "DD MMM, YYYY"
  );

  return (
    <Modal
      wrapClassName="react-ui"
      width={320}
      visible={activeDateObj.activeDate}
      title={taskType}
      onCancel={() => setActiveDateObj({})}
      onOk={handleOk}
      okText="Save"
    >
      <div className="flex column" style={{ gap: "10px" }}>
        <div className="task">{taskName}</div>
        <div className="task">{date}</div>

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
      </div>
    </Modal>
  );
};

export default Tasks;
