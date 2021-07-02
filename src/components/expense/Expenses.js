/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker, Card, PageHeader } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_MONTHLY_EXPENSES } from "../../graphql/queries";
import "./Expenses.scss";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import { sendAppNotification, setAppLoading } from "../../store/app/actions";
import _ from "lodash";
import colors from "@codedrops/react-ui";
import { calculateTotal } from "../../lib/utils";
const { MonthPicker } = DatePicker;

const Expenses = ({ sendAppNotification, setAppLoading, expenseTypes }) => {
  const [getExpensesByMonth, { loading, data }] = useLazyQuery(
    GET_MONTHLY_EXPENSES,
    { fetchPolicy: "cache-and-network" }
  );
  const [date, setDate] = useState(moment());
  const input = _.get(data, "atom.getExpensesByMonth", []);

  useEffect(() => {
    fetchExpenseByMonth();
  }, [date]);

  const fetchExpenseByMonth = async () => {
    // setAppLoading(true);
    // try {
    const input = { month: date.month() + 1, year: date.year() };
    getExpensesByMonth({
      variables: { input },
    });
    // } catch (err) {
    //   console.log("err::-", err);

    //   sendAppNotification({
    //     message: err.response.data || err.message,
    //   });
    // } finally {
    //   setAppLoading(false);
    // }
  };

  const total = {};

  expenseTypes
    .filter((item) => !item.parentId)
    .forEach((item) => {
      const { label, _id, success } = item;
      total[label] = {
        success,
        total: calculateTotal(
          input.filter((item) => item.expenseTypeId === _id)
        ),
      };
    });

  console.log("total::-", total);

  const summaryItems = Object.entries(total);
  return (
    <section id="expenses">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Expenses"
      />
      <Card className="summary">
        <MonthPicker
          className="month-picker"
          style={{ width: "100px" }}
          size="small"
          allowClear={false}
          format="MMM, YY"
          onChange={(date) => setDate(date)}
          value={date}
          placeholder="Select month"
        />

        {summaryItems.map(([id, { total, success }]) => (
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
                color: success === "UP" ? colors.green : colors.watermelon,
              }}
            >{`₹${total.toLocaleString()}`}</span>
          </div>
        ))}
      </Card>
      <Card className="add-expense">
        <AddExpense
          setAppLoading={setAppLoading}
          fetchExpenseByMonth={fetchExpenseByMonth}
          mode="ADD"
          expenseTypes={expenseTypes}
        />
      </Card>
      <Card className="expense-list">
        <ExpenseList
          list={input}
          fetchExpenseByMonth={fetchExpenseByMonth}
          date={date}
          setAppLoading={setAppLoading}
          expenseTypes={expenseTypes}
        />
      </Card>
    </section>
  );
};

const mapStateToProps = ({ app }) => ({
  expenseTypes: _.get(app, "session.expenseTypes", []),
});

const mapActionsToProps = {
  sendAppNotification,
  setAppLoading,
};

export default connect(mapStateToProps, mapActionsToProps)(Expenses);
