import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { Tag, Input, Button, Select } from "antd";
import { tagList } from "./util";
// import _ from 'lodash';

import Card from "./Card";

import "./Posts.scss";

const { Search } = Input;
const { Option } = Select;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .card-wrapper {
    width: 215px;
    height: 115px;
    margin: 7px;
    cursor: pointer;
    position: relative;
    @media (max-width: 400px) {
      width: 90%;
      margin: 7px auto;
    }
    .card {
      padding: 5px;
      .title,
      .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 13px;
      }
      &:hover {
        background: #f9f9f9;
      }
      .content {
        overflow: hidden;
      }
    }
  }
`;

const Posts = ({ history, location }) => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(null);
  const [filters, setFilters] = useState(null);
  const [concatData, setConcatData] = useState(false);

  useEffect(() => {
    if (!filters) return;
    fetchPosts();
  }, [filters]);

  useEffect(() => {
    if (!location.search) {
      setFilters({
        search: "",
        tags: [],
        type: "",
        page: 1
      });
      return;
    }

    const { tags = [], search, type, page } = queryString.parse(
      location.search,
      { arrayFormat: "comma" }
    );

    setFilters({
      search,
      type,
      page: Number(page) || 1,
      tags: [].concat(tags)
    });
  }, [location]);

  const setFilterValues = filter =>
    setFilters(prev => ({ ...prev, ...filter }));

  const fetchPosts = async () => {
    try {
      const {
        data: { posts: data, meta }
      } = await axios.get("/posts", { params: filters });

      setTotalPosts(meta.count);
      setPosts(concatData ? [...posts, ...data] : data);
    } catch (err) {
      console.log(err);
    } finally {
      setConcatData(false);
    }
  };

  const handleClick = _id => () => history.push(`/posts/${_id}`);

  const handleTagClose = selectedTag => () => {
    let { tags = [] } = filters;
    tags = tags.filter(tag => tag !== selectedTag);
    const queryParams = { ...filters, tags };
    const query = queryString.stringify(queryParams, { arrayFormat: "comma" });
    history.push(`/posts?${query}`);
  };

  const handleTagFilter = values => setFilterValues({ tags: values });

  const { tags = [], search = "", page = 0 } = filters || {};
  return (
    <section id="posts">
      <div className="header">
        <h3 className="custom-header">Posts</h3>
        <Search
          allowClear
          className="input input-width"
          placeholder="Search..."
          defaultValue={search}
          onSearch={value => setFilterValues({ search: value })}
        />
        <Select
          mode="multiple"
          className="input"
          style={{ minWidth: "150px" }}
          placeholder="Tags"
          value={tags}
          onChange={handleTagFilter}
        >
          {tagList.map(({ label, value }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Select>
        <div>
          Showing <span className="custom-header">{posts.length}</span> of{" "}
          {totalPosts} posts.
        </div>
        <div>
          {tags.map(tag => (
            <Tag key={tag} onClose={handleTagClose(tag)} closable>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      <Container>
        {posts.length > 0 ? (
          posts.map(post => (
            <div
              className="card-wrapper"
              onClick={handleClick(post._id)}
              key={post._id}
            >
              <Card view="CARD" post={post} />
            </div>
          ))
        ) : (
          <span className="not-found">No posts found.</span>
        )}
      </Container>
      {page * 10 < totalPosts && (
        <div className="flex center mt">
          <Button
            type="danger"
            onClick={() => (
              setFilterValues({ page: page + 1 }), setConcatData(true)
            )}
          >
            Load
          </Button>
        </div>
      )}
    </section>
  );
};

export default withRouter(Posts);
