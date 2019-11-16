import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

import {
  Card, CardBody, CardTitle, CardSubtitle,
  Form, FormGroup, FormText, Input, Button
} from 'reactstrap';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  componentDidMount() {
    // Si el usuario esta logeado y navega en la ruta del login, será redireccionado al dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/cms/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/cms/dashboard"); // redirecciona al dashboard cuando el usuario se logee
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  //botton loading
  
  render() {
    const { errors } = this.state;
    return (
      <div className="vh-100" style={{overflow: "hidden"}}>
        <div className="row h-100">
          <div className="m-auto col-10 col-sm-6 col-md-4 col-lg-3">
            <Card className="shadow-sm rounded-lg">
              <CardBody>
                <CardTitle className="fiord-blue mb-4">
                  <h4 className="text-center">Bienvenido</h4>
                </CardTitle>
                <CardSubtitle className="garey-text reagent-gray text-center">
                  ¿No tienes una cuenta? <Link to="/cms/registro" className="text-decoration-none">Registro</Link>
                </CardSubtitle><br/>
                <Form noValidate onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Input
                      onChange={this.onChange}
                      value={this.state.email}
                      error={errors.email}
                      autoComplete="username email"
                      placeholder="Email"
                      id="email"
                      type="email"
                      className={classnames("", {
                        'is-invalid': errors.email || errors.emailnotfound
                      })}
                    />
                    <FormText className="text-danger">
                      {errors.email}
                      {errors.emailnotfound}
                      {errors.userstate}
                    </FormText>
                  </FormGroup>
                  <FormGroup>
                    <Input
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      autoComplete="current-password"
                      placeholder="Password"
                      id="password"
                      type="password"
                      className={classnames("", {
                        'is-invalid': errors.password || errors.passwordincorrect
                      })}
                    />
                    <FormText className="text-danger">
                      {errors.password}
                      {errors.passwordincorrect}
                    </FormText>
                  </FormGroup>
                  <div className="mx-auto" style={{ marginTop: "1rem" }}>
                    <Button type="submit" color="blue-accent" >
                      Ingresar
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);