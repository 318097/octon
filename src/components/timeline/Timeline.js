/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Timeline as AntTimeline, Card, Tag, Popconfirm } from "antd";
import axios from "axios";
import moment from "moment";

import AddPost from "./AddPost";
import colors, { Icon, PageHeader } from "@codedrops/react-ui";
import "./Timeline.scss";

const Timeline = () => {
  const [data, setData] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [page, setPage] = useState(1);
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    fetchTimeline();
  }, [page]);

  const setVisibilityStatus = (status) => () => setVisibility(status);

  const fetchTimeline = async () => {
    const {
      data: { timeline },
    } = await axios.get(`/timeline`, {
      params: {
        page,
      },
    });
    if (page > 1) {
      setData((data) => [...data, ...timeline]);
    } else {
      setData(timeline);
    }
  };

  const editPost = (id) => async () => {
    const [post] = data.filter((post) => post._id === id);
    setCurrentPost(post);
    setVisibility(true);
  };

  const deletePost = (id) => async () => {
    // setLoading(true);
    await axios.delete(`/timeline/${id}`);
    fetchTimeline();
    // setLoading(false);
  };

  return (
    <section id="timeline">
      <PageHeader title={"Timeline"} />
      <div className="timeline">
        <AntTimeline>
          {data.map((item) => (
            <AntTimeline.Item color={colors.bar} key={item._id}>
              <Card>
                <div style={{ flex: 1 }}>
                  <Tag color={colors.bar}>
                    {moment(item.date).format("DD,MMM")}
                  </Tag>
                  {item.content}
                </div>
                <div className="flex align-center">
                  <Icon
                    size={12}
                    key="edit-post"
                    type="edit"
                    onClick={editPost(item._id)}
                  />
                  <Popconfirm
                    placement="bottomRight"
                    title="Delete?"
                    onConfirm={deletePost(item._id)}
                  >
                    <Icon size={12} key="delete-post" type="delete" />
                  </Popconfirm>
                </div>
              </Card>
            </AntTimeline.Item>
          ))}
        </AntTimeline>
        <AddPost
          fetchTimeline={fetchTimeline}
          post={currentPost}
          visibility={visibility}
          setVisibilityStatus={setVisibilityStatus}
        />
      </div>
      {/* <Button onClick={() => setPage(page => page + 1)}>Load</Button> */}
    </section>
  );
};

export default Timeline;
