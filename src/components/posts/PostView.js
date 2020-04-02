import React, { useEffect } from "react";
import marked from "marked";
import styled from "styled-components";
import { Tag } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { getPostById } from "../../store/posts/actions";
import { Card as MCard, Icon } from "../../UIComponents";
import colors from "../../colors";

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
    padding: 12px 0 12px 6px;
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
        padding: 4px;
        border: 1px solid ${colors.strokeTwo};
        line-height: 1.4rem;
        code {
          font-size: 1.2rem;
        }
      }
    }
  }
  .back-icon {
    position: absolute;
    /* background: ${colors.strokeTwo}; */
    /* color: ${colors.bar}; */
    top: 5px;
    left: 5px;
    z-index: 1;
    transition: 0.3s;
    &:hover {
      /* color: ${colors.white}; */
      transform: scale(1.2);
    }
  }
`;

const PostView = ({ history, match, post, getPostById }) => {
  useEffect(() => {
    const { id } = match.params;
    getPostById(id);
  }, []);

  const handleTagClick = value => event => {
    event.stopPropagation();
    history.push(`/posts?tags=${value}`);
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
          background={true}
          className="back-icon"
          onClick={() => history.push("/posts")}
          type="caret-left"
        />
      </Wrapper>
    </section>
  );
};

const mapStateToProps = ({ posts }) => ({
  post: posts.selectedPost
});

const mapDispatchToProps = {
  getPostById
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostView));
