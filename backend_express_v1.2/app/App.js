import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { Provider } from "react-redux";
import store from "./store";
import { setCurrentUser, logoutUser } from "./actions/authActions";

//estilos
import "./styles/main.scss";
//js

//iconos
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab) 
dom.i2svg() 
//Componentes     
import PrivateRoute from "./components/private-route/PrivateRoute";
import Layout from './components/layout/Layout'
import Registro from "./views/Registro";
import Login from "./views/Login"
import Dashboard from "./views/Dashboard";
import Novelas from "./views/Novelas";
import CrearNovela from "./views/CrearNovela";
import Capitulos from "./views/Capitulos";

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

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Layout>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/" component={Novelas}/>
            <Route exact path="/novelas/crear" component={CrearNovela}/>
            <Route exact path="/capitulos" component={Capitulos}/>
          </Layout>
          <Route exact path="/s" component={Login} />{/* cambiar */}
          <Route exact path="/registro" component={Registro} />
          <Switch>
          {/* <Layout>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/novelas" component={Novelas}/>
            <PrivateRoute exact path="/capitulos" component={Capitulos}/>
          </Layout> */}
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;