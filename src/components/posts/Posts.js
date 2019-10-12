import React, { useState, useEffect, Fragment } from "react";
import { PageHeader, Card } from "antd";
import axios from "axios";
import AddPost from "./addPost";

const Posts = () => {
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

  return (
    <section>
      <PageHeader
        title="Posts"
        extra={[<AddPost fetchPosts={fetchPosts} key="add-post" />]}
      />
      {posts.map(post => (
        <Card key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </Card>
      ))}
    </section>
  );
};

export default Posts;
