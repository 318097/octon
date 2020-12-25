import React, { useState, useEffect, Fragment } from "react";
import { Radio, Modal, List, Popconfirm } from "antd";
import moment from "moment";
import axios from "axios";
import { calculateTotal } from "./util";
import { Icon, PageHeader } from "@codedrops/react-ui";
import "./Expenses.scss";
import AddExpense from "./AddExpense";

const ExpenseList = ({ fetchExpenseByMonth, date, list, setAppLoading }) => {
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
    const date = moment(row.date).format("DD/MM");
    const message = row.message ? <span>({row.message})</span> : null;

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
      <PageHeader
        title={
          <div className="expense-list-header  ">
            <h3>
              Expenses <span className="month">({date.format("MMM 'YY")})</span>
            </h3>
          </div>
        }
      />

      <PageHeader
        title={
          <Radio.Group
            defaultValue={filterType}
            buttonStyle="solid"
            onChange={({ target: { value } }) => setFilterType(value)}
          >
            <Radio.Button value="ALL">All</Radio.Button>
            <Radio.Button value="PERSONAL">Personal</Radio.Button>
            <Radio.Button value="HOME">Home</Radio.Button>
          </Radio.Group>
        }
        actions={<span className="  total">Total: Rs/-{total}</span>}
      />

      <List
        style={{ maxHeight: "50vh", overflowY: "auto" }}
        itemLayout="horizontal"
        size="small"
        bordered
        dataSource={dataSource}
        renderItem={renderItem}
      />

      <Modal
        visible={editExpenseVisibility}
        title="Edit Expense"
        width={380}
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
