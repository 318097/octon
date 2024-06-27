/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import {
  Radio,
  InputNumber,
  Input,
  Button,
  DatePicker,
  Checkbox,
  Space,
  Tooltip,
} from "antd";
import { EmptyState } from "@codedrops/react-ui";
import dayjs from "dayjs";
import "./Expenses.scss";
import { CREATE_EXPENSE, UPDATE_EXPENSE } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import handleError from "../../lib/errorHandler";
import notify from "../../lib/notify";
import tracking from "../../lib/mixpanel";
import _ from "lodash";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { formatNumber } from "../../lib/utils";

const DEFAULT_VALUES = {
  expenseTypeId: null,
  expenseSubTypeId: null,
  amount: null,
  message: "",
  date: dayjs(),
  favorite: false,
  excluded: false,
};

const AddExpense = ({
  setAppLoading,
  fetchExpenseByMonth,
  currentExpense,
  setVisibilityStatus,
  mode,
  expenseTypes,
  expenseSources,
  expenseGroups,
  expenseCategories,
  expensesList,
}) => {
  const expensesCountBySubType = _.groupBy(expensesList, "expenseSubTypeId");

  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState(DEFAULT_VALUES);

  const [addExpense] = useMutation(CREATE_EXPENSE);
  const [updateExpense] = useMutation(UPDATE_EXPENSE);

  useEffect(() => {
    if (!currentExpense) return;
    setExpense({ ...currentExpense, date: dayjs(currentExpense.date) });
  }, [currentExpense]);

  const saveExpense = async () => {
    setLoading(true);
    delete expense.__typename;
    delete expense.createdAt;
    try {
      if (mode === "ADD") {
        await addExpense({
          variables: { input: expense },
        });
        tracking.track("ADD_EXPENSE");
      } else {
        await updateExpense({
          variables: { input: { _id: expense._id, ...expense } },
        });
        setVisibilityStatus(false);
        tracking.track("UPDATE_EXPENSE");
      }
      setExpense({
        ...expense,
        amount: null,
        message: "",
        favorite: false,
        excluded: false,
        expenseCategoryId: null,
      });
      notify("Success");
      fetchExpenseByMonth();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setExpense(DEFAULT_VALUES);
  };

  const handleDateChange = (value) => {
    const updatedDate = new dayjs(expense.date).add(value, "day");
    setData({ date: updatedDate });
  };

  const setDataDropdown = (update) =>
    setExpense((prev) => {
      const keys = _.keys(update);
      const key = _.first(keys);
      const isSameValue = update[key] === prev[key];
      const mods = {};
      if (isSameValue) {
        mods[key] = null;
        if (keys.includes("expenseSubTypeId")) mods["expenseTypeId"] = null;
      }
      return { ...prev, ...update, ...mods };
    });

  const setData = (update) => setExpense((prev) => ({ ...prev, ...update }));

  const rootExpenseTypes = _.filter(expenseTypes, (type) => !type.parentTagId);
  return (
    <Fragment>
      <div className="flex center gap-4">
        <Button icon={<LeftOutlined />} onClick={() => handleDateChange(-1)} />
        <DatePicker
          style={{ width: "180px" }}
          allowClear={false}
          onChange={(date) => setData({ date })}
          value={expense.date}
          placeholder="Select month"
          format="DD MMM'YY (ddd)"
        />
        <Button icon={<RightOutlined />} onClick={() => handleDateChange(1)} />
      </div>
      <div>
        <div>
          <h5>Type</h5>
          <Space direction="vertical">
            {rootExpenseTypes.map((type) => {
              const expenseSubTypes = _.filter(
                expenseTypes,
                (subType) => subType.parentTagId === type._id && subType.visible
              );
              return (
                <div key={type._id} className="expense-type-item">
                  <div>{type.label}</div>
                  <div className="expense-subtype-container">
                    {expenseSubTypes.length ? (
                      <div className="mt">
                        <div>
                          {expenseSubTypes.map((subType) => {
                            const matchingExpenses = _.get(
                              expensesCountBySubType,
                              subType._id,
                              []
                            );
                            const totalOccurences = _.size(matchingExpenses);
                            const content = (
                              <div>
                                {matchingExpenses.map((expense) => (
                                  <div>{`${dayjs(expense.date).format(
                                    "DD,MMM"
                                  )}, ${formatNumber(expense.amount)}`}</div>
                                ))}
                              </div>
                            );
                            return (
                              <Checkbox
                                key={subType._id}
                                checked={
                                  subType._id === expense.expenseSubTypeId
                                }
                                onChange={() =>
                                  setDataDropdown({
                                    expenseSubTypeId: subType._id,
                                    expenseTypeId: type._id,
                                  })
                                }
                              >
                                {totalOccurences ? (
                                  <Tooltip title={content} placement="bottom">
                                    {subType.label} {`(${totalOccurences})`}
                                  </Tooltip>
                                ) : (
                                  subType.label
                                )}
                              </Checkbox>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <EmptyState style={{ textAlign: "left" }} size="sm" />
                    )}
                  </div>
                </div>
              );
            })}
          </Space>
        </div>
      </div>
      <div>
        <h5>Source</h5>
        <Space direction="vertical">
          {expenseSources.map((option) => (
            <Checkbox
              key={option._id}
              checked={option._id === expense.expenseSourceId}
              onChange={() => setDataDropdown({ expenseSourceId: option._id })}
            >
              {option.label}
            </Checkbox>
          ))}
        </Space>
      </div>

      <div>
        <h5 className="mt">Group</h5>
        <Space direction="vertical">
          {expenseGroups.map((option) => (
            <Checkbox
              key={option._id}
              checked={option._id === expense.expenseGroupId}
              onChange={() => setDataDropdown({ expenseGroupId: option._id })}
            >
              {option.label}
            </Checkbox>
          ))}
        </Space>
      </div>

      <div>
        <h5 className="mt">Category</h5>
        <Space direction="horizontal">
          {expenseCategories.map((option) => (
            <Checkbox
              key={option._id}
              checked={option._id === expense.expenseCategoryId}
              onChange={() =>
                setDataDropdown({ expenseCategoryId: option._id })
              }
            >
              {option.label}
            </Checkbox>
          ))}
        </Space>
      </div>
      <InputNumber
        controls={false}
        className="mr"
        placeholder="Amount"
        value={expense.amount}
        onChange={(amount) => setData({ amount })}
      />

      <Input
        style={{ width: "180px" }}
        placeholder="Message"
        value={expense.message}
        onChange={(e) => setData({ message: e.target.value })}
      />
      <div>
        <Checkbox
          checked={expense.favorite}
          onChange={(e) => setData({ favorite: e.target.checked })}
        >
          Favorite
        </Checkbox>
      </div>
      <div>
        <Checkbox
          checked={expense.excluded}
          onChange={(e) => setData({ excluded: e.target.checked })}
        >
          Excluded
        </Checkbox>
      </div>
      <div className="flex gap-4">
        <Button type="primary" onClick={reset}>
          Clear
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={saveExpense}
          disabled={!expense.amount || !expense.expenseSubTypeId}
        >
          {mode === "ADD" ? "Add" : "Update"}
        </Button>
      </div>
    </Fragment>
  );
};

export default AddExpense;
