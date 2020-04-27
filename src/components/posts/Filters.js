import React, { useState, useEffect } from "react";
import { Tag, Input, Select } from "antd";
const { Search } = Input;
const { Option } = Select;

const Filters = ({ setFilter, filters, meta, tagList = [], postCount }) => {
  // useEffect(() => {
  //   if (!location.search) {
  //     setFilters({
  //       search: "",
  //       tags: [],
  //       type: "",
  //       page: 1
  //     });
  //     return;
  //   }

  //   const { tags = [], search, type, page } = queryString.parse(
  //     location.search,
  //     { arrayFormat: "comma" }
  //   );

  //   setFilters({
  //     search,
  //     type,
  //     page: Number(page) || 1,
  //     tags: [].concat(tags)
  //   });
  // }, [location]);

  // const handleTagClose = selectedTag => () => {
  //   let { tags = [] } = filters;
  //   tags = tags.filter(tag => tag !== selectedTag);
  //   const queryParams = { ...filters, tags };
  //   const query = queryString.stringify(queryParams, { arrayFormat: "comma" });
  //   history.push(`/posts?${query}`);
  // };

  const handleTagFilter = (values) => setFilter({ tags: values });

  const { tags = [], search = "" } = filters || {};

  return (
    <div className="header">
      <h3 className="underline">Posts</h3>

      <Search
        allowClear
        className="input input-width"
        placeholder="Search..."
        defaultValue={search}
        onSearch={(value) => setFilter({ search: value })}
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
      {postCount > 0 && (
        <div>
          Showing {postCount} of {meta.count} posts.
        </div>
      )}

      {/* <div>
        {tags.map(tag => (
          <Tag key={tag} onClose={handleTagClose(tag)} closable>
            {tag}
          </Tag>
        ))}
      </div> */}
    </div>
  );
};

export default Filters;
