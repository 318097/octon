import React, { useState, Fragment } from "react";
import { DatePicker, Input, Modal } from "antd";
import axios from "axios";
import "./Goals.scss";
import moment from "moment";
import { Icon } from "@codedrops/react-ui";

const { MonthPicker } = DatePicker;

const AddGoal = ({ fetchGoalList }) => {
  const [addGoalVisibility, setAddGoalVisibility] = useState(false);
  const [goalObj, setGoalObj] = useState({
    deadline: moment(),
    type: "DATE",
    goal: "",
  });

  const setData = (key, value) =>
    setGoalObj((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  const addGoal = async () => {
    await axios.post("/goals", goalObj);
    fetchGoalList();
    setAddGoalVisibility(false);
  };

  return (
    <Fragment>
      <Icon
        background={true}
        onClick={() => setAddGoalVisibility(true)}
        type="plus"
      />
      <Modal
        wrapClassName="react-ui"
        visible={addGoalVisibility}
        title="Add Goal"
        onCancel={() => setAddGoalVisibility(false)}
        okText="Add"
        onOk={addGoal}
        width={380}
      >
        {goalObj.type === "DATE" ? (
          <DatePicker
            onChange={(date) => setData("deadline", date)}
            className="mb"
          />
        ) : (
          <MonthPicker
            onChange={(date) => setData("deadline", date)}
            placeholder="Select month"
          />
        )}
        <Input
          placeholder="Goal"
          autoFocus
          value={goalObj.goal}
          onChange={({ target }) => setData("goal", target.value)}
        />
      </Modal>
    </Fragment>
  );
};

export default AddGoal;
