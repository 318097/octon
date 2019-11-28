/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, Button, message, Divider } from "antd";
import GoogleAuth from "./GoogleAuth";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import { setToken, isLoggedIn } from "../../authService";

import { getSession } from '../../store/app/selectors';
import { setSession } from '../../store/app/actions';

const Login = ({ history, setSession }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn())
      history.push("/");
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", { username, password });

      setToken(data.token);

      setSession({ loggedIn: true, info: "LOGIN" });
      history.push("/");
    } catch (err) {
      const { data: errorMessage } = err.response;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login">
      <h3 className="text-center"><span className="custom-header">Login</span></h3>
      <form>
        <Input
          className="input"
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
          placeholder="Username"
        />
        <Input.Password
          className="input"
          value={password}
          onPressEnter={handleLogin}
          onChange={({ target: { value } }) => setPassword(value)}
          placeholder="Password"
        />
        <br />
        <Button
          className="input"
          onClick={() => history.push("/register")}
        >
          Register
        </Button>
        <Button
          className="input"
          type="primary"
          onClick={handleLogin}
          loading={loading}
          disabled={!username.length || !password.length}
        >
          Login
        </Button>
      </form>
      <Divider />
      <GoogleAuth />
    </section>
  );
}

const mapStateToProps = state => ({ session: getSession(state) });

const mapDispatchToProps = ({ setSession });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
