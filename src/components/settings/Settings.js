/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { updateAppData, setData } from "../../store/data/actions";
import { connect } from "react-redux";
import "./Settings.scss";
import { PageHeader } from "antd";
import NestedNodes from "../../lib/NestedNodes";

const Settings = ({ session, updateAppData }) => {
  const updateSetting = async (update, action) => {
    updateAppData(update, { action, key: "expenseTypes" });
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
  updateAppData,
  setData,
})(Settings);
