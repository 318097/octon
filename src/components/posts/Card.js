import React, { Fragment } from 'react'
import marked from 'marked';
import styled from 'styled-components';
import { Tag, Icon } from 'antd';
import { withRouter } from 'react-router-dom';

const Wrapper = styled.div`
background: white;
height: 100%;
width: 100%;
border-radius: 5px;
border: 1px solid lightgrey;
box-shadow: 3px 3px 3px lightgrey;
transition: 1s;
display: flex;
flex-direction: column;
justify-content: flex-end;
.title{
  text-align: center;
  margin-bottom: 5px;
}
.content{
  padding: 5px;
  word-wrap: break-word;
  flex: 1 1 auto;
  width: 100%;
  pre{
    font-size: 10px;
    margin: 0 auto;
    border: 1px solid lightgrey;
    padding: 5px;
  }
  p{
    text-align: left;
  }
}
.tags{
  text-align: left;
  .ant-tag{
    margin-right: 3px;
    padding: 0px 4px;
    font-size: 9px;
  }
}
.bulb-icon{
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  color: green;
}
.back-icon{
  position: absolute;
  background: lightgrey;
  top: -7px;
  left: -9px;
  z-index: 10;
  padding: 5px;
  border-radius: 30px;
  transition: 1s;
  &:hover{
    color: grey;
    transform: scale(1.2);
  }
}
`

const Card = ({
  history,
  post,
  view = 'CARD',
}) => {
  const { title = '', content = '', type = 'DROP', tags = [], id } = post || {};

  // const handleFavorite = () => { };

  const handleTagClick = value => event => {
    event.stopPropagation();
    history.push(`/posts?tags=${value}`);
  };

  const hideTitle = type === 'DROP';
  const hideContent = type === 'POST' && view === 'CARD';

  if (!post) return <Fragment />;

  return (
    <Wrapper className="card">
      {!hideTitle && <h3 className="title">{title}</h3>}
      {
        !hideContent &&
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        >
        </div>
      }
      <div className="tags">
        {tags.map((tag, index) => <Tag onClick={handleTagClick(tag)} key={index}>{tag.toUpperCase()}</Tag>)}
      </div>
      {type === 'DROP' && <Icon className="bulb-icon" type="bulb" />}
      {
        view === 'EXPANDED' &&
        <Icon
          className="back-icon"
          onClick={() => history.push('/posts')}
          type="caret-left"
        />
      }
    </Wrapper>
  );
};

export default withRouter(Card);
