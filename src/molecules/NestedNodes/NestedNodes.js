/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, Fragment } from "react";
import { Icon, Card, Button, Input, Select } from "@codedrops/react-ui";
import "./NestedNodes.scss";
import { v4 as uuidv4 } from "uuid";

const NestedNodesContainer = ({ nodes, onChange }) => {
  const [showAddRow, setShowAddRow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addData, setAddData] = useState({});

  const updateAddData = (update) =>
    setAddData((prev) => ({ ...prev, ...update }));

  const setNodeToEdit = (node) => {
    setAddData(node);
    setEditId(node._id);
    setShowAddRow(true);
  };

  const handleChange = () => {
    if (editId) {
      onChange(
        nodes.map((node) =>
          node._id === editId ? { ...node, ...addData } : node
        )
      );
      setEditId(null);
    } else {
      onChange([...nodes, { ...addData, _id: uuidv4() }]);
    }
    setAddData({});
    setShowAddRow(false);
  };

  const deleteNode = (_id) => {
    onChange(nodes.filter((node) => node._id !== _id));
  };

  return (
    <div className="nested-container">
      <NestedNodes
        nodes={nodes}
        setNodeToEdit={setNodeToEdit}
        deleteNode={deleteNode}
      />
      {showAddRow ? (
        <div className="add-row flex center">
          <Input
            value={addData.label}
            name="label"
            placeholder="Label"
            className="input mr"
            onChange={(e, value) => updateAddData(value)}
          />
          <Select
            placeholder="Parent"
            value={addData.parentId}
            className="select mr"
            name="parentId"
            onChange={(e, value) => updateAddData(value)}
            options={nodes
              .map((node) => ({
                label: node.label,
                value: node._id,
              }))
              .filter((node) => node.value !== editId)}
          />
          <Button onClick={handleChange}>{editId ? "Update" : "Add"}</Button>
        </div>
      ) : (
        <Button onClick={() => setShowAddRow(true)}>Add</Button>
      )}
    </div>
  );
};

const NestedNodes = ({ nodes, depth, parentId, setNodeToEdit, deleteNode }) => {
  const isRootLevel = !depth || depth === 0;

  const filteredNodes = nodes.filter((node) =>
    depth ? node.parentId && node.parentId === parentId : !node.parentId
  );

  if (!filteredNodes.length && depth > 0) return null;

  return (
    <Fragment>
      {!!filteredNodes.length && !isRootLevel && (
        <div className="divider"></div>
      )}
      {filteredNodes.map((node, index) => {
        const { _id, label } = node;
        return (
          <Card key={_id} className="node-wrapper">
            <div className="title-wrapper">
              <div className="title">{`${index + 1}. ${label}`}</div>
              <div>
                <Icon
                  type="edit"
                  size={10}
                  onClick={() => setNodeToEdit(node)}
                />
                <Icon
                  type="delete"
                  size={10}
                  onClick={() => deleteNode(node._id)}
                />
              </div>
            </div>
            <NestedNodes
              nodes={nodes}
              depth={(depth || 0) + 1}
              parentId={_id}
            />
          </Card>
        );
      })}
    </Fragment>
  );
};

export default NestedNodesContainer;
