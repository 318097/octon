import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { Tag, Input, Button, Select } from "antd";
// import _ from 'lodash';

import Card from "./Card";

import "./Posts.scss";

const { Search } = Input;
const { Option } = Select;

const GridContainer = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 215px);
  justify-content: center;
  grid-gap: 8px;
`;

const Posts = ({ history, location }) => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(null);
  const [filters, setFilters] = useState(null);
  const [concatData, setConcatData] = useState(false);
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    if (!filters) return;
    fetchPosts();
  }, [filters]);

  useEffect(() => {
    const fetchTags = async () => {
      const {
        data: { tags }
      } = await axios.get("/posts/tags");
      setTagList(
        tags.map(({ _id, color, name }) => ({
          _id,
          color,
          label: name.toUpperCase(),
          value: name
        }))
      );
    };
    fetchTags();
  }, []);

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

      <div className="post-container">
        <GridContainer>
          {posts.length > 0 ? (
            posts.map(post => <Card key={post._id} post={post} />)
          ) : (
            <span className="not-found">No posts found.</span>
          )}
        </GridContainer>
      </div>
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
