import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { isAuthenticated, signout } from "../auth";
import { remove } from "./userApi";

class DeleteUser extends Component {
  constructor() {
    super();

    this.state = {
      redirect: false,
    };
  }

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // signout user
        signout(() => console.log("User is deleted."));

        // redirect
        this.setState({ redirect: true });
      }
    });
  };

  confirmDeleteHandler = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      <button className="btn btn-danger" onClick={this.confirmDeleteHandler}>
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
