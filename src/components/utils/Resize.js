import React, { useLayoutEffect, useState } from "react";
import { Modal } from "antd";

const getMode = () => (window.innerWidth > 650 ? "CARD" : "MODAL");

const Resize = ({
  component: Component,
  modalProps: { visible, setVisibility, title, onCancel, footer },
  ...rest
}) => {
  const [mode, setMode] = useState(null);
  useLayoutEffect(() => {
    const updateView = () => setMode(getMode());
    window.addEventListener("resize", updateView);
    setMode(getMode());
    return () => window.removeEventListener("resize", updateView);
  }, []);

  return mode === "CARD" ? (
    <div className="card">
      <Component {...rest} />
    </div>
  ) : (
    <Modal
      visible={visible}
      title={title}
      width={380}
      onCancel={onCancel}
      footer={footer}
    >
      <Component {...rest} />
    </Modal>
  );
};

export default Resize;
