import React, { useState, useEffect, Fragment } from "react";
import { Radio, Modal, Popconfirm, Checkbox, Tag, Card } from "antd";
import dayjs from "dayjs";
import { calculateTotal } from "@codedrops/lib";
import colors, { Icon } from "@codedrops/react-ui";
import _ from "lodash";
import "./Expenses.scss";
import AddExpense from "./AddExpense";
import {
  DELETE_EXPENSE,
  TOGGLE_FAVORITE_EXPENSE,
} from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import tracking from "../../lib/mixpanel";

const ExpenseList = (props) => {
  const {
    fetchExpenseByMonth,
    list,
    setAppLoading,
    expenseTypes,
    expenseSources,
    expenseApps,
  } = props;

  const [editExpense, setEditExpense] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [total, setTotal] = useState(0);
  const [editExpenseVisibility, setEditExpenseVisibility] = useState(false);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [toggleFavoriteExpense] = useMutation(TOGGLE_FAVORITE_EXPENSE);

  useEffect(() => {
    const filterData = () => {
      const data =
        filterType === "ALL"
          ? list
          : list.filter((list) => list.expenseTypeId === filterType);
      setDataSource(data);
      setTotal(
        calculateTotal(
          data.filter((obj) => !obj.excluded),
          "amount"
        )
      );
    };

    filterData();
  }, [list, filterType]);

  const handleDelete = async (_id) => {
    setAppLoading(true);
    await deleteExpense({
      variables: { input: { _id } },
    });
    await fetchExpenseByMonth();
    setAppLoading(false);
    tracking.track("DELETE_EXPENSE");
  };

  const editExpenseHandler = (_id) => {
    const [expenseById] = dataSource.filter((expense) => expense._id === _id);

    setEditExpense({ ...expenseById });
    setEditExpenseVisibility(true);
  };

  const toggleFavoriteExpenseHandler = async (_id, status) => {
    setAppLoading(true);
    await toggleFavoriteExpense({
      variables: { input: { _id, status } },
    });
    await fetchExpenseByMonth();
    setAppLoading(false);
  };

  const expenseTypesKeyed = _.keyBy(expenseTypes, "_id");
  const expenseSourcesKeyed = _.keyBy(expenseSources, "_id");
  const expenseAppsKeyed = _.keyBy(expenseApps, "_id");

  const formatedValue = total.toLocaleString();
  const filteredDataSource = dataSource
    .filter((item) => (showFavoritesOnly ? item.favorite : true))
    .map((item) => ({
      ...item,
      expenseSubType: _.get(expenseTypesKeyed, [
        item.expenseSubTypeId,
        "label",
      ]),
      expenseSource: _.get(expenseSourcesKeyed, [
        item.expenseSourceId,
        "label",
      ]),
      expenseApp: _.get(expenseAppsKeyed, [item.expenseAppId, "label"]),
    }));
  return (
    <Fragment>
      <Radio.Group
        defaultValue={filterType}
        className="mb"
        buttonStyle="solid"
        size="small"
        onChange={({ target: { value } }) => setFilterType(value)}
      >
        <Radio.Button value="ALL">All</Radio.Button>
        {expenseTypes
          .filter((item) => !item.parentTagId)
          .map((option) => (
            <Radio.Button value={option._id} key={option._id}>
              {option.label}
            </Radio.Button>
          ))}
      </Radio.Group>
      <br />
      <Checkbox
        checked={showFavoritesOnly}
        onChange={(e) => setShowFavoritesOnly(e.target.checked)}
      >
        Favorites
      </Checkbox>

      <div className="mb mt total">Total: ₹{formatedValue}</div>
      <div className="list-wrapper">
        {filteredDataSource.map((item) => (
          <ExpenseItem
            key={item._id}
            item={item}
            toggleFavoriteExpenseHandler={toggleFavoriteExpenseHandler}
            editExpenseHandler={editExpenseHandler}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      <Modal
        wrapClassName="react-ui"
        visible={editExpenseVisibility}
        title="Edit Expense"
        width={400}
        onCancel={() => setEditExpenseVisibility(false)}
        footer={[]}
      >
        <AddExpense
          {...props}
          currentExpense={editExpense}
          setVisibilityStatus={setEditExpenseVisibility}
          mode="EDIT"
        />
      </Modal>
    </Fragment>
  );
};

const ExpenseItem = ({
  item,
  toggleFavoriteExpenseHandler,
  editExpenseHandler,
  handleDelete,
}) => {
  const {
    date,
    message,
    amount,
    expenseSubType,
    _id,
    favorite,
    expenseSource,
    expenseApp,
    excluded,
  } = item;
  const expenseDate = dayjs(date).format("DD,MMM");
  const expenseMessage = message ? <span>({message})</span> : null;

  const formatedValue = amount.toLocaleString();

  const content = [
    { comp: <Tag>{expenseSource}</Tag>, visible: !!expenseSource },
    { comp: <Tag>{expenseApp}</Tag>, visible: !!expenseApp },
    { comp: <Tag>{expenseSubType}</Tag>, visible: !!expenseSubType },
    {
      comp: (
        <Icon
          key="favorite-expense"
          type={"heart"}
          fill={favorite ? colors.watermelon : colors.strokeTwo}
          size={12}
          onClick={() => toggleFavoriteExpenseHandler(_id, !favorite)}
        />
      ),
      visible: true,
    },
    {
      comp: (
        <Icon
          key="edit-expense"
          type="edit"
          size={12}
          onClick={() => editExpenseHandler(_id)}
        />
      ),
      visible: true,
    },
    {
      comp: (
        <Popconfirm
          placement="bottomRight"
          title="Delete?"
          key="delete-expense"
          onConfirm={() => handleDelete(_id)}
        >
          <Icon className="mr-0" size={12} type="delete" />
        </Popconfirm>
      ),
      visible: true,
    },
  ].filter((obj) => obj.visible);
  return (
    <Card
      className={"expense-item"}
      style={{ background: excluded ? "#eee" : "" }}
    >
      <div className="expense-list-container">
        <div>{`${expenseDate}: ₹${formatedValue}`}</div>
        <div className="message">{expenseMessage}</div>
      </div>
      <div className="expense-actions">{content.map((obj) => obj.comp)}</div>
    </Card>
  );
};

export default ExpenseList;
