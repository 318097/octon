import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import { sendAppNotification } from "../../store/app/actions";

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
        email
      });

      setTimeout(() => setRedirect(true), 1000);
      dispatch(
        sendAppNotification({
          message: "User registered successfully."
        })
      );
    } catch (err) {
      const { data: errorMessage } = err.response;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Redirect to="/login" />;

  return (
    <section id="register">
      <h3 className="text-center">
        <span className="custom-header">Register</span>
      </h3>
      <form>
        <Input
          className="input"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
          placeholder="Name"
        />
        <Input
          className="input"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          placeholder="Email"
        />
        <Input
          className="input"
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
          placeholder="Username"
        />
        <Input.Password
          className="input"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          placeholder="Password"
          onPressEnter={handleRegister}
        />
        <br />
        <Button
          className="input"
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
