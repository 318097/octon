/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Timeline as AntTimeline,
  Card,
  Tag,
  Popconfirm,
  Select,
  Divider,
  Input,
  Empty,
} from "antd";
import axios from "axios";
import moment from "moment";
import {
  getTimeline,
  updateAppData,
  saveTimelinePost,
  setData,
} from "../../store/data/actions";
import { connect } from "react-redux";
import AddPost from "./AddPost";
import colors, { Icon, PageHeader } from "@codedrops/react-ui";
import "./Timeline.scss";
import _ from "lodash";
import randomColor from "randomcolor";

const { Option } = Select;

const Timeline = ({
  timeline,
  getTimeline,
  updateAppData,
  session,
  saveTimelinePost,
  setData,
}) => {
  const { data, groupId } = timeline;
  const [currentPost, setCurrentPost] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    getTimeline();
  }, [groupId]);

  const editPost = (id) => async () => {
    const [post] = data.filter((post) => post._id === id);
    setCurrentPost(post);
    setVisibility(true);
  };

  const deletePost = (id) => async () => {
    // setLoading(true);
    await axios.delete(`/timeline/${id}`);
    getTimeline();
    // setLoading(false);
  };

  const addItem = async () => {
    if (!name) return;

    updateAppData({ name, color: randomColor() });
    setName("");
  };

  const handleDataChange = (value, key) => {
    setData("timeline", { [key]: value });
  };

  const timelineGroups = _.get(session, "timeline", []);

  const getTimelineColor = (groupId) => {
    const timelineMap = _.keyBy(timelineGroups, "_id");
    const color = _.get(timelineMap, [groupId, "color"], colors.strokeOne);
    return color;
  };

  return (
    <section id="timeline">
      <PageHeader
        title={"Timeline"}
        actions={[
          <Select
            key="group-list"
            className="mr"
            allowClear
            style={{ width: 140 }}
            placeholder="All groups"
            value={groupId}
            onChange={(value) => handleDataChange(value, "groupId")}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div
                  style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                >
                  <Input
                    style={{ flex: "auto" }}
                    size="small"
                    value={name}
                    placeholder="New Group"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <a
                    style={{
                      flex: "none",
                      padding: "8px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    onClick={addItem}
                  >
                    <Icon type="plus" />
                  </a>
                </div>
              </div>
            )}
          >
            {timelineGroups.map(({ name, _id }) => (
              <Option key={_id}>{name}</Option>
            ))}
          </Select>,
          <AddPost
            key="add-icon"
            post={currentPost}
            visibility={visibility}
            setVisibility={setVisibility}
            saveTimelinePost={saveTimelinePost}
            timelineGroups={timelineGroups}
            defaultTimeline={groupId}
          />,
        ]}
      />
      {data.length ? (
        <div className="timeline">
          <AntTimeline>
            {data.map((item) => (
              <AntTimeline.Item color={colors.bar} key={item._id}>
                <Card
                  style={{
                    borderLeft: `5px solid ${getTimelineColor(
                      _.get(item, "groupId.0")
                    )}`,
                  }}
                >
                  <Tag color={colors.bar}>
                    {moment(item.date).format("DD,MMM")}
                  </Tag>
                  {item.content}

                  <div className="actions">
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
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {/* <Button onClick={() => setPage(page => page + 1)}>Load</Button> */}
    </section>
  );
};

const mapStateToProps = ({ data: { timeline }, app: { session } }) => ({
  timeline,
  session,
});

export default connect(mapStateToProps, {
  getTimeline,
  updateAppData,
  saveTimelinePost,
  setData,
})(Timeline);
