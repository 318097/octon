import React, { useState, Fragment } from "react";
import { DatePicker, Input, Modal, Checkbox } from "antd";
import axios from "axios";
import "./ScratchPad.scss";
import moment from "moment";
import { Icon } from "@codedrops/react-ui";

const INITIAL_STATE = {
  expiresOn: moment().add(1, "day"),
  expires: true,
  isPublic: true,
  content: "",
  name: "",
};

const AddItem = ({ fetchList }) => {
  const [addItemVisibility, setAddItemVisibility] = useState(false);
  const [data, _setData] = useState(INITIAL_STATE);

  const setData = (update) =>
    _setData((prevState) => ({
      ...prevState,
      ...update,
    }));

  const addItem = async () => {
    await axios.post("/scratch-pad", data);
    fetchList();
    setAddItemVisibility(false);
    _setData(INITIAL_STATE);
  };

  return (
    <Fragment>
      <Icon
        background={true}
        onClick={() => setAddItemVisibility(true)}
        type="plus"
      />
      <Modal
        wrapClassName="react-ui"
        visible={addItemVisibility}
        title="Add Item"
        onCancel={() => setAddItemVisibility(false)}
        okText="Add"
        onOk={addItem}
        width={380}
      >
        <Input
          placeholder="Name"
          autoFocus
          value={data.name}
          onChange={({ target }) => setData({ name: target.value })}
          className="mb"
        />

        <Input
          placeholder="Content"
          autoFocus
          value={data.content}
          onChange={({ target }) => setData({ content: target.value })}
          className="mb"
        />
        <DatePicker
          defaultValue={data.expiresOn}
          onChange={(date) => setData({ expiresOn: date })}
          className="mb"
        />

        <div>
          <Checkbox
            checked={data.expires}
            onChange={(e) => setData({ expires: e.target.checked })}
          >
            Expires
          </Checkbox>
          <Checkbox
            checked={data.isPublic}
            onChange={(e) => setData({ isPublic: e.target.checked })}
          >
            Public
          </Checkbox>
        </div>
      </Modal>
    </Fragment>
  );
};

export default AddItem;
