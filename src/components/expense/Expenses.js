/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { DatePicker, Card, InputNumber, Segmented, Select } from "antd";
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
import { MonthlyBreakdown, SubCategoryBreakdown } from "./Stats";
import handleError from "../../lib/errorHandler";
import tracking from "../../lib/mixpanel";
import Settings from "../settings/Settings";
import Calendar from "./Calendar";
import { formatNumber, getColor } from "../../lib/utils";

const { RangePicker } = DatePicker;

const getCurrentMonthRange = (date) => {
  const [start, end] = date || [];
  const startMonth = start.format("MMM 'YY");
  const endMonth = end.format("MMM 'YY");
  return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;
};

const now = dayjs();

const Summary = ({ filters, expenseTypes, expensesList }) => {
  const summaryItems = _.orderBy(
    expenseTypes
      .filter((expenseType) => expenseType.parentTagId)
      .map((expenseType, idx) => {
        const { label, _id } = expenseType;
        return [
          label,
          {
            color: getColor(idx),
            total: calculateTotal(
              expensesList.filter(
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

  return summaryItems.length && !filters.expenseSubTypeId ? (
    <Fragment>
      <Card className="summary">
        <div className="badge">Summary</div>
        {summaryItems.map(([id, { total, color }]) => (
          <div className="expense-type-block" key={id}>
            <span className="expense-type-name">{id}</span>
            <span
              className="expense-type-value"
              style={{
                color,
              }}
            >
              {formatNumber(total)}
            </span>
          </div>
        ))}
      </Card>
      <Card>
        <SubCategoryBreakdown data={summaryItems} />
      </Card>
    </Fragment>
  ) : null;
};

const Filters = ({ updateFilters, filters, expenseTypes }) => {
  const expenseOptions = expenseTypes
    .filter((expense) => !!expense.parentTagId && expense.visible)
    .map(({ label, _id }) => ({
      label,
      value: _id,
    }));

  return (
    <Card className="filters-container">
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
        style={{ minWidth: 120 }}
        mode="multiple"
        allowClear
        placeholder="Type"
        value={filters.expenseSubTypeId}
        onChange={(expenseSubTypeId) =>
          updateFilters({
            expenseSubTypeId: expenseSubTypeId.length ? expenseSubTypeId : null,
          })
        }
        options={expenseOptions}
      />

      <Select
        style={{ width: 120 }}
        allowClear
        placeholder="Sort"
        value={filters.sort}
        onChange={(sort) => updateFilters({ sort })}
        options={[
          { label: "Amt (Desc)", value: "amount_desc" },
          { label: "Amt (Asc)", value: "amount_asc" },
        ]}
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
    </Card>
  );
};

const Expenses = ({
  setAppLoading,
  expenseTypes,
  expenseSources,
  expenseGroups,
  expenseCategories,
  history,
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
    sort: null,
  });
  const [activePage, setActivePage] = useState("HOME");
  const expensesList = _.get(data, "octon.getExpensesByMonth", []);

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

  const props = {
    fetchExpenseByMonth,
    setAppLoading,
    expenseTypes,
    expenseGroups,
    expenseSources,
    expenseCategories,
    filters,
    expensesList,
    updateFilters,
  };

  const getView = (ids = []) => {
    const view = [
      {
        id: "filters",
        component: <Filters {...props} />,
      },
      {
        id: "stats",
        component: (
          <Card className="stats">
            <div className="badge">Stats</div>
            <MonthlyBreakdown expenseTypes={expenseTypes} />
          </Card>
        ),
      },
      {
        id: "summary",
        component: <Summary {...props} />,
      },
      {
        id: "expense-list",
        component: (
          <Card className="expense-list">
            <div className="badge">{getCurrentMonthRange(filters.date)}</div>
            <ExpenseList {...props} />
          </Card>
        ),
      },
      {
        id: "add-expense",
        component: (
          <Card className="add-expense">
            <div className="badge">Add</div>
            <AddExpense {...props} mode="ADD" />
          </Card>
        ),
      },
      {
        id: "settings",
        component: <Settings />,
      },
      {
        id: "calendar",
        component: <Calendar {...props} />,
      },
    ];
    const viewKeys = _.keyBy(view, "id");

    return ids.map((id) => viewKeys[id].component);
  };

  const mapping = {
    HOME: ["filters", "summary", "expense-list", "stats"],
    ADD: ["add-expense", "filters", "expense-list"],
    MONTH: ["calendar"],
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
