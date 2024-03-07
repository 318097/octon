import React, { useState, useEffect, Fragment } from "react";
import { Radio, Modal, Popconfirm, Checkbox, Tag, Card, Empty } from "antd";
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

const today = dayjs().format("YYYY-MM-DD");

const ExpenseList = (props) => {
  const {
    fetchExpenseByMonth,
    list,
    setAppLoading,
    expenseTypes,
    expenseSources,
    expenseGroups,
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
  const expenseGroupsKeyed = _.keyBy(expenseGroups, "_id");

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
      expenseGroup: _.get(expenseGroupsKeyed, [item.expenseGroupId, "label"]),
      expenseDate: dayjs(item.date).format("YYYY-MM-DD"),
    }));

  const groupedDataSource = _.groupBy(
    filteredDataSource,
    (expense) => expense.expenseDate
  );

  const sortedGroupKeys = _.orderBy(
    Object.keys(groupedDataSource),
    null,
    "desc"
  );

  return (
    <Fragment>
      <Radio.Group
        defaultValue={filterType}
        buttonStyle="solid"
        onChange={({ target: { value } }) => setFilterType(value)}
      >
        <Radio.Button value="ALL">All</Radio.Button>
        {expenseTypes
          .filter((item) => !item.parentTagId)
          .map((option) => {
            // const optionTotal = summaryTotal[option.label].total;
            return (
              <Radio.Button value={option._id} key={option._id}>
                {option.label}
              </Radio.Button>
            );
          })}
      </Radio.Group>
      <div className="flex center gap-8 mt mb">
        <div className="total">Total: ₹{formatedValue}</div> |
        <Checkbox
          checked={showFavoritesOnly}
          onChange={(e) => setShowFavoritesOnly(e.target.checked)}
        >
          Favorites
        </Checkbox>
      </div>

      {filteredDataSource.length ? (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          {sortedGroupKeys.map((groupKey) => {
            const parsedGroupKey = dayjs(groupKey, "YYYY-MM-DD").format(
              "DD,MMM"
            );
            const filteredExpenses = _.orderBy(
              groupedDataSource[groupKey],
              "createdAt",
              "asc"
            );
            const groupTotal = groupedDataSource[groupKey].reduce(
              (total, expense) => total + expense.amount,
              0
            );
            const hasMultipleExpenses = groupedDataSource[groupKey].length > 1;
            return (
              <div className="expense-group-container">
                <div
                  className="group-key"
                  // style={{
                  //   borderBottom: hasMultipleExpenses
                  //     ? "1px dashed gray"
                  //     : "none",
                  // }}
                >
                  {parsedGroupKey}
                  {hasMultipleExpenses ? (
                    <Tag color="gold">{`₹${groupTotal.toLocaleString()}`}</Tag>
                  ) : (
                    ""
                  )}
                </div>
                <div className="group-body">
                  {filteredExpenses.map((expense) => (
                    <ExpenseItem
                      key={expense._id}
                      item={expense}
                      toggleFavoriteExpenseHandler={
                        toggleFavoriteExpenseHandler
                      }
                      editExpenseHandler={editExpenseHandler}
                      handleDelete={handleDelete}
                      showBullet={hasMultipleExpenses}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty />
      )}
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
  showBullet,
}) => {
  const {
    message,
    amount,
    expenseSubType,
    _id,
    favorite,
    expenseSource,
    expenseGroup,
    excluded,
    createdAt,
  } = item;
  const expenseMessage = message ? <span>({message})</span> : null;

  const formatedValue = amount.toLocaleString();

  const content = [
    {
      comp: (
        <Tag bordered={false} color="red">
          {expenseSubType}
        </Tag>
      ),
      visible: !!expenseSubType,
    },
    {
      comp: (
        <Tag bordered={false} color="red">
          {expenseSource}
        </Tag>
      ),
      visible: !!expenseSource,
    },
    {
      comp: (
        <Tag bordered={false} color="red">
          {expenseGroup}
        </Tag>
      ),
      visible: !!expenseGroup,
    },
  ].filter((obj) => obj.visible);

  const isNew = dayjs(createdAt).format("YYYY-MM-DD") === today;
  return (
    <div
      className="expense-item"
      style={{ background: excluded ? "#eee" : "" }}
    >
      <div>
        <div className="amount">
          {showBullet && <div>◦</div>}₹{formatedValue}
          {isNew && <span className="dot" />}
        </div>
        <div className="message">{expenseMessage}</div>
        <div className="expense-actions">{content.map((obj) => obj.comp)}</div>
      </div>
      <div className="expense-actions">
        <Icon
          key="favorite-expense"
          type={"heart"}
          fill={favorite ? colors.watermelon : colors.strokeTwo}
          size={12}
          onClick={() => toggleFavoriteExpenseHandler(_id, !favorite)}
        />

        <Icon
          key="edit-expense"
          type="edit"
          size={12}
          onClick={() => editExpenseHandler(_id)}
        />
        <Popconfirm
          placement="bottomRight"
          title="Delete?"
          key="delete-expense"
          onConfirm={() => handleDelete(_id)}
        >
          <Icon className="mr-0" size={12} type="delete" />
        </Popconfirm>
      </div>
    </div>
  );
};

export default ExpenseList;
