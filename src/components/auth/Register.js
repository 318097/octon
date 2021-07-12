import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import _ from "lodash";

import { sendAppNotification } from "../../store/actions";

const Register = ({ dispatch }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post("/auth/register", {
        username,
        password,
        name,
        email,
      });

      setTimeout(() => setRedirect(true), 1000);
      dispatch(
        sendAppNotification({
          message: "User registered successfully.",
          type: "success",
        })
      );
    } catch (err) {
      const errorMsg = _.get(err, "response.data", "Server error");
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Redirect to="/login" />;

  return (
    <section id="register">
      <h4 className="text-center mb-12">Register</h4>
      <form>
        <Input
          className="mb"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          placeholder="Name"
        />
        <Input
          className="mb"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          placeholder="Email"
        />
        <Input
          className="mb"
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
          placeholder="Username"
        />
        <Input.Password
          className="mb"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          placeholder="Password"
          onPressEnter={handleRegister}
        />
        <br />
        <Button
          className="mb"
          type="primary"
          onClick={handleRegister}
          loading={loading}
        >
          Register
        </Button>
      </form>
    </section>
  );
};

export default connect()(Register);
