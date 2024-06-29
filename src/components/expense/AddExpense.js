/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import {
  InputNumber,
  Button,
  DatePicker,
  Checkbox,
  Space,
  Tooltip,
  AutoComplete,
  Modal,
} from "antd";
import { EmptyState } from "@codedrops/react-ui";
import dayjs from "dayjs";
import "./Expenses.scss";
import { CREATE_EXPENSE, UPDATE_EXPENSE } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import handleError from "../../lib/errorHandler";
import notify from "../../lib/notify";
import tracking from "../../lib/mixpanel";
import _ from "lodash";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { formatNumber } from "../../lib/utils";
import { updateUserSettings } from "../../store/actions";
import { connect } from "react-redux";
import Settings from "../settings/Settings";
import { MODAL_PROPS } from "../../config";

const DEFAULT_VALUES = {
  expenseTypeId: null,
  expenseSubTypeId: null,
  amount: null,
  message: "",
  date: dayjs(),
  favorite: false,
  excluded: false,
};

const AddExpense = ({
  setAppLoading,
  fetchExpenseByMonth,
  currentExpense,
  setVisibilityStatus,
  mode,
  expenseTypes,
  expenseSources,
  expenseGroups,
  expenseCategories,
  expensesList,
  updateUserSettings,
  session,
}) => {
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState(DEFAULT_VALUES);
  const [settingsModalVisible, setSettingsModalVisibility] = useState();
  const [moduleId, setModuleId] = useState();

  const [addExpense] = useMutation(CREATE_EXPENSE);
  const [updateExpense] = useMutation(UPDATE_EXPENSE);

  useEffect(() => {
    if (!currentExpense) return;
    setExpense({ ...currentExpense, date: dayjs(currentExpense.date) });
  }, [currentExpense]);

  const saveExpense = async () => {
    setLoading(true);
    delete expense.__typename;
    delete expense.createdAt;
    try {
      if (mode === "ADD") {
        await addExpense({
          variables: { input: expense },
        });
        tracking.track("ADD_EXPENSE");
      } else {
        await updateExpense({
          variables: { input: { _id: expense._id, ...expense } },
        });
        setVisibilityStatus(false);
        tracking.track("UPDATE_EXPENSE");
      }
      setExpense({
        ...expense,
        amount: null,
        message: "",
        favorite: false,
        excluded: false,
        expenseCategoryId: null,
      });
      notify("Success");
      fetchExpenseByMonth();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setExpense(DEFAULT_VALUES);
  };

  const handleDateChange = (value) => {
    const updatedDate = new dayjs(expense.date).add(value, "day");
    setData({ date: updatedDate });
  };

  const setDataDropdown = (update) =>
    setExpense((prev) => {
      const keys = _.keys(update);
      const key = _.first(keys);
      const isSameValue = update[key] === prev[key];
      const mods = {};
      if (isSameValue) {
        mods[key] = null;
        if (keys.includes("expenseSubTypeId")) mods["expenseTypeId"] = null;
      }
      return { ...prev, ...update, ...mods };
    });

  const setData = (update) => setExpense((prev) => ({ ...prev, ...update }));

  const openSettingsModal = (moduleId) => {
    setModuleId(moduleId);
    setSettingsModalVisibility(true);
  };

  const rootExpenseTypes = _.filter(
    expenseTypes,
    (type) => !type.parentTagId && type.visible
  );

  const autofillOptions = _.get(session, "autofill", []).map((value) => ({
    value,
  }));

  return (
    <Fragment>
      <div className="flex center gap-4">
        <Button icon={<LeftOutlined />} onClick={() => handleDateChange(-1)} />
        <DatePicker
          style={{ width: "180px" }}
          allowClear={false}
          onChange={(date) => setData({ date })}
          value={expense.date}
          placeholder="Select month"
          format="DD MMM'YY (ddd)"
        />
        <Button icon={<RightOutlined />} onClick={() => handleDateChange(1)} />
      </div>
      <div>
        <div>
          <h5 onClick={() => openSettingsModal("EXPENSE_TYPES")}>Type</h5>
          <Space direction="vertical">
            {rootExpenseTypes.map((type) => {
              const expenseSubTypes = _.filter(
                expenseTypes,
                (subType) => subType.parentTagId === type._id && subType.visible
              );
              return (
                <div key={type._id} className="expense-type-item">
                  <div>{type.label}</div>
                  <div className="expense-subtype-container">
                    <CheckboxOption
                      updateUserSettings={updateUserSettings}
                      options={expenseSubTypes}
                      optionsBreakdown={_.groupBy(
                        expensesList,
                        "expenseSubTypeId"
                      )}
                      // showHide={false}
                      moduleId="EXPENSE_TYPES"
                      name={"expenseSubTypeId"}
                      expense={expense}
                      onChange={(updatedValue) => {
                        setDataDropdown({
                          ...updatedValue,
                          expenseTypeId: type._id,
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </Space>
        </div>
      </div>
      <div>
        <h5 onClick={() => openSettingsModal("EXPENSE_SOURCES")}>Source</h5>
        <CheckboxOption
          updateUserSettings={updateUserSettings}
          options={expenseSources}
          optionsBreakdown={_.groupBy(expensesList, "expenseSourceId")}
          name={"expenseSourceId"}
          moduleId="EXPENSE_SOURCES"
          expense={expense}
          onChange={setDataDropdown}
          direction="column"
        />
      </div>
      <div>
        <h5 className="mt" onClick={() => openSettingsModal("EXPENSE_GROUPS")}>
          Group
        </h5>
        <CheckboxOption
          updateUserSettings={updateUserSettings}
          options={expenseGroups}
          optionsBreakdown={_.groupBy(expensesList, "expenseGroupId")}
          name={"expenseGroupId"}
          moduleId="EXPENSE_GROUPS"
          expense={expense}
          onChange={setDataDropdown}
          direction="column"
        />
      </div>
      <div>
        <h5
          className="mt"
          onClick={() => openSettingsModal("EXPENSE_CATEGORIES")}
        >
          Category
        </h5>
        <CheckboxOption
          updateUserSettings={updateUserSettings}
          options={expenseCategories}
          optionsBreakdown={_.groupBy(expensesList, "expenseCategoryId")}
          name={"expenseCategoryId"}
          moduleId="EXPENSE_CATEGORIES"
          expense={expense}
          onChange={setDataDropdown}
          showHide={false}
        />
      </div>
      <InputNumber
        controls={false}
        className="mr"
        placeholder="Amount"
        value={expense.amount}
        onChange={(amount) => setData({ amount })}
      />
      <AutoComplete
        style={{ width: 180 }}
        options={autofillOptions}
        value={expense.message}
        onChange={(message) => setData({ message })}
        placeholder="Message"
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
      <div>
        <Checkbox
          checked={expense.favorite}
          onChange={(e) => setData({ favorite: e.target.checked })}
        >
          Favorite
        </Checkbox>
      </div>
      <div>
        <Checkbox
          checked={expense.excluded}
          onChange={(e) => setData({ excluded: e.target.checked })}
        >
          Excluded
        </Checkbox>
      </div>
      <div className="flex gap-4">
        <Button type="primary" onClick={reset}>
          Clear
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={saveExpense}
          disabled={!expense.amount || !expense.expenseSubTypeId}
        >
          {mode === "ADD" ? "Add" : "Update"}
        </Button>
      </div>

      <SettingsModal
        settingsModalVisible={settingsModalVisible}
        setSettingsModalVisibility={setSettingsModalVisibility}
        moduleId={moduleId}
      />
    </Fragment>
  );
};

const SettingsModal = ({
  moduleId,
  settingsModalVisible,
  setSettingsModalVisibility,
}) => {
  return (
    <Modal
      {...MODAL_PROPS}
      open={settingsModalVisible}
      title="Settings"
      onCancel={() => setSettingsModalVisibility(false)}
    >
      <Settings moduleId={moduleId} />
    </Modal>
  );
};

const CheckboxOption = ({
  options,
  optionsBreakdown,
  expense,
  onChange,
  name,
  direction = "row",
  updateUserSettings,
  moduleId,
  showHide = true,
}) => {
  const updateSetting = (data) => {
    updateUserSettings(
      { moduleName: moduleId, ...data },
      { action: "UPDATE" },
      "TAGS"
    );
  };

  return (
    <div>
      {options.length ? (
        <div
          style={{
            display: "flex",
            flexDirection: direction,
            flexWrap: "wrap",
            gap: "2px",
          }}
        >
          {options
            .filter((option) => option.visible)
            .map((option) => {
              const matchingExpenses = _.get(optionsBreakdown, option._id, []);
              const totalOccurences = _.size(matchingExpenses);
              const content = (
                <div>
                  {matchingExpenses.map((expense) => (
                    <div>{`${dayjs(expense.date).format(
                      "DD,MMM"
                    )}, ${formatNumber(expense.amount)}`}</div>
                  ))}
                </div>
              );
              const hideComponent = showHide ? (
                <span
                  className="hide-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    updateSetting({ ...option, visible: false });
                  }}
                >
                  [h]
                </span>
              ) : null;
              return (
                <Checkbox
                  key={option._id}
                  checked={option._id === expense[name]}
                  className="checkbox-item"
                  onChange={() =>
                    onChange({
                      [name]: option._id,
                    })
                  }
                >
                  {totalOccurences ? (
                    <Tooltip title={content} placement="bottom">
                      {option.label} {`(${totalOccurences})`}
                    </Tooltip>
                  ) : (
                    option.label
                  )}
                  {hideComponent}
                </Checkbox>
              );
            })}
        </div>
      ) : (
        <EmptyState style={{ textAlign: "left" }} size="sm" />
      )}
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

export default connect(mapStateToProps, {
  updateUserSettings,
})(AddExpense);
