import React, { Fragment } from "react";
import marked from "marked";
import styled from "styled-components";
import { Tag } from "antd";
import { withRouter } from "react-router-dom";
import { Icon, Card as MCard } from "../../UIComponents";
import colors from "../../madDesign/colors";

const Wrapper = styled.div`
  height: 115px;
  cursor: pointer;
  position: relative;
  padding: 0px;
  .card {
    font-size: 1.4rem;
    line-height: 1.6rem;
    height: 100%;
    width: 100%;
    &:hover {
      background: ${colors.bg};
    }
    .title {
      color: ${colors.iron};
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .content {
      width: 100%;
      overflow: auto;
      padding: 5px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      pre code {
        font-size: 1rem;
      }
    }
    .tags {
      position: absolute;
      bottom: 9px;
      left: 3px;
      text-align: left;
      .ant-tag {
        cursor: pointer;
        margin-right: 3px;
        padding: 0px 4px;
        font-size: 1.2rem;
      }
    }
  }
  .bulb-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    color: ${colors.green};
  }
`;

const Card = ({ history, post }) => {
  const { title = "", content = "", type = "DROP", tags = [], _id } =
    post || {};

  const handleClick = () => history.push(`/posts/${_id}`);

  const handleTagClick = (value) => (event) => {
    event.stopPropagation();
    history.push(`/posts?tags=${value}`);
  };

  if (!post) return <Fragment />;

  return (
    <Wrapper onClick={handleClick}>
      <MCard>
        {type === "POST" && <h3 className="title">{title}</h3>}
        {type === "DROP" && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          ></div>
        )}
        <div className="tags">
          {tags.map((tag, index) => (
            <Tag onClick={handleTagClick(tag)} key={index}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </div>
        {type === "DROP" && <Icon className="bulb-icon" type="bulb" />}
      </MCard>
    </Wrapper>
  );
};

Card.defaultProps = {
  showTitle: true,
  showContent: true,
};

export default withRouter(Card);
