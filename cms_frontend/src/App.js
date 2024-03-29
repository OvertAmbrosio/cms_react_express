import React from "react";
import { BrowserRouter as Router, Route, Switch  } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

//redux para elregistro y login
import { Provider } from "react-redux";
import store from "./store";

import routes from "./routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import PrivateRoute from "./components/private-route/PrivateRoute";

import { DefaultLayout, LoginLayout } from "./layouts";
import BlogOverview from "./views/BlogOverview";
import BlogPosts from "./views/BlogPosts";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

export default () => (
  <Provider store={store}>
    <Router basename={process.env.REACT_APP_BASENAME || ""}>
      <div>
        <DefaultLayout>
          <Route exact path="/" component={BlogOverview} />
          <Route exact path="/blog-posts" component={BlogPosts} />
        </DefaultLayout>
      </div>
    </Router>
  </Provider>
);
