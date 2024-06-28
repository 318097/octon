/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateUserSettings, setData } from "../../store/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { Card } from "antd";
import { NestedNodes } from "@codedrops/react-ui";

const Settings = ({ session, updateUserSettings, moduleId }) => {
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

  const SECTIONS = [
    {
      id: "EXPENSE_TYPES",
      component: (
        <Card title="Expense types" size="small">
          <NestedNodes
            nodes={expenseTypes.map((item) => ({
              ...item,
              canDelete: !item.default,
            }))}
            onChange={updateSetting("EXPENSE_TYPES")}
          />
        </Card>
      ),
    },
    {
      id: "EXPENSE_SOURCES",
      component: (
        <Card title="Expense source" size="small">
          <NestedNodes
            nodes={expenseSources.map((item) => ({
              ...item,
              canDelete: true,
            }))}
            onChange={updateSetting("EXPENSE_SOURCES")}
          />
        </Card>
      ),
    },
    {
      id: "EXPENSE_GROUPS",
      component: (
        <Card title="Expense groups" size="small">
          <NestedNodes
            nodes={expenseGroups.map((item) => ({
              ...item,
              canDelete: true,
            }))}
            onChange={updateSetting("EXPENSE_GROUPS")}
          />
        </Card>
      ),
    },
    {
      id: "EXPENSE_CATEGORIES",
      component: (
        <Card title="Expense categories" size="small">
          <NestedNodes
            nodes={expenseCategories.map((item) => ({
              ...item,
              canDelete: true,
            }))}
            onChange={updateSetting("EXPENSE_CATEGORIES")}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="settings">
      {SECTIONS.filter((s) => (moduleId ? s.id === moduleId : true)).map(
        (s) => s.component
      )}
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
