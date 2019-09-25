import React, { Component } from "react";
import { Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";

import axios from "axios";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      password: "",
      email: "",
      redirect: false,
      loading: false
    };
  }

  handleInput = key => e => this.setState({ [key]: e.target.value });

  handleRegister = async () => {
    this.setState({ loading: true });
    const { name, username, password, email } = this.state;
    try {
      await axios.post("/auth/register", {
        username,
        password,
        name,
        email
      });

      setTimeout(() => this.setState({ redirect: true, loading: false }), 1000);
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
  };

  render() {
    const { name, username, password, email, redirect, loading } = this.state;
    if (redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <section className="center">
        <h3>Register</h3>
        <form>
          <Input
            className="input"
            value={name}
            onChange={this.handleInput("name")}
            placeholder="Name"
          />
          <Input
            className="input"
            value={email}
            onChange={this.handleInput("email")}
            placeholder="Email"
          />
          <Input
            className="input"
            value={username}
            onChange={this.handleInput("username")}
            placeholder="Username"
          />
          <Input.Password
            className="input"
            value={password}
            onChange={this.handleInput("password")}
            placeholder="Password"
            onPressEnter={this.handleRegister}
          />
          <br />
          <Button
            className="input"
            type="primary"
            onClick={this.handleRegister}
            loading={loading}
          >
            Register
          </Button>
        </form>
      </section>
    );
  }
}

export default Register;
