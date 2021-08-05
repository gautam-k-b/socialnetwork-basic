import React, { Component } from "react";
import { Link } from "react-router-dom";

import { list } from "./userApi";
import defaultProfile from "../images/avatar.png";

class Users extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log("error: ", data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers(users) {
    return (
      <div className="row gy-4">
        {users.map((user, i) => (
          <div className="col-md-4" key={i}>
            <div className="card">
              <img
                src={`${process.env.REACT_APP_API_URL}/user/photo/${
                  user._id
                }?${new Date().getTime()}`}
                alt={user.name}
                className="card-img-top mb-2 mx-auto"
                style={{ height: "200px", width: "200px" }}
                onError={(i) => (i.target.src = `${defaultProfile}`)}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
                <Link
                  to={`/user/${user._id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
