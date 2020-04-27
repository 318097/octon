import React from "react";
import moment from "moment";
import axios from "axios";
import colors from "../../madDesign/colors";
import { Icon } from "../../UIComponents";
import "./Goals.scss";

const formatDate = (date) => moment(date).format("DD MMM/YY");

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
                  ? colors.yellow
                  : null,
            }}
          >
            <span className="goal">{goal}</span>
            <span className="date">Deadline - {formatDate(deadline)}</span>
            {status === "DONE" ? (
              <span className="date">
                Finished on - {formatDate(finishedOn)}
              </span>
            ) : (
              <span>
                <span className="time">{remainingTime}</span> day(s)
              </span>
            )}

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
