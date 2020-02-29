import React, { Fragment } from "react";
import moment from "moment";
import axios from "axios";

import { Icon } from "../../UIComponents";
import "./Goals.scss";

const GoalList = ({ goalList, fetchGoalList }) => {
  const markGoal = async id => {
    await axios.put(`/goals/${id}/stamp`, { finishedOn: moment().toDate() });
    fetchGoalList();
  };

  // const deleteGoal = async id => {
  //   await axios.delete(`/goals/${id}`);
  //   fetchGoalList();
  // };

  return (
    <div className="goal-list">
      {goalList.map(item => {
        const { status, deadline, finishedOn } = item;
        let remainingTime;

        const isExpired = moment().isAfter(moment(deadline));
        const goalOpen = !isExpired && status === "OPEN";

        if (goalOpen) remainingTime = moment(deadline).diff(moment(), "days");
        return (
          <div
            key={item._id}
            className="goal-item"
            style={{
              background:
                status === "DONE" ? "#54ca54" : isExpired ? "tomato" : null
            }}
          >
            <span className="goal">{item.goal}</span>
            {status === "DONE" ? (
              <Fragment>
                <span className="date">
                  Finished on - {moment(finishedOn).format("DD MMM, YYYY")}
                </span>
                <span className="date">
                  Deadline - {moment(deadline).format("DD MMM, YYYY")}
                </span>
              </Fragment>
            ) : goalOpen ? (
              <span>
                <span className="time">{remainingTime}</span> day(s)
              </span>
            ) : (
              <span className="date">
                Deadline - {moment(deadline).format("DD MMM, YYYY")}
              </span>
            )}
            {goalOpen && (
              <Icon
                className="check-icon"
                type="check"
                onClick={() => markGoal(item._id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;
