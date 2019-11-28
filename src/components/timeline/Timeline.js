/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Timeline as AntTimeline,
  Card,
  Icon,
  Tag,
  Popconfirm
} from "antd";
import axios from "axios";
import moment from "moment";

import AddPost from "./AddPost";

import "./Timeline.scss";

const Timeline = () => {
  const [data, setData] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [page, setPage] = useState(1);
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    fetchTimeline();
  }, []);

  useEffect(() => {
    fetchTimeline();
  }, [page]);

  const setVisibilityStatus = status => () => setVisibility(status);

  const fetchTimeline = async () => {
    const {
      data: { timeline }
    } = await axios.get(`/timeline`, {
      params: {
        page
      }
    });
    if (page > 1) {
      setData(data => [...data, ...timeline]);
    } else {
      setData(timeline);
    }
  };

  const editPost = id => async () => {
    const [post] = data.filter(post => post._id === id);
    setCurrentPost(post);
    setVisibility(true);
  };

  const deletePost = id => async () => {
    // setLoading(true);
    await axios.delete(`/timeline/${id}`);
    fetchTimeline();
    // setLoading(false);
  };

  return (
    <section>
      <div className="timeline">
        <AntTimeline>
          {data.map(item => (
            <AntTimeline.Item color="green" key={item._id}>
              <Card>
                <div style={{ flex: 1 }}>
                  <Tag color="#87d068">
                    {moment(item.date).format("DD,MMM")}
                  </Tag>
                  {item.content}
                </div>
                <div>
                  <Icon
                    key="edit-post"
                    type="edit"
                    onClick={editPost(item._id)}
                  />
                  <Popconfirm
                    placement="bottomRight"
                    title="Delete?"
                    onConfirm={deletePost(item._id)}
                  >
                    <Icon key="delete-post" type="delete" />
                  </Popconfirm>
                </div>
              </Card>
            </AntTimeline.Item>
          ))}
        </AntTimeline>
      </div>

      {/* <Button onClick={() => setPage(page => page + 1)}>Load</Button> */}
      <AddPost
        fetchTimeline={fetchTimeline}
        post={currentPost}
        visibility={visibility}
        setVisibilityStatus={setVisibilityStatus}
      />
    </section>
  );
};

export default Timeline;
