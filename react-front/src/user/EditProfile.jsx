import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "./userApi";
import defaultProfile from "../images/avatar.png";

class EditProfile extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      name: "",
      email: "",
      about: "",
      password: "",
      fileSize: 0,
      redirectToProfile: false,
      loading: false,
      error: "",
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 100000) {
      // 1 mb allowed here
      this.setState({ error: "File size should be less than 100 mb" });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid email is required" });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({ error: "Password must be at least 6 characters long" });
      return false;
    }

    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });

    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;

    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
    console.log("USER DATA:", this.userData.get(name));
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ error: "", loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {          
          updateUser(data.user, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }

    this.setState({ loading: false });
  };

  profileForm = (name, email, about, password) => {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="form-floating mb-4">
          <input
            type="file"
            accept="image/*"
            className="form-control border-0 border-bottom border-primary"
            onChange={this.handleChange("photo")}
          />
          <label className="form-label text-muted">Profile Photo</label>
        </div>
        <div className="form-floating mb-4">
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
          <textarea
            type="text"
            className="form-control border-0 border-bottom border-primary"
            onChange={this.handleChange("about")}
            value={about}
            rows={4}
            style={{ height: "100px" }}
          />
          <label className="form-label text-muted">About</label>
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

        <button className="btn btn-primary">Update</button>
      </form>
    );
  };

  render() {
    const {
      id,
      name,
      email,
      about,
      password,
      redirectToProfile,
      error,
      loading,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading && (
          <div className="container bg-dark p-5 text-center">
            <h2>Loading...</h2>
          </div>
        )}

        <img
          src={`${
            process.env.REACT_APP_API_URL
          }/user/photo/${id}?${new Date().getTime()}`}
          alt={name}
          className="img-thumbnail mb-2"
          style={{ height: "200px", width: "auto" }}
          onError={(i) => (i.target.src = `${defaultProfile}`)}
        />

        {this.profileForm(name, email, about, password)}
      </div>
    );
  }
}

export default EditProfile;
