import React, { Fragment } from 'react'
import marked from 'marked';
import styled from 'styled-components';
import { Tag } from 'antd';
import { withRouter } from 'react-router-dom';

const Wrapper = styled.div`
background: white;
height: 100%;
border-radius: 5px;
border: 1px solid lightgrey;
box-shadow: 3px 3px 3px lightgrey;
transition: 1s;
display: flex;
flex-direction: column;
&:hover{
  background: #f7f7f7;
}
.title{
  text-align: center;
  margin-bottom: 5px;
  font-weight: bold;
}
.content{
  padding: 5px;
  word-wrap: break-word;
  flex: 1 1 auto;
  width: 100%;
  pre{
    font-size: 14px;
    margin: 0 auto;
    border: 1px solid lightgrey;
  }
  p{
    text-align: center;
  }
}
.tags{
  .ant-tag{
    margin-right: 3px;
    padding: 0px 4px;
    font-size: 9px;
  }
}
`;

const Card = ({
  history,
  post,
  view = 'CARD',
  disableClick = false
}) => {
  const { title = '', content = '', type = 'DROP', tags = [], id } = post || {};

  // const handleFavorite = () => { };

  const handleClick = () => {
    if (disableClick) return;
    return history.push(`/post/${id}`);
  };

  if (!post) return <Fragment />

  return (
    <Wrapper className="card">
      {type && <h3 className="title">{title}</h3>}
      <div
        onClick={handleClick}
        className="content"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      >
      </div>
      <div className="tags">
        {tags.map((tag, index) => <Tag key={index}>{tag.toUpperCase()}</Tag>)}
      </div>
    </Wrapper>
  )
};

export default withRouter(Card);
