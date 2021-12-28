import React, { useState, useEffect, Fragment } from "react";
import { Radio, Modal, List, Popconfirm, Checkbox } from "antd";
import moment from "moment";
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
  const { fetchExpenseByMonth, list, setAppLoading, expenseTypes } = props;

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
      setTotal(calculateTotal(data, "amount"));
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

  const renderItem = (row) => {
    const { date, message, amount, expenseSubTypeId, _id, favorite } = row;
    const expenseDate = moment(date).format("DD,MMM");
    const expenseMessage = message ? <span>({message})</span> : null;

    const formatedValue = amount.toLocaleString();
    const expenseSubType = _.get(expenseTypesKeyed, [
      expenseSubTypeId,
      "label",
    ]);

    return (
      <List.Item
        actions={[
          <span>{expenseSubType ? expenseSubType.toUpperCase() : null}</span>,
          <Icon
            key="favorite-expense"
            // type={favorite ? "circle-3" : "circle-2"}
            type={"heart"}
            fill={favorite ? colors.watermelon : colors.strokeTwo}
            size={12}
            onClick={() => toggleFavoriteExpenseHandler(_id, !favorite)}
          />,
          <Icon
            key="edit-expense"
            type="edit"
            size={12}
            onClick={() => editExpenseHandler(_id)}
          />,
          <Popconfirm
            placement="bottomRight"
            title="Delete?"
            key="delete-expense"
            onConfirm={() => handleDelete(_id)}
          >
            <Icon className="mr-0" size={12} type="delete" />
          </Popconfirm>,
        ]}
      >
        <div className="expense-list-container">
          <div>{`${expenseDate}: ₹${formatedValue}`}</div>
          <div className="message">{expenseMessage}</div>
        </div>
      </List.Item>
    );
  };

  const formatedValue = total.toLocaleString();
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
          .filter((item) => !item.parentId)
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
      <div
        style={{ maxHeight: "40vh", overflowY: "auto", paddingRight: "12px" }}
      >
        <List
          itemLayout="horizontal"
          size="small"
          dataSource={dataSource.filter((item) =>
            showFavoritesOnly ? item.favorite : true
          )}
          renderItem={renderItem}
        />
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

export default ExpenseList;
