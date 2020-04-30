import React from "react";
import { Button, Card, Tag, Input } from "../../UIComponents";
import "./ComponentList.scss";

const UIComponent = ({ type }) => {
  switch (type) {
    case "BUTTON":
      return <Button>Test</Button>;
    case "CARD":
      return <Card>Test file</Card>;
    case "TAG":
      return <Tag>Test file</Tag>;
    case "INPUT":
      return <Input />;
    default:
      return null;
  }
};

const uiList = ["BUTTON", "CARD", "TAG", "INPUT"];

const ComponentList = () => {
  return (
    <div className="ui-container">
      {uiList.map((type) => (
        <div key={type} className="item">
          <UIComponent type={type} />
          <span className="name">{type}</span>
        </div>
      ))}
    </div>
  );
};

export default ComponentList;
