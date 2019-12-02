import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Tag, Input } from "antd";
import Card from './Card';

import './Posts.scss';

const { Search } = Input;

const Container = styled.div`
display: flex;
justify-content: center;
flex-wrap: wrap;
.card-wrapper{
  width: 215px;
  height: 115px;
  margin: 7px;
  cursor: pointer;
  position: relative;
  .card{
    padding: 5px;
    .title, .content{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 13px;
    }
    &:hover{
      background: #efefef;
    }
    .content{
      overflow: hidden;
    }
  }
}
`

const Posts = ({ history, location }) => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tags: [],
  });

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  useEffect(() => {
    const { tags, search } = queryString.parse(location.search, { arrayFormat: 'comma' });
    console.log(location);
    setFilters({
      search,
      tags: [].concat(tags),
    });
  }, [location]);

  const setFilterValues = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const fetchPosts = async () => {
    const {
      data: { posts, meta }
    } = await axios.get("/posts", { params: filters });

    setTotalPosts(meta.count);
    setPosts(posts);
  };

  const handleClick = _id => () => history.push(`/posts/${_id}`);

  const handleTagClose = tag => () => {

  };

  return (
    <section id="posts">
      <div className="header">
        <h3 className="custom-header">
          Posts
        </h3>
        <Search
          className="input input-width"
          placeholder="Search..."
          value={filters.search}
          onChange={({ target: { value } }) => setFilterValues('search', value)}
          onSearch={() => fetchPosts()}
        />
        <div>
          {totalPosts} posts.
        </div>
        <div>
          {filters.tags.map(tag => <Tag key={tag} onClose={handleTagClose(tag)} closable>{tag}</Tag>)}
        </div>
      </div>
      <Container>
        {
          posts.map(post => (
            <div
              className="card-wrapper"
              onClick={handleClick(post._id)}
              key={post._id}
            >
              <Card view="CARD" post={post} />
            </div>
          ))
        }
      </Container>
    </section>
  );
};

export default withRouter(Posts);
