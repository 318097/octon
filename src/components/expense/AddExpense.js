/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { Radio, InputNumber, Input, Button, DatePicker, message } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { sendAppNotification } from "../../store/app/actions";
import "./Expenses.scss";
import { CREATE_EXPENSE, UPDATE_EXPENSE } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

const AddExpense = ({
  setAppLoading,
  fetchExpenseByMonth,
  currentExpense,
  setVisibilityStatus,
  mode,
  sendAppNotification,
  expenseTypes,
}) => {
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    expenseTypeId: null,
    expenseSubTypeId: null,
    amount: null,
    message: "",
    date: moment(),
  });

  const [addExpense] = useMutation(CREATE_EXPENSE);
  const [updateExpense] = useMutation(UPDATE_EXPENSE);

  useEffect(() => {
    if (!currentExpense) return;
    setExpense({ ...currentExpense, date: moment(currentExpense.date) });
  }, [currentExpense]);

  const saveExpense = async () => {
    setLoading(true);
    delete expense.__typename;
    try {
      if (mode === "ADD") {
        await addExpense({
          variables: { input: expense },
        });
      } else {
        await updateExpense({
          variables: { input: { _id: expense._id, ...expense } },
        });
        setVisibilityStatus(false);
      }

      setExpense({ ...expense, amount: null, message: null });
      message.success("Success");
      fetchExpenseByMonth();
    } catch (err) {
      console.log("err::-", err);

      sendAppNotification({
        message: err.response.data || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const setData = (key, value) => {
    const data = expense;
    data[key] = value;
    setExpense({ ...data });
  };

  const expenseSubTypes = expenseTypes.filter(
    (item) => item.parentId === expense.expenseTypeId
  );

  return (
    <Fragment>
      <DatePicker
        style={{ width: "130px" }}
        allowClear={false}
        onChange={(date) => setData("date", date)}
        value={expense.date}
        placeholder="Select month"
      />
      <h5 className="mt">Category</h5>
      <Radio.Group
        className="mt"
        value={expense.expenseTypeId}
        onChange={(e) => setData("expenseTypeId", e.target.value)}
      >
        {expenseTypes
          .filter((item) => !item.parentId)
          .map((option) => (
            <Radio key={option._id} value={option._id}>
              {option.label}
            </Radio>
          ))}
      </Radio.Group>

      {expense.expenseTypeId && expenseSubTypes.length ? (
        <Fragment>
          <h5 className="mt">Sub Category</h5>

          <div className="mt">
            <Radio.Group
              value={expense.expenseSubTypeId}
              onChange={(e) => setData("expenseSubTypeId", e.target.value)}
            >
              {expenseSubTypes.map((type) => (
                <Radio key={type._id} value={type._id}>
                  {type.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </Fragment>
      ) : null}
      <div className="mt flex" style={{ alignItems: "stretch" }}>
        <InputNumber
          min={1}
          className="mr"
          placeholder="Amount"
          value={expense.amount}
          onChange={(value) => setData("amount", value)}
        />

        <Input
          size="middle"
          style={{ width: "130px" }}
          placeholder="Message"
          value={expense.message}
          onChange={(e) => setData("message", e.target.value)}
        />
      </div>
      <div className="mt">
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

export default connect(null, {
  sendAppNotification,
})(AddExpense);
