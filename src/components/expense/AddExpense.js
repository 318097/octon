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
}) => {
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
                        <Radio.Group
                          value={expense.expenseSubTypeId}
                          onChange={(e) =>
                            setData({
                              expenseSubTypeId: e.target.value,
                              expenseTypeId: type._id,
                            })
                          }
                        >
                          <div>
                            {expenseSubTypes.map((subType) => (
                              <Radio key={subType._id} value={subType._id}>
                                {subType.label}
                              </Radio>
                            ))}
                          </div>
                        </Radio.Group>
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
        <Radio.Group
          className="mt"
          value={expense.expenseSourceId}
          onChange={(e) => setData({ expenseSourceId: e.target.value })}
        >
          <Space direction="vertical">
            {expenseSources.map((option) => (
              <Radio key={option._id} value={option._id}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div>
        <h5 className="mt">Group</h5>
        <Radio.Group
          className="mt"
          value={expense.expenseGroupId}
          onChange={(e) => setData({ expenseGroupId: e.target.value })}
        >
          <Space direction="vertical">
            {expenseGroups.map((option) => (
              <Radio key={option._id} value={option._id}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div>
        <h5 className="mt">Category</h5>
        <Radio.Group
          className="mt"
          value={expense.expenseCategoryId}
          onChange={(e) => setData({ expenseCategoryId: e.target.value })}
        >
          <Space direction="horizontal">
            {expenseCategories.map((option) => (
              <Radio key={option._id} value={option._id}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
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
          disabled={!expense.amount || !expense.expenseTypeId}
        >
          {mode === "ADD" ? "Add" : "Update"}
        </Button>
      </div>
    </Fragment>
  );
};

export default AddExpense;
