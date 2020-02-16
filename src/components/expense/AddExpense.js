/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import {
  Radio,
  InputNumber,
  Input,
  Button,
  DatePicker,
  message,
  Card
} from "antd";
import moment from "moment";
import axios from "axios";
import { connect } from "react-redux";

import { Icon } from "../../UIComponents";
import { sendAppNotification } from "../../store/app/actions";

import "./Expenses.scss";

const AddExpense = ({
  setAppLoading,
  fetchExpenseByMonth,
  currentExpense,
  setVisibilityStatus,
  mode,
  sendAppNotification
}) => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    expenseGroup: "PERSONAL",
    expenseTypeId: null,
    amount: null,
    message: "",
    date: moment()
  });

  useEffect(() => {
    fetchExpensesTypes();
  }, []);

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
        message: err.response.data || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesTypes = async () => {
    setAppLoading(true);
    try {
      const {
        data: { expenseTypes }
      } = await axios.get(`/expenses/types`);
      setExpenseTypes(expenseTypes);
      if (mode === "ADD" && expenseTypes.length)
        setData("expenseTypeId", expenseTypes[0]["_id"]);
    } catch (err) {
      sendAppNotification({
        message: err.response.data || err.message
      });
    } finally {
      setAppLoading(false);
    }
  };

  const setData = (key, value) => {
    const data = expense;
    data[key] = value;
    setExpense({ ...data });
  };

  return (
    <Fragment>
      <DatePicker
        allowClear={false}
        className="input"
        onChange={date => setData("date", date)}
        value={expense.date}
        placeholder="Select month"
      />

      <Radio.Group
        className="input"
        value={expense.expenseGroup}
        buttonStyle="solid"
        onChange={e => setData("expenseGroup", e.target.value)}
      >
        <Radio.Button value="PERSONAL">Personal</Radio.Button>
        <Radio.Button value="HOME">Home</Radio.Button>
      </Radio.Group>

      <h4>
        Select Type&nbsp;
        {mode === "ADD" && (
          <AddExpenseType fetchExpensesTypes={fetchExpensesTypes} />
        )}
      </h4>

      <Radio.Group
        className="input"
        value={expense.expenseTypeId}
        onChange={e => setData("expenseTypeId", e.target.value)}
      >
        {expenseTypes.map(type => (
          <Radio key={type._id} value={type._id}>
            {type.name}
          </Radio>
        ))}
      </Radio.Group>
      <br />
      <InputNumber
        className="input"
        min={1}
        placeholder="Amount"
        value={expense.amount}
        onChange={value => setData("amount", value)}
      />
      <br />
      <Input
        className="input input-width"
        placeholder="Message"
        value={expense.message}
        onChange={e => setData("message", e.target.value)}
      />
      <br />
      <Button
        className="input"
        type="primary"
        loading={loading}
        onClick={saveExpense}
        disabled={!expense.amount}
      >
        {mode === "ADD" ? "Add" : "Update"}
      </Button>
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
    fetchExpensesTypes();
    setVisibility(false);
    setLoading(false);
  };

  return (
    <Fragment>
      <Icon
        type={visibility ? "minus" : "plus"}
        onClick={() => setVisibility(prev => !prev)}
      />
      {visibility && (
        <Card className="custom-card">
          <Input
            className="input"
            style={{ width: "70%" }}
            placeholder="Expense Type"
            onChange={e => setExpenseType(e.target.value)}
          />
          <Button className="input" onClick={addExpenseType} loading={loading}>
            Add
          </Button>
        </Card>
      )}
    </Fragment>
  );
};

export default connect(null, {
  sendAppNotification
})(AddExpense);
