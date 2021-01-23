import React, { useState, useEffect, Fragment } from "react";
import { Modal, DatePicker, Input } from "antd";
import moment from "moment";
import { Icon } from "@codedrops/react-ui";

const { TextArea } = Input;

const AddPost = ({ saveTimelinePost, post, visibility, setVisibility }) => {
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
    saveTimelinePost({ mode, date, content }, post);
    setVisibility(false);
    setContent("");
  };

  const onClickHandler = () => {
    setVisibility(true);
    setMode("ADD");
    setContent("");
    setDate(moment());
  };

  return (
    <Fragment>
      <Icon
        background={true}
        className="add-icon"
        onClick={onClickHandler}
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
        <form>
          <DatePicker
            value={date}
            onChange={(value) => setDate(value)}
            className="mb"
          />
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message"
            rows={4}
          />
        </form>
      </Modal>
    </Fragment>
  );
};

export default AddPost;
