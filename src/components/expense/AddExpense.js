/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { Radio, InputNumber, Input, Button, DatePicker, message } from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";
import { Icon } from "@codedrops/react-ui";
import { sendAppNotification } from "../../store/app/actions";
import "./Expenses.scss";

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

  useEffect(() => {
    if (!currentExpense) return;
    setExpense({ ...currentExpense, date: moment(currentExpense.date) });
  }, [currentExpense]);

  const saveExpense = async () => {
    setLoading(true);
    try {
      if (mode === "ADD") await axios.post(`/expenses`, { ...expense });
      else await axios.put(`/expenses/${expense._id}`, { ...expense });

      setExpense({ ...expense, amount: null, message: null });
      if (mode === "EDIT") setVisibilityStatus(false);
      message.success("Success");
      fetchExpenseByMonth();
    } catch (err) {
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

  return (
    <Fragment>
      {/* {mode === "ADD" ? <h4>Add expense</h4> : null} */}
      <DatePicker
        style={{ width: "130px" }}
        allowClear={false}
        onChange={(date) => setData("date", date)}
        value={expense.date}
        placeholder="Select month"
      />

      <Radio.Group
        className="mt"
        value={expense.expenseTypeId}
        onChange={(e) => setData("expenseTypeId", e.target.value)}
      >
        {expenseTypes
          .filter((item) => !item.parentId)
          .map((option) => (
            <Radio value={option._id}>{option.label}</Radio>
          ))}
      </Radio.Group>

      <div className="mt">
        <h4>
          <span className="mr-4">Sub Category</span>
          {/* {mode === "ADD" && (
            <AddExpenseType fetchExpensesTypes={fetchExpensesTypes} />
          )} */}
        </h4>
      </div>

      <div className="mt">
        <Radio.Group
          value={expense.expenseSubTypeId}
          onChange={(e) => setData("expenseSubTypeId", e.target.value)}
        >
          {expenseTypes
            .filter((item) => item.parentId === expense.expenseTypeId)
            .map((type) => (
              <Radio key={type._id} value={type._id}>
                {type.label}
              </Radio>
            ))}
        </Radio.Group>
      </div>

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
          disabled={!expense.amount}
        >
          {mode === "ADD" ? "Add" : "Update"}
        </Button>
      </div>
    </Fragment>
  );
};

const AddExpenseType = ({ fetchExpensesTypes }) => {
  const [expenseType, setExpenseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);

  const addExpenseType = async () => {
    setLoading(true);
    await axios.post(`/expenses/types`, { name: expenseType });
    message.success("Success");
    await fetchExpensesTypes();
    setVisibility(false);
    setLoading(false);
  };

  return (
    <Fragment>
      <Icon
        hover
        size={8}
        type={visibility ? "minus" : "plus"}
        onClick={() => setVisibility((prev) => !prev)}
      />
      {visibility && (
        <div
          className="add-type-card flex mt"
          style={{ alignItems: "stretch" }}
        >
          <Input
            size="small"
            style={{ width: "150px" }}
            placeholder="Name"
            className="mr"
            onChange={(e) => setExpenseType(e.target.value)}
          />
          <Button size="small" onClick={addExpenseType} loading={loading}>
            Add
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default connect(null, {
  sendAppNotification,
})(AddExpense);
