/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker, Card, Button, InputNumber } from "antd";
import dayjs from "dayjs";
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
import tracking from "../../lib/mixpanel";
import { PageHeader } from "../../lib/UI";

const { RangePicker } = DatePicker;

const getCurrentMonthRange = (date) => {
  const [start, end] = date || [];
  const startMonth = start.format("MMM 'YY");
  const endMonth = end.format("MMM 'YY");
  return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
};

const now = dayjs();

const Expenses = ({
  setAppLoading,
  expenseTypes,
  expenseSources,
  expenseGroups,
}) => {
  const [getExpensesByMonth, { data, loading }] = useLazyQuery(
    GET_MONTHLY_EXPENSES,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [filters, setFilters] = useState({
    date: [now, now],
    monthsRange: null,
    minAmount: null,
  });
  const [showStats, setShowStats] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(true);
  const input = _.get(data, "octon.getExpensesByMonth", []);

  const updateFilters = (update) => {
    setFilters((prev) => ({ ...prev, ...update }));
    // setShowAddExpense(false);
  };

  useEffect(() => {
    fetchExpenseByMonth();
  }, [filters]);

  useEffect(() => {
    setAppLoading(loading);
  }, [loading]);

  const fetchExpenseByMonth = async () => {
    try {
      const { date = [], minAmount } = filters || {};

      const [s, e] = date;
      const input = {
        minAmount: Number(minAmount),
        startMonth: `${s.month() + 1}-${s.year()}`,
        endMonth: `${e.month() + 1}-${e.year()}`,
      };
      getExpensesByMonth({
        variables: { input },
      });
    } catch (error) {
      handleError(error);
    }
  };

  const total = {};

  const rootExpenseTypes = expenseTypes.filter((item) => !item.parentTagId);

  rootExpenseTypes.forEach((item) => {
    const { label, _id, success, color } = item;
    total[label] = {
      success,
      color,
      total: calculateTotal(
        input.filter((item) => item.expenseTypeId === _id && !item.excluded),
        "amount"
      ),
    };
  });

  // const summaryItems = Object.entries(total);

  const currentMonthRange = getCurrentMonthRange(filters.date);

  const props = {
    fetchExpenseByMonth,
    setAppLoading,
    expenseTypes,
    expenseGroups,
    expenseSources,
  };

  return (
    <section id="expenses">
      <div className="filters-container">
        <RangePicker
          picker="month"
          style={{ width: "180px" }}
          allowClear={false}
          format={"MMM'YY"}
          onChange={(date) => {
            updateFilters({ date });
          }}
          value={filters.date}
          placeholder="Months range"
          maxDate={now}
        />

        <Button key="stats" onClick={() => setShowStats((prev) => !prev)}>
          Stats
        </Button>

        <InputNumber
          placeholder="Min amount"
          value={filters.minAmount}
          onBlur={(e) => updateFilters({ minAmount: e.target.value })}
          controls={false}
        />
        {/* <Button
          key="reports"
          onClick={() => setShowAddExpense((prev) => !prev)}
        >
          +
        </Button> */}
      </div>

      {showStats && (
        <Card className="stats">
          <span className="badge">Stats</span>
          <Stats rootExpenseTypes={rootExpenseTypes} />
        </Card>
      )}

      {/* <Card className="summary">
        <span className="badge">Summary</span>
        {summaryItems.map(([id, { total, success, color }]) => (
          <div
            className="expense-type-block"
            key={id}
            style={{
              flex: summaryItems.length % 3 === 0 ? "30%" : "auto",
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
              />
            </span>
          </div>
        ))}
      </Card> */}

      <Card className="expense-list">
        <span className="badge">{currentMonthRange}</span>
        <ExpenseList {...props} list={input} />
      </Card>

      {showAddExpense && (
        <Card className="add-expense">
          <span className="badge">Add</span>
          <AddExpense {...props} mode="ADD" />
        </Card>
      )}
    </section>
  );
};

const mapStateToProps = ({ session }) => ({
  expenseTypes: _.get(session, "expenseTypes", []),
  expenseGroups: _.get(session, "expenseGroups", []),
  expenseSources: _.get(session, "expenseSources", []),
});

const mapActionsToProps = {
  setAppLoading,
};

export default connect(mapStateToProps, mapActionsToProps)(Expenses);
