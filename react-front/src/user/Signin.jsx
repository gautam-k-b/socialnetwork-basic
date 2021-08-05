import { Component } from "react";
import { Redirect } from "react-router-dom";

import { signin, authenticate } from "../auth";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ loading: true });
    this.setState({ error: "" });

    const { email, password } = this.state;
    const user = {
      email,
      password,
    };

    signin(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        // authenticate
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
        // authorize
      }
    });
  };

  signinForm = (email, password) => {
    return (
      <form onSubmit={this.handleFormSubmit}>
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
    const { email, password, error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signin</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading && (
          <div className="bg-light p-2 text-center">
            <h2>Loading...</h2>
          </div>
        )}

        {this.signinForm(email, password)}
      </div>
    );
  }
}

export default Signin;
