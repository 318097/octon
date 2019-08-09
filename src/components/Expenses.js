import React, { Fragment, useState, useEffect } from 'react'
import { Radio, PageHeader, InputNumber, Input, Button, Modal, DatePicker, Icon, List, message, Card, Popconfirm } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './Expenses.scss';

const { MonthPicker } = DatePicker;

const Expenses = () => {
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [date, setDate] = useState(moment());
  const [expenseList, setExpenseList] = useState([]);
  const [expense, setExpense] = useState({
    expenseGroup: 'PERSONAL'
  });
  const [expenseType, setExpenseType] = useState('');
  const [total, setTotal] = useState(0);
  const [visibility, setVisibility] = useState({
    expenseListModal: false,
    addExpenseType: false,
  });

  useEffect(() => {
    fetchExpensesTypes();
    fetchExpenseByMonth();
  }, []);

  const fetchExpenseByMonth = async () => {
    const { data: { expenses } } = await axios.get(`/expenses/${date.month() + 1}`);
    setExpenseList(expenses);
    calculateTotal(expenses);
  }

  const fetchExpensesTypes = async () => {
    const { data: { expenseTypes } } = await axios.get(`/expenses/types`);
    setExpenseTypes(expenseTypes);
  }

  const addExpense = async () => {
    await axios.post(`/expenses`, { ...expense });
    setExpense({});
    message.success('Success');
    fetchExpenseByMonth();
  };

  const addExpenseType = async () => {
    await axios.post(`/expenses/types`, { name: expenseType });
    setVisibilityStatus('addExpenseType', false);
    message.success('Success');
    fetchExpensesTypes();
  };

  const calculateTotal = expenses => {
    const total = expenses.reduce((acc, { amount }) => amount + acc, 0);
    setTotal(total);
  };

  const setData = (key, value) => {
    const data = expense;
    data[key] = value;
    setExpense({ ...data });
  }

  const setVisibilityStatus = (key, value) => {
    setVisibility({
      ...visibility,
      [key]: value
    });
  }

  return (
    <Fragment>
      <Card>
        <PageHeader
          title="Expenses"
          extra={[
            <span key="total" className="total">Rs/- {total}</span>,
            <Icon key="list-expenses" onClick={() => setVisibilityStatus('expenseListModal', true)} type="wallet" />,
          ]}
        />
        <MonthPicker
          className="input"
          format="MMM, YYYY"
          onChange={date => setDate(date)}
          value={date}
          placeholder="Select month"
        />

        <Radio.Group
          value={expense.expenseGroup}
          buttonStyle="solid"
          onChange={e => setData('expenseGroup', e.target.value)}
        >
          <Radio.Button value="PERSONAL">Personal</Radio.Button>
          <Radio.Button value="HOME">Home</Radio.Button>
        </Radio.Group>

        <h4>Select Type&nbsp;
          {visibility.addExpenseType ?
            <Icon type="minus-circle" onClick={() => setVisibilityStatus('addExpenseType', false)} /> :
            <Icon type="plus-circle" onClick={() => setVisibilityStatus('addExpenseType', true)} />
          }
        </h4>
        {
          visibility.addExpenseType && (
            <Card className="custom-card">
              <Input
                className="input"
                placeholder="Expense Type"
                onChange={(e) => setExpenseType(e.target.value)}
              />
              <Button
                className="input"
                onClick={addExpenseType}
              >Add</Button>
            </Card>
          )
        }
        <Radio.Group
          className="input"
          onChange={e => setData('expenseTypeId', e.target.value)}
        >
          {expenseTypes.map(type => <Radio key={type._id} value={type._id}>{type.name}</Radio>)}
        </Radio.Group>
        <br />
        <InputNumber
          className="input"
          min={1}
          placeholder='Amount'
          value={expense.amount}
          onChange={value => setData('amount', value)}
        />
        <br />
        <Input
          className="input"
          placeholder="Message"
          value={expense.message}
          onChange={(e) => setData('message', e.target.value)}
        />
        <br />
        <Button
          className="input"
          type="primary"
          onClick={addExpense}
        >Add</Button>
      </Card>

      <Modal
        visible={visibility.expenseListModal}
        title="Expenses"
        onCancel={() => setVisibilityStatus('expenseListModal', false)}
        footer={[
          <Button key="back" onClick={() => setVisibilityStatus('expenseListModal', false)}>
            Close
          </Button>
        ]}
      >
        <ExpenseList
          list={expenseList}
          fetchExpenseByMonth={fetchExpenseByMonth}
        />
      </Modal>
    </Fragment>
  )
};

const ExpenseList = ({ list, fetchExpenseByMonth }) => {
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [expense, setExpense] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [visibility, setVisibility] = useState({
    editExpenseModal: false,
  });

  useEffect(() => {
    filterData();
  }, [list, filterType])

  const filterData = () => {
    const data = filterType === 'ALL' ? list : list.filter(list => list.expenseGroup === filterType);
    setDataSource(data);
  };

  const setVisibilityStatus = (key, value) => {
    setVisibility({
      ...visibility,
      [key]: value
    });
  };

  const updateExpense = async () => {
    await axios.put(`/expenses/${editExpenseId}`, { ...expense });
    setVisibilityStatus('editExpenseModal', false);
    fetchExpenseByMonth();
  };

  const deleteExpense = id => async () => {
    await axios.delete(`/expenses/${id}`);
    setVisibilityStatus('deleteExpenseModal', false);
    fetchExpenseByMonth();
  };

  const editExpenseHandler = (id) => {
    setEditExpenseId(id);
    setVisibilityStatus('editExpenseModal', true);
  };

  const renderItem = (row) => {
    const date = moment(row.createdAt).format("DD/MM");
    const message = row.message ? <span>({row.message})</span> : null;

    return (
      <List.Item
        actions={[
          <span>{row.expenseType ? row.expenseType.toUpperCase() : null}</span>,
          <Icon key="edit-expense" type="edit" onClick={() => editExpenseHandler(row._id)} />,
          <Popconfirm
            title="Delete?"
            onConfirm={deleteExpense(row._id)}
          >
            <Icon key="delete-expense" type="delete" />
          </Popconfirm>
        ]}
      >
        {date}:  Rs/-{row.amount} <span className="message">{message}</span>
      </List.Item>
    );
  };

  return (
    <Fragment>
      <Radio.Group
        style={{ marginBottom: '5px' }}
        defaultValue={filterType}
        buttonStyle="solid"
        onChange={e => setFilterType(e.target.value)}
      >
        <Radio.Button value="ALL">All</Radio.Button>
        <Radio.Button value="PERSONAL">Personal</Radio.Button>
        <Radio.Button value="HOME">Home</Radio.Button>
      </Radio.Group>

      <List
        itemLayout="horizontal"
        size="small"
        bordered
        dataSource={dataSource}
        renderItem={renderItem}
      />

      <Modal
        visible={visibility.editExpenseModal}
        title="Edit Expense"
        onCancel={() => setVisibilityStatus('editExpenseModal', false)}
        footer={[
          <Button key="back" onClick={() => setVisibilityStatus('editExpenseModal', false)}> Cancel</Button>,
          <Button key="update" type={"primary"} onClick={updateExpense}>Update</Button>
        ]}
      >
      </Modal>
    </Fragment>
  );
}

export default Expenses;
