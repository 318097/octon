/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateUserSettings, setData } from "../../store/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { Card } from "antd";
import { NestedNodes } from "@codedrops/react-ui";
import { PageHeader } from "../../lib/UI";

const Settings = ({ session, updateUserSettings }) => {
  const updateSetting =
    (moduleName) =>
    async (data, { action }) =>
      updateUserSettings({ moduleName, ...data }, { action }, "TAGS");

  const {
    expenseTypes = [],
    expenseSources = [],
    expenseGroups = [],
  } = session;

  return (
    <section id="settings">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Settings"
      />

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
    </section>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

export default connect(mapStateToProps, {
  updateUserSettings,
  setData,
})(Settings);
