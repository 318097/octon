import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Card from './Card';

import './Posts.scss';

const Container = styled.div`
display: flex;
justify-content: center;
flex-wrap: wrap;
.post-wrapper{
  width: 215px;
  height: 115px;
  margin: 7px;
  cursor: pointer;
  position: relative;
  .card{
    padding: 5px;
    overflow: hidden;
  }
}
`

const Posts = ({ history }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const {
      data: { posts }
    } = await axios.get("/posts");
    setPosts(posts);
  };

  const handleClick = _id => () => history.push(`/posts/${_id}`);

  return (
    <section id="posts">
      <div>
        <h3 className="custom-header">
          Posts
        </h3>
      </div>
      <Container>
        {
          posts.map(post => (
            <div
              className="post-wrapper"
              onClick={handleClick(post._id)}
              key={post._id}
            >
              <Card post={post} />
            </div>
          ))
        }
      </Container>
    </section>
  );
};

export default withRouter(Posts);
