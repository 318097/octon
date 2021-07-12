/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Input, Button, message, Divider } from "antd";
import GoogleAuth from "./GoogleAuth";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import qs from "query-string";

import { setSessionInStorage } from "../../lib/authService";

import { getSession } from "../../store/app/selectors";
import { setSession } from "../../store/app/actions";

const Login = ({ history, setSession, session, location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryParams = qs.parse(location.search);
    console.log(queryParams);

    if (queryParams.token) {
      handleLogin("auth-login", queryParams.token);
    } else if (session && session.isAuthenticated) history.push("/");
  }, []);

  const handleLogin = async (authMethod, authToken) => {
    setLoading(true);
    try {
      console.log("authMethod, authToken::-", authMethod, authToken);

      const inputData =
        authMethod === "auth-login"
          ? { authToken, authMethod: "AUTH_TOKEN" }
          : { username, password };
      const { data } = await axios.post("/auth/login", inputData);

      setSessionInStorage(data);
      await setSession({
        isAuthenticated: true,
        info: "LOGIN",
        ...data,
      });
      axios.defaults.headers.common["authorization"] = data.token;
      setTimeout(() => history.push("/expenses"), 400);
    } catch (err) {
      const { response: { data: errorMessage = "Error." } = {} } = err;
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login">
      <h4 className="text-center mb-12">Login</h4>
      <form>
        <Input
          className="mb"
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
          placeholder="Username"
        />
        <Input.Password
          className="mb"
          value={password}
          onPressEnter={handleLogin}
          onChange={({ target: { value } }) => setPassword(value)}
          placeholder="Password"
        />
        <Button
          type="primary"
          className="mr"
          onClick={handleLogin}
          loading={loading}
          disabled={!username.length || !password.length}
        >
          Login
        </Button>
        <Button onClick={() => history.push("/register")}>Register</Button>
      </form>
      <Divider />
      <GoogleAuth />
    </section>
  );
};

const mapStateToProps = (state) => ({ session: getSession(state) });

const mapDispatchToProps = { setSession };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
