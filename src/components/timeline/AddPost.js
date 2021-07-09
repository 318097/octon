import React, { useState, useEffect, Fragment } from "react";
import { Modal, DatePicker, Input, Select } from "antd";
import moment from "moment";
import { Icon } from "@codedrops/react-ui";
import {
  CREATE_TIMELINE_POST,
  UPDATE_TIMELINE_POST,
} from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import _ from "lodash";

const { TextArea } = Input;
const { Option } = Select;

const INITIAL_STATE = {
  date: moment(),
  groupId: undefined,
  content: "",
};

const AddPost = ({
  post,
  visibility,
  setVisibility,
  timelineGroups,
  defaultTimeline,
  fetchTimelinePosts,
}) => {
  const [data, setData] = useState({});
  const [mode, setMode] = useState("ADD");
  const [createTimelinePost] = useMutation(CREATE_TIMELINE_POST);
  const [updateTimelinePost] = useMutation(UPDATE_TIMELINE_POST);

  useEffect(() => {
    if (!post) return;
    const { content, date, groupId } = post || {};
    setMode("EDIT");
    setData({ content, groupId, date: moment(date) });
  }, [post]);

  const savePost = async () => {
    const date = data.date.format();
    if (mode === "ADD") {
      await createTimelinePost({
        variables: {
          input: {
            ...data,
            date,
            groupId: data.groupId || _.get(timelineGroups, "0._id"),
          },
        },
      });
    } else {
      await updateTimelinePost({
        variables: { input: { ...data, date, _id: post._id } },
      });
    }

    setVisibility(false);
    setData(INITIAL_STATE);
    fetchTimelinePosts();
  };

  const openNewPostModal = () => {
    setVisibility(true);
    setMode("ADD");
    setData({
      ...INITIAL_STATE,
      groupId: defaultTimeline ? [defaultTimeline] : undefined,
    });
  };

  const setDataObj = (update) => setData((prev) => ({ ...prev, ...update }));

  return (
    <Fragment>
      <Icon onClick={openNewPostModal} type="plus" size={12} />
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
          className="mb mw-100"
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
