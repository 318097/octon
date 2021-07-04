import React from "react";
import moment from "moment";
import { Empty, Card, Image } from "antd";
// import colors from "@codedrops/react-ui";
// import axios from "axios";
import "./ScratchPad.scss";
import { Icon } from "@ant-design/compatible";
import { copyToClipboard } from "@codedrops/lib/dist/utils";

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
        const { _id, content, expiresOn, media, name, expires } = item;

        const extraItems = [
          <Icon
            className="ml"
            key="action"
            type="copy"
            onClick={() => copy(content)}
          />,
        ];
        if (expires) {
          const expiresTime = moment().to(expiresOn);
          extraItems.unshift(
            <span className="fcc" key="expires">
              <Icon className="mr pointer" type="clock-circle" />
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
            <div className="media-container">
              {media.map(({ url, original_filename }) => (
                <div className="image-container">
                  <Image key={url} src={url} alt={original_filename} />
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default List;
