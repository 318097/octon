/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateUserSettings, setData } from "../../store/data/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { PageHeader } from "antd";
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

      <div className="block">
        <h5 className="mb">Expense groups</h5>
        <NestedNodes nodes={expenseTypes} onChange={updateSetting} />
      </div>
    </section>
  );
};

const mapStateToProps = ({ app: { session } }) => ({
  session,
});

export default connect(mapStateToProps, {
  updateUserSettings,
  setData,
})(Settings);
