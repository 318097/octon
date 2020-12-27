import React, { useState, useEffect } from "react";
import axios from "axios";

import AddGoal from "./AddGoal";
import GoalList from "./GoalList";
import { PageHeader } from "@codedrops/react-ui";
import "./Goals.scss";

const Goals = () => {
  const [goalList, setGoalList] = useState([]);

  useEffect(() => {
    fetchGoalList();
  }, []);

  const fetchGoalList = async () => {
    const {
      data: { goals },
    } = await axios.get(`goals`);
    setGoalList(goals);
  };

  return (
    <section id="goals">
      <PageHeader
        title={"Goals"}
        actions={<AddGoal fetchGoalList={fetchGoalList} />}
      />
      <GoalList goalList={goalList} fetchGoalList={fetchGoalList} />
    </section>
  );
};

export default Goals;
