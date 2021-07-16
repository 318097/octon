import React, { useState } from "react";
import { Input, Button } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import handleError from "../../lib/errorHandler";
import notify from "../../lib/notify";
import tracking from "../../lib/mixpanel";

const Register = () => {
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
      tracking.track("REGISTER");
      notify("User registered successfully.");
      setTimeout(() => setRedirect(true), 1000);
    } catch (error) {
      handleError(error);
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
