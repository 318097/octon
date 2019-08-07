import React, { Component, Fragment } from 'react'
import { Input, Button } from 'antd';
import './Login.scss';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleInput = key => e => this.setState({ [key]: e.target.value })

  handleLogin = () => {

  }

  render() {
    return (
      <Fragment>
        <form>
          <Input
            className="input"
            value={this.state.username}
            onChange={this.handleInput('username')}
            placeholder="Username"
          />
          <Input.Password
            className="input"
            value={this.state.password}
            onChange={this.handleInput('password')}
            placeholder="Password" />
          <br />
          <Button className="input">Register</Button>
          <Button className="input" type="primary" onClick={this.handleLogin}>Login</Button>
        </form>
      </Fragment>
    )
  }
}
