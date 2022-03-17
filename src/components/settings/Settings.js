/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateUserSettings, setData } from "../../store/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { PageHeader, Card } from "antd";
import { NestedNodes } from "@codedrops/react-ui";

const Settings = ({ session, updateUserSettings }) => {
  const updateSetting = (key) => async (update, action) => {
    const defaultVal = {
      moduleName:
        key === "expenseTypes"
          ? "EXPENSE_TYPES"
          : key === "expenseApps"
          ? "EXPENSE_APPS"
          : "EXPENSE_SOURCES",
    };
    if (action === "CREATE") delete update._id;

    updateUserSettings({ ...defaultVal, ...update }, { action });
  };

  const { expenseTypes = [], expenseSources = [], expenseApps = [] } = session;

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
          onChange={updateSetting("expenseTypes")}
        />
      </Card>

      <Card title="Expense source" size="small">
        <NestedNodes
          nodes={expenseSources.map((item) => ({
            ...item,
            canDelete: true,
          }))}
          onChange={updateSetting("expenseSources")}
        />
      </Card>

      <Card title="Expense app" size="small">
        <NestedNodes
          nodes={expenseApps.map((item) => ({
            ...item,
            canDelete: true,
          }))}
          onChange={updateSetting("expenseApps")}
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
