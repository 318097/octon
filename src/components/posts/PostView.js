import React, { useState, useEffect } from "react";
import { PageHeader } from "antd";
import axios from "axios";
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Card from './Card';

const Container = styled.div`
.post-wrapper{
  width: 45vw;
  height: 60vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .card{
    padding: 30px 20px;
  }
}
`

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

  const handleClick = _id => () => history.push(`/posts`);

  return (
    <section>
      <Container>
        <div
          className="post-wrapper"
        >
          <Card post={post} disableClick={true} />
        </div>
      </Container>
    </section>
  );
};

export default withRouter(PostView);
