import React, { Component } from "react";
import { Button } from "antd";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Icon } from "../../UIComponents";
import config from "../../config";
import colors from "../../madDesign/colors";
class GoogleAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: null,
      redirect: false,
    };
  }

  onAuthChange = () =>
    this.setState({ isSignedIn: this.auth.isSignedIn.get() });

  handleGoogleLogin = async () => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2
        .init({
          clientId: config.GOOGLE_LOGIN_CLIENT_ID,
          scope: "email",
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.auth.signIn().then(async () => {
            const user = this.auth.currentUser.get();
            // const basicProfile = user.getBasicProfile();
            // console.log(basicProfile.getEmail());
            // this.setState({ isSignedIn: this.auth.isSignedIn.get() });
            // this.auth.isSignedIn.listen(this.onAuthChange);
            const authResponse = user.getAuthResponse();

            const { data } = await axios.post(`/auth/login`, {
              goggleAuthToken: authResponse["id_token"],
              isGoogleAuth: true,
            });

            localStorage.clear();
            localStorage.setItem("bbox-token", data.token);
            localStorage.setItem("google-login", true);
            this.setState({ redirect: true });
          });
        });
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <Button type="danger" onClick={this.handleGoogleLogin}>
        <Icon type="google" color={colors.white} size={14} />
        Log in
      </Button>
    );
  }
}

export default GoogleAuth;
