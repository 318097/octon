import React, { Fragment, useState, useEffect } from 'react';
import { Radio, PageHeader, InputNumber, Input, Button, Modal, DatePicker, Icon, List } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './Todos.scss';

const Todos = () => {
  const [todo, setTodo] = useState({});
  const [todosList, setTodosList] = useState([]);
  const [addTodoVisibility, setAddTodoVisibility] = useState(false);

  useEffect(() => {
    fetchTodosList();
  }, []);

  const fetchTodosList = async () => {
    const { data: { todos } } = await axios.get(`todos`);
    setTodosList(todos);
  };

  const markTodo = async id => {
    await axios.put(`/todos/${id}/stamp`, { date: moment().toDate() });
    fetchTodosList();
  };

  const renderTodoItem = (todo) => {
    const weekNo = moment().week();
    let markedToday = false;
    if (todo['stamps'] && todo['stamps'][`week-${weekNo}`]) {
      const currentWeekStamps = todo['stamps'][`week-${weekNo}`];
      if (currentWeekStamps.length) {
        const lastAttended = moment(currentWeekStamps.pop()).format('DD-MM-YYYY');
        const today = moment().format('DD-MM-YYYY');
        markedToday = lastAttended === today;
      }
    }
    const actionButton = markedToday ? null : <Icon type="check-circle" onClick={() => markTodo(todo._id)} />
    return (
      <List.Item
        className={markedToday ? 'disabled' : 'null'}
        actions={[actionButton]}
      >
        {todo.task}
      </List.Item>
    );
  }

  const addTodo = async () => {
    await axios.post('/todos', { ...todo })
    fetchTodosList();
    setAddTodoVisibility(false);
  }

  const setData = (key, value) => {
    const data = todo;
    data[key] = value;
    setTodo({ ...data });
  };

  return (
    <Fragment>
      <List
        size="small"
        header={<TodoHeader setAddTodoVisibility={setAddTodoVisibility} />}
        footer={<div>Footer</div>}
        bordered
        dataSource={todosList}
        renderItem={renderTodoItem}
      />
      <Modal
        visible={addTodoVisibility}
        title="Add Todo"
        onCancel={() => setAddTodoVisibility(false)}
        footer={[
          <Button key="back" onClick={() => setAddTodoVisibility(false)}>Cancel</Button>,
          <Button key="add" onClick={addTodo}>Add</Button>
        ]}
      >
        <Radio.Group
          className="input"
          defaultValue={todo.type}
          buttonStyle="solid"
          onChange={e => setData('type', e.target.value)}
        >
          <Radio.Button value="SINGLE">Single</Radio.Button>
          <Radio.Button value="WEEKLY">Weekly</Radio.Button>
        </Radio.Group>

        <Input
          className="input"
          size="large"
          placeholder="Todo"
          onChange={(e) => setData('task', e.target.value)}
        />
        <br />
        {
          todo.type === 'WEEKLY' ? (
            <InputNumber
              className="input"
              size="large"
              min={1}
              placeholder='Frequency'
              onChange={value => setData('frequency', value)}
            />
          ) : null
        }
      </Modal>
    </Fragment>
  );
}

const TodoHeader = ({ setAddTodoVisibility }) => {
  return (
    <div className="todo-header">
      <h3>Todos: Weekly</h3>
      <Icon
        onClick={() => setAddTodoVisibility(true)}
        type="plus-circle" />
    </div>
  );
}

export default Todos;