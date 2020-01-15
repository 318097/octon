import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Icon } from "antd";
import { withRouter } from "react-router-dom";

import Card from "./Card";

const CardWrapper = styled.div`
  margin-top: 20px;
  max-width: 400px;
  width: 95%;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .card {
    padding: 10px 0 5px 5px;
    .title {
      text-align: center;
      margin: 10px;
    }
    .content {
      overflow: auto;
      padding: 20px 10px;
    }
  }
  .back-icon {
    position: absolute;
    background: lightgrey;
    top: -7px;
    left: -9px;
    z-index: 10;
    padding: 5px;
    border-radius: 30px;
    transition: 1s;
    &:hover {
      color: grey;
      transform: scale(1.2);
    }
  }
`;

const PostView = ({ history, match }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPostById();
  }, []);

  const fetchPostById = async () => {
    const { id } = match.params;
    const {
      data: { post }
    } = await axios.get(`/posts/${id}`);
    setPost(post);
  };

  return (
    <section>
      <CardWrapper>
        <Card post={post} view="EXPANDED" />
        <Icon
          className="back-icon"
          onClick={() => history.push("/posts")}
          type="caret-left"
        />
      </CardWrapper>
    </section>
  );
};

export default withRouter(PostView);
