import React, { useState, useEffect, Fragment } from "react";
import { Icon, Modal, DatePicker, Input } from "antd";
import axios from "axios";
import moment from "moment";

const { TextArea } = Input;

const AddPost = ({ fetchTimeline, post, visibility, setVisibilityStatus }) => {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(moment());
  const [mode, setMode] = useState("ADD");

  useEffect(() => {
    if (!post) return;

    setMode("EDIT");
    const { content, date } = post;
    setContent(content);
    setDate(moment(date));
  }, [post]);

  const savePost = async () => {
    if (mode === "EDIT") {
      await axios.put(`/timeline/${post._id}`, {
        content,
        date: date.format()
      });
    } else {
      await axios.post(`/timeline`, { content, date: date.format() });
    }
    setVisibilityStatus(false)();
    fetchTimeline();
    setContent("");
  };

  const onClickHandler = () => {
    setVisibilityStatus(true)();
    setMode("ADD");
  };

  return (
    <Fragment>
      <Icon className="add-icon" onClick={onClickHandler} type="plus-circle" />
      <Modal
        visible={visibility}
        title={`${mode === "ADD" ? "Add" : "Edit"} Post`}
        onOk={savePost}
        okText={`${mode === "ADD" ? "Add" : "Update"}`}
        onCancel={setVisibilityStatus(false)}
        width={380}
      >
        <form>
          <DatePicker
            className="input"
            value={date}
            onChange={value => setDate(value)}
          />
          <TextArea
            autoFocus
            className="input"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Message"
            rows={4}
          />
        </form>
      </Modal>
    </Fragment>
  );
};

export default AddPost;
