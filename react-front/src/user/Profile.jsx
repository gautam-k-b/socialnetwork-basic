import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import { isAuthenticated } from "../auth";
import { read } from "./userApi";
import defaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignin: false,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        this.setState({ user: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user } = this.state;
    if (redirectToSignin || !isAuthenticated())
      return <Redirect to="/signin" />;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-6">
            <img
              src={`${process.env.REACT_APP_API_URL}/user/photo/${
                user._id
              }?${new Date().getTime()}`}
              alt={user.name}
              className="img-thumbnail mb-2"
              style={{ height: "200px", width: "auto" }}
              onError={(i) => (i.target.src = `${defaultProfile}`)}
            />
          </div>
          <div className="col-md-6">
            <div className="lead mt-2">
              <p>Hello {this.state.user.name}</p>
              <p>Email: {this.state.user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>

            {isAuthenticated().user && isAuthenticated().user._id === user._id && (
              <div className="d-inline-block">
                <Link
                  to={`/user/edit/${user._id}`}
                  className="btn btn-success me-5"
                >
                  Edit Profile
                </Link>

                <DeleteUser userId={user._id} />
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
