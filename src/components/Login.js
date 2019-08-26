import React, { Component, Fragment } from "react";
import { Input, Button, message, Divider } from "antd";
import { Redirect } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";

import axios from "axios";
import "./Login.scss";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirect: false
    };
  }

  handleInput = key => e => this.setState({ [key]: e.target.value });

  handleLogin = async () => {
    const { username, password } = this.state;
    try {
      const { data } = await axios.post("/auth/login", {
        username,
        password
      });

      localStorage.clear();
      localStorage.setItem("bbox-token", data.token);
      this.setState({ redirect: true });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  redirectToRegister = () => this.props.history.push("/register");

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <Fragment>
        <form>
          <Input
            className="input"
            value={this.state.username}
            onChange={this.handleInput("username")}
            placeholder="Username"
          />
          <Input.Password
            className="input"
            value={this.state.password}
            onChange={this.handleInput("password")}
            placeholder="Password"
          />
          <br />
          <Button className="input" onClick={this.redirectToRegister}>
            Register
          </Button>
          <Button className="input" type="primary" onClick={this.handleLogin}>
            Login
          </Button>
        </form>
        <br />
        {/* <Divider /> */}
        <GoogleAuth />
      </Fragment>
    );
  }
}
