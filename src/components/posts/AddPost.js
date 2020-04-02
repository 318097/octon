import React, { useState, Fragment } from "react";
import { Radio, Input, Modal, Checkbox } from "antd";
import axios from "axios";
import { Icon } from "../../UIComponents";
const { TextArea } = Input;

const initialState = {
  type: "DROP",
  title: "",
  content: "",
  tags: []
};

const AddPost = ({ fetchPosts }) => {
  const [addPostModalVisibility, setAddPostModalVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(initialState);

  const tagOptions = [
    { label: "javascript", value: "javascript" },
    { label: "react", value: "react" }
  ];

  const setAddPostModalVisibilityStatus = status => () =>
    setAddPostModalVisibility(status);

  const addPost = async () => {
    try {
      setLoading(true);
      await axios.post("/posts", { ...post });
      setAddPostModalVisibility(false);
      fetchPosts();
    } catch (err) {
      console.log(err);
    } finally {
      setPost({ ...initialState, tags: [] });
      setLoading(false);
    }
  };

  const setData = (key, value) => setPost(data => ({ ...data, [key]: value }));

  return (
    <Fragment>
      <Icon type="plus" onClick={setAddPostModalVisibilityStatus(true)} />
      <Modal
        visible={addPostModalVisibility}
        okButtonProps={{ loading }}
        title="Add Post"
        okText="Add"
        onOk={addPost}
        onCancel={setAddPostModalVisibilityStatus(false)}
      >
        <form>
          <Radio.Group
            buttonStyle="solid"
            className="input"
            value={post.type}
            onChange={e => setData("type", e.target.value)}
          >
            <Radio value="POST">Post</Radio>
            <Radio value="DROP">Drop</Radio>
          </Radio.Group>
          <br />
          <Input
            className="input"
            value={post.title}
            placeholder="Title"
            onChange={e => setData("title", e.target.value)}
          />
          <br />
          <TextArea
            className="input"
            value={post.content}
            placeholder="Content"
            rows="5"
            onChange={e => setData("content", e.target.value)}
          />
          <Checkbox.Group
            options={tagOptions}
            defaultValue={post.tags}
            onChange={value => setData("tags", value)}
          />
        </form>
      </Modal>
    </Fragment>
  );
};

export default AddPost;
