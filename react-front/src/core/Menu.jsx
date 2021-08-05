import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";

import { isAuthenticated, signout } from "../auth";

const activeColor = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link to="/" className="nav-link" style={activeColor(history, "/")}>
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/users"
            className="nav-link"
            style={activeColor(history, "/users")}
          >
            Users
          </Link>
        </li>

        {!isAuthenticated() && (
          <li className="nav-item">
            <Link
              to="/signin"
              className="nav-link"
              style={activeColor(history, "/signin")}
            >
              Sign In
            </Link>
          </li>
        )}

        {!isAuthenticated() && (
          <li className="nav-item">
            <Link
              to="/signup"
              className="nav-link"
              style={activeColor(history, "/signup")}
            >
              Sign Up
            </Link>
          </li>
        )}

        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                style={activeColor(history, "")}
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </button>
            </li>

            <li className="nav-item">
              <Link
                to={`/user/${isAuthenticated().user._id}`}
                className="nav-link"
                style={activeColor(
                  history,
                  `/user/${isAuthenticated().user._id}`
                )}
              >
                {`${isAuthenticated().user.name}'s profile`}
              </Link>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
