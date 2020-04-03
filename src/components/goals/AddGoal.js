import React, { useState, Fragment } from "react";
import { DatePicker, Input, Modal } from "antd";
import axios from "axios";
import "./Goals.scss";
import moment from "moment";
import { Icon } from "../../UIComponents";

const { MonthPicker } = DatePicker;

const AddGoal = ({ fetchGoalList }) => {
  const [addGoalVisibility, setAddGoalVisibility] = useState(false);
  const [goalObj, setGoalObj] = useState({
    deadline: moment(),
    type: "DATE",
    goal: ""
  });

  const setData = (key, value) =>
    setGoalObj(prevState => ({
      ...prevState,
      [key]: value
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
        visible={addGoalVisibility}
        title="Add Goal"
        onCancel={() => setAddGoalVisibility(false)}
        okText="Add"
        onOk={addGoal}
        width={380}
      >
        {goalObj.type === "DATE" ? (
          <DatePicker
            className="custom-font input"
            onChange={date => setData("deadline", date)}
          />
        ) : (
          <MonthPicker
            className="custom-font input"
            onChange={date => setData("deadline", date)}
            placeholder="Select month"
          />
        )}
        <Input
          className="custom-font input"
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
