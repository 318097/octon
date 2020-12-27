import React from "react";
import moment from "moment";
import axios from "axios";
import colors, { Icon } from "@codedrops/react-ui";
import "./Goals.scss";

const formatDate = (date) => moment(date).format("DD MMM, YY");

const GoalList = ({ goalList, fetchGoalList }) => {
  const markGoal = async (id) => {
    await axios.put(`/goals/${id}/stamp`, { finishedOn: moment().toDate() });
    fetchGoalList();
  };

  // const deleteGoal = async id => {
  //   await axios.delete(`/goals/${id}`);
  //   fetchGoalList();
  // };

  return (
    <div className="goal-list">
      {goalList.map((item) => {
        const { status, deadline, finishedOn, _id, goal } = item;

        const remainingTime = moment(deadline).diff(moment(), "days");
        const isExpired = moment().isAfter(moment(deadline));

        return (
          <div
            key={_id}
            className="goal-item"
            style={{
              background:
                status === "DONE"
                  ? colors.green
                  : isExpired
                  ? colors.red
                  : null,
            }}
          >
            <div className="goal">{goal}</div>
            <div className="stats">
              <div className="date">{`Deadline: ${formatDate(deadline)}`}</div>
              {status === "DONE" && (
                <div className="date">
                  {`Finished: ${formatDate(finishedOn)}`}
                </div>
              )}
            </div>
            <div className="time">{`${remainingTime} day(s)`}</div>
            {status === "OPEN" && (
              <Icon
                className="check-icon"
                type="check"
                onClick={() => markGoal(_id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;
