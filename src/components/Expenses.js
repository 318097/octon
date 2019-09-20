import React, { useState, useEffect, Fragment } from "react";
import {
  Radio,
  PageHeader,
  InputNumber,
  Input,
  Button,
  Modal,
  DatePicker,
  Icon,
  List,
  message,
  Card,
  Popconfirm,
  Spin
} from "antd";
import moment from "moment";
import axios from "axios";
import "./Expenses.scss";

const { MonthPicker } = DatePicker;

const calculateTotal = expenses =>
  expenses.reduce((acc, { amount }) => amount + acc, 0);

const Expenses = () => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [date, setDate] = useState(moment());
  const [expenseList, setExpenseList] = useState([]);
  const [expense, setExpense] = useState({
    expenseGroup: "PERSONAL"
  });
  const [expenseType, setExpenseType] = useState("");
  const [total, setTotal] = useState(0);

  const [visibility, setVisibility] = useState({
    expenseListModal: false,
    addExpense: false,
    addExpenseType: false,
    editExpenseModal: false
  });
  const [loading, setLoading] = useState({
    addExpense: false,
    fetchExpenses: false,
    fetchExpenseTypes: false
  });

  useEffect(() => {
    fetchExpensesTypes();
    fetchExpenseByMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchExpenseByMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const setVisibilityStatus = (key, value) => {
    setVisibility({
      ...visibility,
      [key]: value
    });
  };

  const setLoadingStatus = (key, value) => {
    setLoading({
      ...loading,
      [key]: value
    });
  };

  const fetchExpenseByMonth = async () => {
    setLoadingStatus("fetchExpenses", true);
    const {
      data: { expenses }
    } = await axios.get(`/expenses/${date.month() + 1}`);
    setExpenseList(expenses);
    setTotal(calculateTotal(expenses));
    setLoadingStatus("fetchExpenses", false);
  };

  const fetchExpensesTypes = async () => {
    setLoadingStatus("fetchExpenseTypes", true);
    const {
      data: { expenseTypes }
    } = await axios.get(`/expenses/types`);
    setExpenseTypes(expenseTypes);
    setData("expenseTypeId", expenseTypes[0]["_id"]);
    setLoadingStatus("fetchExpenseTypes", false);
  };

  const addExpense = async () => {
    setLoadingStatus("addExpense", true);
    await axios.post(`/expenses`, { ...expense });
    setExpense({ ...expense, amount: null, message: null });
    message.success("Success");
    fetchExpenseByMonth();
    setLoadingStatus("addExpense", false);
  };

  const addExpenseType = async () => {
    setLoadingStatus("addExpenseType", true);
    await axios.post(`/expenses/types`, { name: expenseType });
    message.success("Success");
    fetchExpensesTypes();
    setVisibilityStatus("addExpenseType", false);
    setLoadingStatus("addExpenseType", false);
  };

  const setData = (key, value) => {
    const data = expense;
    data[key] = value;
    setExpense({ ...data });
  };

  return (
    <section>
      <Card className="container">
        <PageHeader
          title={
            <Fragment>
              Expenses&nbsp;
              {(loading.fetchExpenseTypes || loading.fetchExpenses) && (
                <Spin size="small" />
              )}
            </Fragment>
          }
          extra={[
            <span key="total" className="total">
              Rs/- {total}
            </span>,
            <Icon
              key="list-expenses"
              onClick={() => setVisibilityStatus("expenseListModal", true)}
              type="wallet"
            />
          ]}
        />
        <MonthPicker
          allowClear={false}
          className="input"
          format="MMM, YYYY"
          onChange={date => setDate(date)}
          value={date}
          placeholder="Select month"
        />

        <Radio.Group
          value={expense.expenseGroup}
          buttonStyle="solid"
          onChange={e => setData("expenseGroup", e.target.value)}
        >
          <Radio.Button value="PERSONAL">Personal</Radio.Button>
          <Radio.Button value="HOME">Home</Radio.Button>
        </Radio.Group>

        <h4>
          Select Type&nbsp;
          {visibility.addExpenseType ? (
            <Icon
              type="minus-circle"
              onClick={() => setVisibilityStatus("addExpenseType", false)}
            />
          ) : (
            <Icon
              type="plus-circle"
              onClick={() => setVisibilityStatus("addExpenseType", true)}
            />
          )}
        </h4>
        {visibility.addExpenseType && (
          <Card className="custom-card">
            <Input
              className="input"
              placeholder="Expense Type"
              onChange={e => setExpenseType(e.target.value)}
            />
            <Button
              className="input"
              onClick={addExpenseType}
              loading={loading.addExpenseType}
            >
              Add
            </Button>
          </Card>
        )}
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
          className="input"
          placeholder="Message"
          value={expense.message}
          onChange={e => setData("message", e.target.value)}
        />
        <br />
        <Button
          className="input"
          type="primary"
          loading={loading.addExpense}
          onClick={addExpense}
        >
          Add
        </Button>
      </Card>

      <ExpenseList
        visibility={visibility}
        setVisibilityStatus={setVisibilityStatus}
        list={expenseList}
        fetchExpenseByMonth={fetchExpenseByMonth}
        date={date}
      />
    </section>
  );
};

const ExpenseList = ({
  visibility,
  setVisibilityStatus,
  fetchExpenseByMonth,
  date,
  list
}) => {
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [total, setTotal] = useState(0);

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

  const deleteExpense = id => async () => {
    await axios.delete(`/expenses/${id}`);
    fetchExpenseByMonth();
  };

  const editExpenseHandler = id => {
    setEditExpenseId(id);
    setVisibilityStatus("editExpenseModal", true);
  };

  const renderItem = row => {
    const date = moment(row.createdAt).format("DD/MM");
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
          <Popconfirm title="Delete?" onConfirm={deleteExpense(row._id)}>
            <Icon key="delete-expense" type="delete" />
          </Popconfirm>
        ]}
      >
        {date}: Rs/-{row.amount} <span className="message">{message}</span>
      </List.Item>
    );
  };

  const expenseTitle = (
    <div className="custom-font">
      Expenses{" "}
      <span className="expense-list-title">({date.format("MMM 'YY")})</span>
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

  return (
    <Modal
      visible={visibility.expenseListModal}
      title={expenseTitle}
      onCancel={() => setVisibilityStatus("expenseListModal", false)}
      footer={actionButton}
      width={380}
    >
      <div className="expense-list">
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
        <span className="custom-font total">Total: {total}</span>
      </div>

      <List
        style={{ maxHeight: "40vh", overflowY: "auto" }}
        itemLayout="horizontal"
        size="small"
        bordered
        dataSource={dataSource}
        renderItem={renderItem}
      />

      {/* <EditExpense /> */}
    </Modal>
  );
};

// const EditExpense = ({ visibility, setVisibilityStatus }) => {
// const updateExpense = async () => {
//   await axios.put(`/expenses/${editExpenseId}`, { ...expense });
//   setVisibilityStatus("editExpenseModal", false);
//   fetchExpenseByMonth();
// };
// return (
//   <Modal
//     visible={visibility.editExpenseModal}
//     title="Edit Expense"
//     onCancel={() => setVisibilityStatus("editExpenseModal", false)}
//     footer={[
//       <Button
//         key="back"
//         onClick={() => setVisibilityStatus("editExpenseModal", false)}
//       >
//         {" "}
//         Cancel
//         </Button>,
//       <Button key="update" type={"primary"} onClick={updateExpense}>
//         Update
//         </Button>
//     ]}
//   />
// )
// };

export default Expenses;
