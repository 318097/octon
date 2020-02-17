import React, { useState, useEffect } from "react";
import axios from "axios";
import marked from "marked";
import styled from "styled-components";
import { Tag, Icon } from "antd";
import { withRouter } from "react-router-dom";

import { Card as MCard } from "../../UIComponents";

const Wrapper = styled.div`
  margin-top: 20px;
  max-width: 450px;
  width: 95%;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .card {
    height: 100%;
    padding: 10px 0 10px 5px;
    display: flex;
    flex-direction: column;
    .title {
      text-align: center;
      margin: 10px;
    }
    .content {
      flex: 1 1 auto;
      overflow: auto;
      padding: 20px 10px;
      pre {
        border: 1px solid lightgrey;
        code {
          font-size: 0.7rem;
        }
      }
    }
  }
  .back-icon {
    position: absolute;
    background: #484848;
    color: white;
    top: 5px;
    left: 5px;
    z-index: 10;
    padding: 5px;
    border-radius: 30px;
    transition: 1s;
    &:hover {
      background: #484848;
      color: white;
      transform: scale(1.2);
    }
  }
`;

const PostView = ({ history, match }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPostById();
  }, []);

  const handleTagClick = value => event => {
    event.stopPropagation();
    history.push(`/posts?tags=${value}`);
  };

  const fetchPostById = async () => {
    const { id } = match.params;
    const {
      data: { post }
    } = await axios.get(`/posts/${id}`);
    setPost(post);
  };

  if (!post) return null;

  return (
    <section id="view-post">
      <Wrapper>
        <MCard>
          <h3 className="title">{post.title}</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          ></div>
          <div className="tags">
            {post.tags.map((tag, index) => (
              <Tag onClick={handleTagClick(tag)} key={index}>
                {tag.toUpperCase()}
              </Tag>
            ))}
          </div>
        </MCard>
        <Icon
          className="back-icon"
          onClick={() => history.push("/posts")}
          type="caret-left"
        />
      </Wrapper>
    </section>
  );
};

export default withRouter(PostView);
