import React, { useState, useEffect, Fragment } from "react";
import { Radio, Modal, List, Popconfirm } from "antd";
import moment from "moment";
import axios from "axios";
import { calculateTotal } from "./util";
import { Icon } from "@codedrops/react-ui";
import "./Expenses.scss";
import AddExpense from "./AddExpense";

const ExpenseList = ({
  fetchExpenseByMonth,
  date,
  list,
  setAppLoading,
  expenseTypes,
}) => {
  const [editExpense, setEditExpense] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [total, setTotal] = useState(0);
  const [editExpenseVisibility, setEditExpenseVisibility] = useState(false);

  useEffect(() => {
    const filterData = () => {
      const data =
        filterType === "ALL"
          ? list
          : list.filter((list) => list.expenseGroup === filterType);
      setDataSource(data);
      setTotal(calculateTotal(data));
    };

    filterData();
  }, [list, filterType]);

  const deleteExpense = (id) => async () => {
    setAppLoading(true);
    await axios.delete(`/expenses/${id}`);
    await fetchExpenseByMonth();
    setAppLoading(false);
  };

  const editExpenseHandler = (id) => {
    const [expenseById] = dataSource.filter((expense) => expense._id === id);

    setEditExpense({ ...expenseById });
    setEditExpenseVisibility(true);
  };

  const renderItem = (row) => {
    const date = moment(row.date).format("DD,MMM");
    const message = row.message ? <span>({row.message})</span> : null;

    const formatedValue = row.amount.toLocaleString();
    return (
      <List.Item
        actions={[
          <span>{row.expenseType ? row.expenseType.toUpperCase() : null}</span>,
          <Icon
            key="edit-expense"
            type="edit"
            size={12}
            onClick={() => editExpenseHandler(row._id)}
          />,
          <Popconfirm
            placement="bottomRight"
            title="Delete?"
            onConfirm={deleteExpense(row._id)}
          >
            <Icon size={12} key="delete-expense" type="delete" />
          </Popconfirm>,
        ]}
      >
        <div className="expense-list-container">
          <div>{`${date}: ₹${formatedValue}`}</div>
          <div className="message">{message}</div>
        </div>
      </List.Item>
    );
  };

  const formatedValue = total.toLocaleString();
  return (
    <Fragment>
      <span className="badge">({date.format("MMM 'YY")})</span>

      <Radio.Group
        defaultValue={filterType}
        className="mb"
        buttonStyle="solid"
        size="small"
        onChange={({ target: { value } }) => setFilterType(value)}
      >
        <Radio.Button value="ALL">All</Radio.Button>
        {expenseTypes
          .filter((item) => !item.parentId)
          .map((option) => (
            <Radio.Button value={option._id}>{option.label}</Radio.Button>
          ))}
      </Radio.Group>
      <div className="mb total">Total: ₹{formatedValue}</div>

      <List
        style={{ maxHeight: "40vh", overflowY: "auto" }}
        itemLayout="horizontal"
        size="small"
        bordered
        dataSource={dataSource}
        renderItem={renderItem}
      />

      <Modal
        wrapClassName="react-ui"
        visible={editExpenseVisibility}
        title="Edit Expense"
        width={400}
        onCancel={() => setEditExpenseVisibility(false)}
        footer={[]}
      >
        <AddExpense
          fetchExpenseByMonth={fetchExpenseByMonth}
          currentExpense={editExpense}
          setVisibilityStatus={setEditExpenseVisibility}
          mode="EDIT"
          setAppLoading={setAppLoading}
        />
      </Modal>
    </Fragment>
  );
};

export default ExpenseList;
