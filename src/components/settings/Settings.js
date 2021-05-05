/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { updateAppData, setData } from "../../store/data/actions";
import { connect } from "react-redux";
import {
  Icon,
  PageHeader,
  Card,
  Button,
  Input,
  Select,
} from "@codedrops/react-ui";
import "./Settings.scss";
import NestedNodes from "../../molecules/NestedNodes";
import { v4 as uuidv4 } from "uuid";

const Settings = ({ session }) => {
  const { expenseTypes } = session;
  const [data, setData] = useState(session.expenseTypes);

  return (
    <section id="settings">
      <PageHeader title={"Settings"} actions={[<Icon type="plus" hover />]} />

      <div className="block">
        <h5 className="mb">Expense groups</h5>
        <NestedNodes nodes={data} onChange={(data) => setData(data)} />
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
