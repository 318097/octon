import React, { useLayoutEffect, useState } from 'react'
import { Card, Modal } from 'antd';

const getMode = () => window.innerWidth > 650 ? 'CARD' : 'MODAL';

const Resize = ({
  component: Component,
  modalProps: { visible, setVisibility, title, onCancel, footer },
  ...rest
}) => {
  const [mode, setMode] = useState(null);
  useLayoutEffect(() => {
    const updateView = () => setMode(getMode());
    window.addEventListener('resize', updateView);
    setMode(getMode());
    return () => window.removeEventListener('resize', updateView);
  }, []);

  return mode === 'CARD' ?
    <Card className="card">
      <Component {...rest} />
    </Card> :
    <Modal
      visible={visible}
      title={title}
      width={380}
      onCancel={onCancel}
      footer={footer}
    >
      <Component {...rest} />
    </Modal>
}

export default Resize;
