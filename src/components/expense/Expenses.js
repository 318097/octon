/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker, Card, PageHeader, Button } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_MONTHLY_EXPENSES } from "../../graphql/queries";
import "./Expenses.scss";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import { setAppLoading } from "../../store/actions";
import _ from "lodash";
import { calculateTotal } from "@codedrops/lib";
import colors, { Icon } from "@codedrops/react-ui";
import Stats from "./Stats";
import handleError from "../../lib/errorHandler";

const { MonthPicker } = DatePicker;

const Expenses = ({ setAppLoading, expenseTypes }) => {
  const [getExpensesByMonth, { loading, data }] = useLazyQuery(
    GET_MONTHLY_EXPENSES,
    { fetchPolicy: "cache-and-network" }
  );
  const [date, setDate] = useState(moment());
  const [showStats, setShowStats] = useState(false);
  const input = _.get(data, "atom.getExpensesByMonth", []);

  useEffect(() => {
    fetchExpenseByMonth();
  }, [date]);

  const fetchExpenseByMonth = async () => {
    // setAppLoading(true);
    try {
      const input = { month: date.month() + 1, year: date.year() };
      getExpensesByMonth({
        variables: { input },
      });
    } catch (error) {
      handleError(error);
    } finally {
      // setAppLoading(false);
    }
  };

  const total = {};

  const rootExpenseTypes = expenseTypes.filter((item) => !item.parentId);

  rootExpenseTypes.forEach((item) => {
    const { label, _id, success, color } = item;
    total[label] = {
      success,
      color,
      total: calculateTotal(
        input.filter((item) => item.expenseTypeId === _id),
        "amount"
      ),
    };
  });

  const summaryItems = Object.entries(total);
  return (
    <section id="expenses">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Expenses"
        extra={[
          <Button
            key="stats"
            size="small"
            onClick={() => setShowStats((prev) => !prev)}
          >
            Stats
          </Button>,
          <MonthPicker
            key="month-picker"
            style={{ width: "100px" }}
            size="small"
            allowClear={false}
            format="MMM, YY"
            onChange={(date) => setDate(date)}
            value={date}
            placeholder="Select month"
          />,
        ]}
      />

      {showStats && (
        <Card className="stats">
          <span className="badge">Stats</span>
          <Stats rootExpenseTypes={rootExpenseTypes} />
        </Card>
      )}

      <Card className="summary">
        <span className="badge">Summary</span>
        {summaryItems.map(([id, { total, success, color }]) => (
          <div
            className="expense-type-block"
            key={id}
            style={{
              flex:
                summaryItems.length % 3 === 0
                  ? "30%"
                  : summaryItems.length === 4
                  ? "45%"
                  : "auto",
            }}
          >
            <span className="expense-type-name">{id}</span>
            <span
              className="expense-type-value"
              style={{
                color: colors[color],
              }}
            >
              {`₹${total.toLocaleString()}`}
              <Icon
                type="caret"
                size={8}
                fill={colors.strokeThree}
                direction={success === "UP" ? "up" : "down"}
              />{" "}
            </span>
          </div>
        ))}
      </Card>

      <Card className="add-expense">
        <span className="badge">Add</span>
        <AddExpense
          setAppLoading={setAppLoading}
          fetchExpenseByMonth={fetchExpenseByMonth}
          mode="ADD"
          expenseTypes={expenseTypes}
        />
      </Card>
      <Card className="expense-list">
        <span className="badge">{date.format("MMM 'YY")}</span>
        <ExpenseList
          list={input}
          fetchExpenseByMonth={fetchExpenseByMonth}
          setAppLoading={setAppLoading}
          expenseTypes={expenseTypes}
        />
      </Card>
    </section>
  );
};

const mapStateToProps = ({ session }) => ({
  expenseTypes: _.get(session, "expenseTypes", []),
});

const mapActionsToProps = {
  setAppLoading,
};

export default connect(mapStateToProps, mapActionsToProps)(Expenses);
