import React, { useState, useEffect, Fragment } from "react";
import { Modal, DatePicker, Input, Select } from "antd";
import moment from "moment";
import { Icon } from "@codedrops/react-ui";

const { TextArea } = Input;
const { Option } = Select;

const INITIAL_STATE = {
  date: moment(),
  groupId: [],
  content: "",
};

const AddPost = ({
  saveTimelinePost,
  post,
  visibility,
  setVisibility,
  timelineGroups,
  defaultTimeline,
}) => {
  const [data, setData] = useState({});
  const [mode, setMode] = useState("ADD");

  useEffect(() => {
    if (!post) return;
    const { content, date, groupId } = post || {};
    setMode("EDIT");
    setData({ content, groupId, date: moment(date) });
  }, [post]);

  const savePost = async () => {
    saveTimelinePost({ mode, ...data }, post);
    setVisibility(false);
    setData(INITIAL_STATE);
  };

  const openAddNewPost = () => {
    setVisibility(true);
    setMode("ADD");
    setData({ ...INITIAL_STATE, groupId: [defaultTimeline] });
  };

  const setDataObj = (update) => setData((prev) => ({ ...prev, ...update }));

  return (
    <Fragment>
      <Icon
        background={true}
        className="add-icon"
        onClick={openAddNewPost}
        type="plus"
      />
      <Modal
        wrapClassName="react-ui"
        visible={visibility}
        title={`${mode === "ADD" ? "Add" : "Edit"} Post`}
        onOk={savePost}
        okText={mode === "ADD" ? "Add" : "Update"}
        onCancel={() => setVisibility(false)}
        width={380}
      >
        <Select
          key="group-list"
          className="mb"
          mode="multiple"
          allowClear
          placeholder="Group(s)"
          value={data.groupId}
          onChange={(groupId) => setDataObj({ groupId })}
        >
          {timelineGroups.map(({ name, _id }) => (
            <Option key={_id}>{name}</Option>
          ))}
        </Select>
        <br />
        <DatePicker
          value={data.date}
          onChange={(date) => setDataObj({ date })}
          className="mb"
        />
        <TextArea
          value={data.content}
          onChange={(e) => setDataObj({ content: e.target.value })}
          placeholder="Message"
          rows={4}
        />
      </Modal>
    </Fragment>
  );
};

export default AddPost;
