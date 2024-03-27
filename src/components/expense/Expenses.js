/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { DatePicker, Card, Button, InputNumber, Segmented, Select } from "antd";
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
import Settings from "../settings/Settings";
import { formatNumber } from "../../lib/utils";

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
  expenseCategories,
  history,
  ...rest
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
    maxAmount: null,
    expenseSubTypeId: null,
  });
  const [activePage, setActivePage] = useState("HOME");
  const input = _.get(data, "octon.getExpensesByMonth", []);

  const updateFilters = (update) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  useEffect(() => {
    fetchExpenseByMonth();
  }, [filters]);

  useEffect(() => {
    setAppLoading(loading);
  }, [loading]);

  useEffect(() => {
    const hash = history.location.hash.slice(1);
    if (hash) setActivePage(hash);
  }, [history.location.hash]);

  const fetchExpenseByMonth = async () => {
    try {
      const {
        date = [],
        minAmount,
        maxAmount,
        expenseSubTypeId,
      } = filters || {};

      const [s, e] = date;
      const input = {
        minAmount: Number(minAmount),
        maxAmount: Number(maxAmount),
        expenseSubTypeId,
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

  const summaryItems = _.orderBy(
    expenseTypes
      .filter((expense) => expense.parentTagId)
      .map((expense) => {
        const { label, _id, parentTagId } = expense;
        const parentIdColor = rootExpenseTypes.find(
          (expense) => expense._id === parentTagId
        )?.["color"];

        return [
          label,
          {
            color: parentIdColor,
            total: calculateTotal(
              input.filter(
                (expense) =>
                  expense.expenseSubTypeId === _id && !expense.excluded
              ),
              "amount"
            ),
          },
        ];
      })
      .filter(([label, { total }]) => !!total),
    (obj) => obj[1].total,
    "desc"
  );

  const currentMonthRange = getCurrentMonthRange(filters.date);

  const props = {
    fetchExpenseByMonth,
    setAppLoading,
    expenseTypes,
    expenseGroups,
    expenseSources,
    expenseCategories,
    filters,
  };

  const expenseOptions = expenseTypes
    .filter((expense) => !!expense.parentTagId && expense.visible)
    .map(({ label, _id }) => ({
      label,
      value: _id,
    }));

  const getView = (ids = []) => {
    const view = [
      {
        id: "filters",
        component: (
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
            <Select
              style={{ width: 120 }}
              allowClear
              placeholder="Type"
              value={filters.expenseSubTypeId}
              onChange={(expenseSubTypeId) =>
                updateFilters({ expenseSubTypeId })
              }
              options={expenseOptions}
            />

            <InputNumber
              placeholder="Min"
              value={filters.minAmount}
              onBlur={(e) => updateFilters({ minAmount: e.target.value })}
              controls={false}
              style={{ width: 80 }}
            />
            <InputNumber
              placeholder="Max"
              value={filters.maxAmount}
              onBlur={(e) => updateFilters({ maxAmount: e.target.value })}
              controls={false}
              style={{ width: 80 }}
            />
          </div>
        ),
      },
      {
        id: "stats",
        component: (
          <Card className="stats">
            <span className="badge">Stats</span>
            <Stats
              rootExpenseTypes={rootExpenseTypes}
              expenseTypes={expenseTypes}
            />
          </Card>
        ),
      },
      {
        id: "summary",
        component:
          summaryItems.length && !filters.expenseSubTypeId ? (
            <Card className="summary">
              <span className="badge">Summary</span>
              {summaryItems.map(([id, { total, success, color }]) => (
                <div className="expense-type-block" key={id}>
                  <span className="expense-type-name">{id}</span>
                  <span
                    className="expense-type-value"
                    style={{
                      color: colors[color],
                    }}
                  >
                    {formatNumber(total)}
                    <Icon
                      type="caret"
                      size={8}
                      fill={colors.strokeThree}
                      direction={success === "UP" ? "up" : "down"}
                    />
                  </span>
                </div>
              ))}
            </Card>
          ) : null,
      },
      {
        id: "expense-list",
        component: (
          <Card className="expense-list">
            <span className="badge">{currentMonthRange}</span>
            <ExpenseList {...props} list={input} />
          </Card>
        ),
      },
      {
        id: "add-expense",
        component: (
          <Card className="add-expense">
            <span className="badge">Add</span>
            <AddExpense {...props} mode="ADD" />
          </Card>
        ),
      },
      {
        id: "settings",
        component: <Settings />,
      },
    ];
    const viewKeys = _.keyBy(view, "id");
    // .filter((obj) => ids.includes(obj.id))
    // .map((obj) => obj.component);

    return ids.map((id) => viewKeys[id].component);
  };

  const mapping = {
    HOME: ["filters", "summary", "expense-list", "stats"],
    ADD: ["add-expense", "filters", "expense-list"],
    MONTH: [],
    SETTINGS: ["settings"],
  };

  return (
    <section id="expenses">
      {getView(mapping[activePage])}
      <div className="menu">
        <Segmented
          options={[
            { label: "Home", value: "HOME" },
            { label: "Add", value: "ADD" },
            { label: "Month", value: "MONTH" },
            { label: "Settings", value: "SETTINGS" },
          ]}
          value={activePage}
          onChange={(activePage) => history.push(`/expenses#${activePage}`)}
        />
      </div>
    </section>
  );
};

const mapStateToProps = ({ session }) => ({
  expenseTypes: _.get(session, "expenseTypes", []),
  expenseGroups: _.get(session, "expenseGroups", []),
  expenseCategories: _.get(session, "expenseCategories", []),
  expenseSources: _.get(session, "expenseSources", []),
});

const mapActionsToProps = {
  setAppLoading,
};

export default connect(mapStateToProps, mapActionsToProps)(Expenses);
