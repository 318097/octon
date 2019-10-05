import React, { useState, useEffect, Fragment } from "react";
import {
  Timeline as AntTimeline,
  Card,
  Icon,
  Modal,
  Input,
  DatePicker,
  Tag
} from "antd";
import axios from "axios";
import moment from "moment";

import "./Timeline.scss";

const { TextArea } = Input;

const Timeline = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    const {
      data: { timeline }
    } = await axios.get(`/timeline`);
    setData(timeline);
  };

  return (
    <section>
      <div className="timeline">
        <AntTimeline>
          {data.map(item => (
            <AntTimeline.Item color="green" key={item._id}>
              <Card>
                <div>
                  <Tag color="#87d068">
                    {moment(item.date).format("DD,MMM")}
                  </Tag>
                  {item.content}
                </div>
              </Card>
            </AntTimeline.Item>
          ))}
        </AntTimeline>
      </div>
      <AddPost fetchTimeline={fetchTimeline} />
    </section>
  );
};

const AddPost = ({ fetchTimeline }) => {
  const [visibility, setVisibility] = useState(false);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(moment());

  const setVisibilityStatus = status => () => setVisibility(status);

  const addPost = async () => {
    await axios.post(`/timeline`, { content, date: date.format() });
    setVisibility(false);
    fetchTimeline();
    setContent("");
  };

  return (
    <Fragment>
      <Icon
        className="add-icon"
        onClick={setVisibilityStatus(true)}
        type="plus-circle"
      />
      <Modal
        visible={visibility}
        title="Add Post"
        onOk={addPost}
        onCancel={setVisibilityStatus(false)}
        okText="Submit"
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

export default Timeline;
