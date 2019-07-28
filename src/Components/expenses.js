import React, { Fragment, useState, useEffect } from 'react'
import { Radio, PageHeader, InputNumber, Input, Button, Modal, DatePicker, Icon, List } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './expenses.scss';
import config from '../config';

const { MonthPicker } = DatePicker;

const Expenses = () => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [date, setDate] = useState(moment());
  const [expenseList, setExpenseList] = useState([]);
  const [expenseListModalVisible, setExpenseListModalVisible] = useState(false);
  const [expense, setExpense] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchExpensesTypes();
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data: { expenses } } = await axios.get(`${config.api}expenses`, {
      headers: config.headers
    });
    setExpenseList(expenses);
    calculateTotal();
  }

  const fetchExpensesTypes = async () => {
    const { data: { expenseTypes } } = await axios.get(`${config.api}expenses/types`, {
      headers: config.headers
    });
    setExpenseTypes(expenseTypes);
  }

  const addExpense = async () => {
    const result = await axios.post(`${config.api}/expenses`, { ...expense }, { headers: config.headers });
  };

  const calculateTotal = () => {
    const total = expenseList.reduce((acc, { expense }) => expense + acc, 0);
    setTotal(total);
  };

  const setData = (key, value) => {
    const data = expense;
    data[key] = value;
    setExpense(data);
  }

  return (
    <Fragment>
      <div>
        <PageHeader
          title="Expenses"
          extra={[
            <span className="total">Rs/- {total}</span>,
            <Icon onClick={() => setExpenseListModalVisible(true)} type="container" />,
          ]}
        />
        <MonthPicker className="input" format="MMM, YYYY" onChange={date => setDate(date)} value={date} placeholder="Select month" />
        <h4>Select Type</h4>
        <Radio.Group
          className="input"
          onChange={e => setData('expenseType', e.target.value)}
        >
          {expenseTypes.map(type => <Radio key={type._id} value={type._id}>{type.name}</Radio>)}
        </Radio.Group>
        <br />
        <InputNumber
          className="input"
          size="large"
          min={1}
          placeholder='Amount'
          defaultValue={expense.amount}
          onChange={value => setData('amount', value)}
        />
        <br />
        <Input className="input" size="large" placeholder="Message" onChange={(e) => setData('message', e.target.value)} />
        <br />
        <Button className="input" type="primary" onClick={addExpense}>Add</Button>
      </div>

      <Modal
        visible={expenseListModalVisible}
        title="Expenses"
        onCancel={() => setExpenseListModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setExpenseListModalVisible(false)}>
            Close
            </Button>
        ]}
      >
        <ExpenseList list={expenseList} />
      </Modal>
    </Fragment>
  )
};

const ExpenseList = ({ list }) => {
  const [editExpenseModal, setEditExpenseModal] = useState(false);
  const [deleteExpenseModal, setDeleteExpenseModal] = useState(false);

  const updateExpense = id => {

  };

  const deleteExpense = id => {

  };

  const renderItem = (row) => {
    const date = moment(row.createdAt).format("DD/MM");
    const message = row.message ? <span>({row.message})</span> : null;

    return (
      <List.Item
        actions={[
          <Icon type="edit" onClick={() => setEditExpenseModal(true)} />,
          <Icon type="delete" onClick={() => setDeleteExpenseModal(true)} />
        ]}
      >
        {date}:  Rs/-{row.expense} {message}
      </List.Item>
    );
  };

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        size="small"
        dataSource={list}
        renderItem={renderItem}
      />
      <Modal
        visible={editExpenseModal}
        title="Edit Expense"
        onCancel={() => setEditExpenseModal(false)}
        footer={[
          <Button key="back" onClick={() => setEditExpenseModal(false)}> Cancel</Button>,
          <Button key="back" type={"primary"} onClick={() => updateExpense(false)}>Update</Button>
        ]}
      >
      </Modal>

      <Modal
        visible={deleteExpenseModal}
        title="Delete Expense"
        onCancel={() => setDeleteExpenseModal(false)}
        footer={[
          <Button key="back" onClick={() => setDeleteExpenseModal(false)}> No</Button>,
          <Button key="back" onClick={() => deleteExpense(false)}>Yes</Button>
        ]}
      >
        Confirm deletion?
      </Modal>
    </Fragment>
  );
}

export default Expenses;
