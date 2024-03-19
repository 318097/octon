/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateUserSettings, setData } from "../../store/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { Card } from "antd";
import { NestedNodes } from "@codedrops/react-ui";

const Settings = ({ session, updateUserSettings }) => {
  const updateSetting =
    (moduleName) =>
    async (data, { action }) =>
      updateUserSettings({ moduleName, ...data }, { action }, "TAGS");

  const {
    expenseTypes = [],
    expenseSources = [],
    expenseGroups = [],
    expenseCategories = [],
  } = session;

  return (
    <div className="settings">
      <Card title="Expense type & sub-types" size="small">
        <NestedNodes
          nodes={expenseTypes.map((item) => ({
            ...item,
            canDelete: !item.default,
          }))}
          onChange={updateSetting("EXPENSE_TYPES")}
        />
      </Card>

      <Card title="Expense source" size="small">
        <NestedNodes
          nodes={expenseSources.map((item) => ({
            ...item,
            canDelete: true,
          }))}
          onChange={updateSetting("EXPENSE_SOURCES")}
        />
      </Card>

      <Card title="Expense groups" size="small">
        <NestedNodes
          nodes={expenseGroups.map((item) => ({
            ...item,
            canDelete: true,
          }))}
          onChange={updateSetting("EXPENSE_GROUPS")}
        />
      </Card>

      <Card title="Expense categories" size="small">
        <NestedNodes
          nodes={expenseCategories.map((item) => ({
            ...item,
            canDelete: true,
          }))}
          onChange={updateSetting("EXPENSE_CATEGORIES")}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

export default connect(mapStateToProps, {
  updateUserSettings,
  setData,
})(Settings);
