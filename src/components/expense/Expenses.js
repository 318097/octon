/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import "./Expenses.scss";
import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
// import Resize from "../utils/Resize";
import { sendAppNotification, setAppLoading } from "../../store/app/actions";
import { PageHeader, Card } from "@codedrops/react-ui";
import { calculateTotal } from "./util";

const { MonthPicker } = DatePicker;

const Expenses = ({ sendAppNotification, setAppLoading }) => {
  const [expenseList, setExpenseList] = useState([]);
  const [total, setTotal] = useState(0);
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
      setTotal(calculateTotal(expenses));
    } catch (err) {
      sendAppNotification({
        message: err.response.data || err.message,
      });
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <section id="expenses">
      <PageHeader title="Expenses" />
      <Card className="card summary">
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
        <div className="monthly-total-stat">{`₹${total}`}</div>
      </Card>
      <Card className="expense-list card">
        <ExpenseList
          list={expenseList}
          fetchExpenseByMonth={fetchExpenseByMonth}
          date={date}
          setAppLoading={setAppLoading}
        />
      </Card>

      <Card className="card add-expense">
        <AddExpense
          setAppLoading={setAppLoading}
          fetchExpenseByMonth={fetchExpenseByMonth}
          mode="ADD"
        />
      </Card>

      {/* <Resize
        modalProps={{
          visible: expenseListVisibilityStatus,
          setVisibility: setExpenseListVisibilityStatus,
          title: "",
          width: 380,
          onCancel: () => setExpenseListVisibilityStatus(false),
          footer: null,
        }}
        component={ExpenseList}
        list={expenseList}
        fetchExpenseByMonth={fetchExpenseByMonth}
        date={date}
        setAppLoading={setAppLoading}
      /> */}
    </section>
  );
};

const mapActionsToProps = {
  sendAppNotification,
  setAppLoading,
};

export default connect(null, mapActionsToProps)(Expenses);
