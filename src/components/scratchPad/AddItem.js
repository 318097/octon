import React, { useState, Fragment, useRef } from "react";
import { DatePicker, Input, Modal, Checkbox, Button } from "antd";
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
  files: [],
};

const AddItem = ({ fetchList }) => {
  const inputEl = useRef(null);
  const [addItemVisibility, setAddItemVisibility] = useState(false);
  const [data, _setData] = useState(INITIAL_STATE);

  const setData = (update) =>
    _setData((prevState) => ({
      ...prevState,
      ...update,
    }));

  const addItem = async () => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      await axios.post("/scratch-pad", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchList();
      setAddItemVisibility(false);
      _setData(INITIAL_STATE);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = (event) => {
    const [document] = event.target.files;

    if (!document) return;

    console.log(document);

    setData({ files: document });
    event.target.value = null;
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

        <div className="mb">
          <Button type="dashed" onClick={() => inputEl.current.click()}>
            Upload
          </Button>
        </div>

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
        <input
          ref={inputEl}
          type="file"
          style={{ visibility: "hidden", position: "absolute" }}
          onChange={handleUpload}
        />
      </Modal>
    </Fragment>
  );
};

export default AddItem;
