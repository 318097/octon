/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Timeline as AntTimeline,
  Card,
  Popconfirm,
  Select,
  Divider,
  Input,
  Empty,
  PageHeader,
} from "antd";
import moment from "moment";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_TIMELINE } from "../../graphql/queries";
import { DELETE_TIMELINE_POST } from "../../graphql/mutations";
import { updateUserSettings } from "../../store/actions";
import { connect } from "react-redux";
import AddPost from "./AddPost";
import colors, { Icon, Tag } from "@codedrops/react-ui";
import "./Timeline.scss";
import _ from "lodash";
import { useObject } from "@codedrops/lib";

const { Option } = Select;

const Timeline = ({ updateUserSettings, session, saveTimelinePost }) => {
  const [currentPost, setCurrentPost] = useState(null);
  const [visibility, setVisibility] = useState(false);
  const [groupId, setGroupId] = useState();
  const [deleteTimelinePost] = useMutation(DELETE_TIMELINE_POST);

  const [getTimeline, { data }] = useLazyQuery(GET_TIMELINE, {
    fetchPolicy: "cache-and-network",
  });

  const dataFeed = _.get(data, "atom.getTimeline", []);

  useEffect(() => {
    fetchTimelinePosts();
  }, [groupId]);

  const fetchTimelinePosts = () => {
    const input = { groupId };
    getTimeline({ variables: { input } });
  };

  const setPostForEdit = (id) => {
    const [post] = dataFeed.filter((post) => post._id === id);
    setCurrentPost(post);
    setVisibility(true);
  };

  const handleDelete = async (_id) => {
    //  setAppLoading(true);
    await deleteTimelinePost({
      variables: { input: { _id } },
    });
    await fetchTimelinePosts();
    //  setAppLoading(false);
  };

  const timelineGroups = _.get(session, "timeline", []);
  const timelineMap = _.keyBy(timelineGroups, "_id");

  // const getTimelineColor = (groupId) => {
  //   const color = _.get(timelineMap, [groupId, "color"], colors.strokeOne);
  //   return color;
  // };

  // console.log("timelineMap::-", timelineMap);

  return (
    <section id="timeline">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Timeline"
        extra={[
          <AddNewGroup
            groupId={groupId}
            setGroupId={setGroupId}
            timelineGroups={timelineGroups}
            updateUserSettings={updateUserSettings}
            key="add-new-group"
          />,
          <AddPost
            key="add-icon"
            post={currentPost}
            visibility={visibility}
            setVisibility={setVisibility}
            timelineGroups={timelineGroups}
            defaultTimeline={groupId}
            fetchTimelinePosts={fetchTimelinePosts}
          />,
        ]}
      />
      {dataFeed.length ? (
        <div className="timeline">
          <AntTimeline>
            {dataFeed.map((item) => {
              const { groupId } = item;

              const timelineTags = groupId.map((id) => (
                <Tag
                  key={id}
                  style={{
                    fontSize: "10px",
                    marginLeft: "0",
                    padding: "0 2px",
                  }}
                  color={_.get(timelineMap, [id, "color"], "steel")}
                >
                  {_.get(timelineMap, [id, "name"])}
                </Tag>
              ));
              return (
                <AntTimeline.Item color={colors.bar} key={item._id}>
                  <Card>
                    <span>{moment(item.date).format("DD,MMM")}:&nbsp;</span>
                    {item.content}

                    <div>{timelineTags}</div>
                    <div className="actions">
                      <Icon
                        size={12}
                        key="edit-post"
                        type="edit"
                        onClick={() => setPostForEdit(item._id)}
                      />
                      <Popconfirm
                        placement="bottomRight"
                        title="Delete?"
                        onConfirm={() => handleDelete(item._id)}
                      >
                        <Icon size={12} key="delete-post" type="delete" />
                      </Popconfirm>
                    </div>
                  </Card>
                </AntTimeline.Item>
              );
            })}
          </AntTimeline>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {/* <Button onClick={() => setPage(page => page + 1)}>Load</Button> */}
    </section>
  );
};

const AddNewGroup = ({
  groupId,
  setGroupId,
  timelineGroups,
  updateUserSettings,
}) => {
  const [newGroupData, setNewGroupData] = useObject({});

  const addTimelineGroup = async () => {
    if (!newGroupData) return;

    updateUserSettings(
      { name: newGroupData.name },
      { action: "CREATE", key: "timeline" }
    );
    setNewGroupData({ name: "" });
  };

  return (
    <Select
      key="group-list"
      className="mr"
      allowClear
      size="small"
      style={{ width: 140 }}
      placeholder="All groups"
      value={groupId}
      onChange={(value) => setGroupId(value)}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: "4px 0" }} />
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              padding: "0 8px",
              alignItems: "center",
            }}
          >
            <Input
              style={{ flex: "auto" }}
              size="small"
              value={newGroupData.name}
              placeholder="New Group"
              onChange={(e) => setNewGroupData({ name: e.target.value })}
            />
            <a
              style={{
                flex: "none",
                padding: "8px",
                display: "block",
                cursor: "pointer",
              }}
              onClick={addTimelineGroup}
            >
              <Icon type="plus" size={12} />
            </a>
          </div>
        </div>
      )}
    >
      {timelineGroups.map(({ name, _id }) => (
        <Option key={_id}>{name}</Option>
      ))}
    </Select>
  );
};

const mapStateToProps = ({ session }) => ({
  session,
});

export default connect(mapStateToProps, {
  updateUserSettings,
})(Timeline);
