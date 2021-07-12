import { message } from "antd";

const notify = (msg, type = "success") => {
  message[type](msg);
};

export default notify;
