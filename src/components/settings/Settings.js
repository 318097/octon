/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateUserSettings, setData } from "../../store/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { PageHeader, Card } from "antd";
import NestedNodes from "../../lib/NestedNodes";

const Settings = ({ session, updateUserSettings }) => {
  const updateSetting = async (update, action) => {
    updateUserSettings(update, { action, key: "expenseTypes" });
  };

  const { expenseTypes } = session;

  return (
    <section id="settings">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Settings"
      />

      <Card title="Expense groups" size="small">
        <NestedNodes nodes={expenseTypes} onChange={updateSetting} />
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
