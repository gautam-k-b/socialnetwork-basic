import React, { Component } from "react";
import { Link } from "react-router-dom";

import { signup } from "../auth";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      success: false,
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "", success: false });
    this.setState({ [name]: event.target.value });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ error: "", success: false });

    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password,
    };
    signup(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({
          error: "",
          success: true,
          name: "",
          email: "",
          password: "",
        });
      }
    });
  };

  signupForm = (name, email, password) => {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-floating mb-4">
          {/* <i class="fas fa-exclamation-circle trailing"></i> */}
          <input
            type="text"
            className="form-control border-0 border-bottom border-primary"
            onChange={this.handleChange("name")}
            value={name}
          />
          <label className="form-label text-muted">Name</label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="email"
            className="form-control border-0 border-bottom border-primary"
            onChange={this.handleChange("email")}
            value={email}
          />
          <label className="form-label text-muted">Email</label>
        </div>
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control border-0 border-bottom border-primary"
            onChange={this.handleChange("password")}
            value={password}
          />
          <label className="form-label text-muted">Password</label>
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    );
  };

  render() {
    const { name, email, password, error, success } = this.state;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div
          className="alert alert-info"
          style={{ display: success ? "" : "none" }}
        >
          New account is successfully created. Please{" "}
          <Link to="/signin">Sign In</Link>.
        </div>

        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
