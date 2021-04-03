import React from "react";
import moment from "moment";
import axios from "axios";
import { Empty, Card, Button } from "antd";
import colors from "@codedrops/react-ui";
import "./ScratchPad.scss";
import { Icon } from "@ant-design/compatible";
import { copyToClipboard } from "@bit/codedrops.lib.utils";

const List = ({ list, fetchList }) => {
  // const deleteGoal = async id => {
  //   await axios.delete(`/scratch-pad/${id}`);
  //   fetchList();
  // };

  const copy = (content) => {
    copyToClipboard(content);
  };

  if (!list.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className="list">
      {list.map((item) => {
        const {
          _id,
          content,
          expiresOn,
          media,
          isPublic,
          name,
          expires,
        } = item;
        const extraItems = [
          <Icon
            className="ml"
            key="copy"
            type="copy"
            onClick={() => copy(content)}
          />,
        ];
        if (expires) {
          const expiresTime = moment().to(expiresOn);
          extraItems.unshift(
            <span className="fcc">
              <Icon className="mr pointer" key="expires" type="clock-circle" />
              <span style={{ fontSize: "10px" }}>{expiresTime}</span>
            </span>
          );
        }

        return (
          <Card
            size="small"
            title={name}
            key={_id}
            className="item"
            extra={<div className="fcc">{extraItems}</div>}
          >
            <div className="content">{content}</div>
          </Card>
        );
      })}
    </div>
  );
};

export default List;
