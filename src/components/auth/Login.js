import React, { Component } from "react";
import { Input, Button, message, Divider } from "antd";
import GoogleAuth from "./GoogleAuth";
import axios from "axios";
import { withRouter } from "react-router-dom";

import { setToken, isLoggedIn } from "../../authService";
import "./Login.scss";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  componentWillMount() {
    if (isLoggedIn()) {
      this.props.history.push("/");
    }
  }

  handleLogin = async () => {
    const { username, password } = this.state;
    try {
      const { data } = await axios.post("/auth/login", {
        username,
        password
      });

      setToken(data.token);
      this.props.setLoginState({ loggedIn: true, info: "LOGIN" });
      this.props.history.push("/");
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  handleInput = key => event => this.setState({ [key]: event.target.value });

  render() {
    const { username, password } = this.state;
    return (
      <section className="center">
        <h3>Login</h3>
        <form>
          <Input
            className="input"
            value={username}
            onChange={this.handleInput("username")}
            placeholder="Username"
          />
          <Input.Password
            className="input"
            value={password}
            onPressEnter={this.handleLogin}
            onChange={this.handleInput("password")}
            placeholder="Password"
          />
          <br />
          <Button
            className="input"
            onClick={() => this.props.history.push("/register")}
          >
            Register
          </Button>
          <Button className="input" type="primary" onClick={this.handleLogin}>
            Login
          </Button>
        </form>
        <Divider />
        <GoogleAuth />
      </section>
    );
  }
}

export default withRouter(Login);
