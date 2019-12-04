import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Card from './Card';

const Container = styled.div`
.controls{
  width: 300px;
  background: white;
  margin: 0 auto;
  padding: 5px 20px;
  position: relative;
  bottom: 12px;
  border-radius: 10px;
}
.card-wrapper{
  margin-top: 20px;
  max-width: 400px;
  width: 100%;
  height: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .card{
    padding: 20px 0 20px 10px;
    .title{
      text-align: center;
      margin: 10px;
    }
    .content{
      overflow: auto;
      padding: 20px 10px;
    }
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

  // const handleNavigateBack = () => history.push(`/posts`);

  return (
    <section>
      <Container>
        {/* <div className="controls">
          <Icon type="caret-left" />
        </div> */}
        <div className="card-wrapper">
          <Card post={post} view="EXPANDED" />
        </div>
      </Container>
    </section>
  );
};

export default withRouter(PostView);
