import React, { useState, useEffect } from "react";
import axios from "axios";

import AddItem from "./AddItem";
import List from "./List";
import { PageHeader } from "antd";
import "./ScratchPad.scss";

const ScratchPad = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    const {
      data: { items },
    } = await axios.get(`scratch-pad`);
    setList(items);
  };

  return (
    <section id="scratch-pad">
      <PageHeader
        className="page-header"
        ghost={false}
        onBack={null}
        title="Scratch Pad"
        extra={<AddItem fetchList={fetchList} />}
      />
      <List list={list} fetchList={fetchList} />
    </section>
  );
};

export default ScratchPad;
