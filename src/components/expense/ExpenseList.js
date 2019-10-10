import React, { useState, useEffect, Fragment } from "react";
import { Radio, Button, Modal, Icon, List, Popconfirm, Spin } from "antd";
import moment from "moment";
import axios from "axios";
import "./Expenses.scss";

import AddExpense from "./AddExpense";

const calculateTotal = expenses =>
  expenses.reduce((acc, { amount }) => amount + acc, 0);

const ExpenseList = ({ fetchExpenseByMonth, date, list, setAppLoading }) => {
  const [editExpense, setEditExpense] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [visibility, setVisibility] = useState({
    expenseListModal: false,
    editExpenseModal: false
  });

  useEffect(() => {
    const filterData = () => {
      const data =
        filterType === "ALL"
          ? list
          : list.filter(list => list.expenseGroup === filterType);
      setDataSource(data);
      setTotal(calculateTotal(data));
    };

    filterData();
  }, [list, filterType]);

  const setVisibilityStatus = (key, value) => {
    setVisibility({
      ...visibility,
      [key]: value
    });
  };

  const deleteExpense = id => async () => {
    setLoading(true);
    await axios.delete(`/expenses/${id}`);
    fetchExpenseByMonth();
    setLoading(false);
  };

  const editExpenseHandler = id => {
    const [expenseById] = dataSource.filter(expense => expense._id === id);

    setEditExpense({ ...expenseById });
    setVisibilityStatus("editExpenseModal", true);
  };

  const expenseTitle = (
    <div className="custom-font">
      Expenses{" "}
      <span className="expense-list-month">({date.format("MMM 'YY")})</span>
      &nbsp;
      <span>{loading && <Spin size="small" />}</span>
    </div>
  );

  const actionButton = [
    <Button
      key="back"
      onClick={() => setVisibilityStatus("expenseListModal", false)}
    >
      Close
    </Button>
  ];

  const renderItem = row => {
    const date = moment(row.date).format("DD/MM");
    const message = row.message ? <span>({row.message})</span> : null;

    return (
      <List.Item
        className="custom-font"
        actions={[
          <span>{row.expenseType ? row.expenseType.toUpperCase() : null}</span>,
          <Icon
            key="edit-expense"
            type="edit"
            onClick={() => editExpenseHandler(row._id)}
          />,
          <Popconfirm
            placement="bottomRight"
            title="Delete?"
            onConfirm={deleteExpense(row._id)}
          >
            <Icon key="delete-expense" type="delete" />
          </Popconfirm>
        ]}
      >
        <div className="expense-list-container">
          <div>
            {date}: Rs/-{row.amount}
          </div>
          <div className="message">{message}</div>
        </div>
      </List.Item>
    );
  };

  return (
    <Fragment>
      <Icon
        key="list-expenses"
        onClick={() => setVisibilityStatus("expenseListModal", true)}
        type="wallet"
      />
      <Modal
        visible={visibility.expenseListModal}
        title={expenseTitle}
        onCancel={() => setVisibilityStatus("expenseListModal", false)}
        footer={actionButton}
        width={380}
      >
        <div className="flex-row">
          <Radio.Group
            className="custom-font"
            defaultValue={filterType}
            buttonStyle="solid"
            onChange={e => setFilterType(e.target.value)}
          >
            <Radio.Button value="ALL">All</Radio.Button>
            <Radio.Button value="PERSONAL">Personal</Radio.Button>
            <Radio.Button value="HOME">Home</Radio.Button>
          </Radio.Group>
          <span className="custom-font total">Total: Rs/-{total}</span>
        </div>

        <List
          style={{ maxHeight: "40vh", overflowY: "auto" }}
          itemLayout="horizontal"
          size="small"
          bordered
          dataSource={dataSource}
          renderItem={renderItem}
        />
      </Modal>

      <Modal
        visible={visibility.editExpenseModal}
        title="Edit Expense"
        width={380}
        onCancel={() => setVisibilityStatus("editExpenseModal", false)}
        footer={[]}
      >
        <AddExpense
          fetchExpenseByMonth={fetchExpenseByMonth}
          currentExpense={editExpense}
          setVisibilityStatus={setVisibilityStatus}
          mode="EDIT"
          setAppLoading={setAppLoading}
        />
      </Modal>
    </Fragment>
  );
};

export default ExpenseList;
