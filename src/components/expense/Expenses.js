/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker, Card, PageHeader } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import "./Expenses.scss";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import { sendAppNotification, setAppLoading } from "../../store/app/actions";
import _ from "lodash";
import { calculateTotal } from "../../lib/utils";

const { MonthPicker } = DatePicker;

const Expenses = ({ sendAppNotification, setAppLoading, expenseTypes }) => {
  const [expenseList, setExpenseList] = useState([]);
  const [date, setDate] = useState(moment());

  useEffect(() => {
    fetchExpenseByMonth();
  }, [date]);

  const fetchExpenseByMonth = async () => {
    setAppLoading(true);
    try {
      const {
        data: { expenses },
      } = await axios.get(`/expenses/${date.month() + 1}?year=${date.year()}`);
      setExpenseList(expenses);
    } catch (err) {
      sendAppNotification({
        message: err.response.data || err.message,
      });
    } finally {
      setAppLoading(false);
    }
  };

  const total = {};

  expenseTypes
    .filter((item) => !item.parentId)
    .forEach((item) => {
      const { label, _id } = item;
      total[label] = calculateTotal(
        expenseList.filter((item) => item.expenseTypeId === _id)
      );
    });

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
        {summaryItems.map(([id, total]) => (
          <div className="expense-type-block">
            <span className="expense-type-name">{id}</span>
            <span className="expense-type-value">{`₹${total.toLocaleString()}`}</span>
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
          list={expenseList}
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
