import React, { useState, useEffect } from "react";
import axios from "axios";

import AddGoal from "./AddGoal";
import GoalList from "./GoalList";
import { PageHeader } from "../../UIComponents";
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
      <PageHeader>
        <div className="page-header">
          <h3 className="underline">Goals</h3>
        </div>
        <AddGoal fetchGoalList={fetchGoalList} />
      </PageHeader>
      <GoalList goalList={goalList} fetchGoalList={fetchGoalList} />
    </section>
  );
};

export default Goals;
