/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { DatePicker, Card, Spin, PageHeader, Icon } from "antd";
import moment from "moment";
import axios from "axios";
import "./Expenses.scss";

import AddExpense from "./AddExpense";
import ExpenseList from "./ExpenseList";
import Resize from '../utils/Resize';

const { MonthPicker } = DatePicker;

const calculateTotal = expenses =>
  expenses.reduce((acc, { amount }) => amount + acc, 0);

const Expenses = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(moment());
  const [loading, setLoading] = useState(false);

  const [expenseListVisibilityStatus, setExpenseListVisibilityStatus] = useState(false);

  useEffect(() => {
    fetchExpenseByMonth();
  }, []);

  useEffect(() => {
    fetchExpenseByMonth();
  }, [date]);

  const fetchExpenseByMonth = async () => {
    setLoading(true);
    const {
      data: { expenses }
    } = await axios.get(`/expenses/${date.month() + 1}`);
    setExpenseList(expenses);
    setTotal(calculateTotal(expenses));
    setLoading(false);
  };

  return (
    <section id="expenses">
      <Card className="card">
        <PageHeader
          title={
            <Fragment>
              Expenses&nbsp;
              {loading && <Spin size="small" />}
            </Fragment>
          }
          extra={[
            <MonthPicker
              key="month-picker"
              style={{ width: "85px" }}
              allowClear={false}
              format="MMM, YY"
              onChange={date => setDate(date)}
              value={date}
              placeholder="Select month"
            />,
            <span key="total" className="total">
              Rs/- {total}
            </span>,
            <Icon
              key="list-expenses"
              onClick={() => setExpenseListVisibilityStatus(true)}
              type="wallet"
            />
          ]}
        />
        <AddExpense
          setAppLoading={setLoading}
          fetchExpenseByMonth={fetchExpenseByMonth}
          mode="ADD"
        />
      </Card>
      <Resize
        modalProps={{
          visible: expenseListVisibilityStatus,
          setVisibility: setExpenseListVisibilityStatus,
          title: "",
          width: 380,
          onCancel: () => setExpenseListVisibilityStatus(false),
          footer: null
        }}
        component={ExpenseList}
        list={expenseList}
        fetchExpenseByMonth={fetchExpenseByMonth}
        date={date}
        setAppLoading={setLoading}
      />
    </section>
  );
};

export default Expenses;
