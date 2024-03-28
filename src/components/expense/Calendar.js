/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Calendar as CalendarAnt, Tag } from "antd";
import "./Expenses.scss";
import {
  calculateTotalAmount,
  formatNumber,
  processExpenses,
} from "../../lib/utils";

const Calendar = (props) => {
  const { expensesList } = props;

  const { groupedDataSource } = processExpenses({
    ...props,
    dataSource: expensesList,
  });

  const dateCellRender = (value) => {
    const date = value.format("YYYY-MM-DD");
    const expensesByDate = groupedDataSource[date] || [];
    const total = calculateTotalAmount(expensesByDate);
    return total ? (
      <div>
        {expensesByDate.length > 1 ? (
          <div>
            {expensesByDate.map((expense) => (
              <span key={expense._id}>
                <span>{formatNumber(expense.amount)}</span>
                {/* <span>{expense.message}</span> */}
              </span>
            ))}
          </div>
        ) : null}
        <Tag color="gold">{formatNumber(total)}</Tag>
      </div>
    ) : null;
  };

  const cellRender = (current, info) => {
    // console.log("current, info::-", current, info);
    if (info.type === "date") return dateCellRender(current);
    // return info.originNode;
  };

  return (
    <div>
      <CalendarAnt cellRender={cellRender} />
    </div>
  );
};

export default Calendar;
