import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

import { Button, Card, Form} from "react-bootstrap"


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
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // redirecciona al dashboard cuando el usuario se logee
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
              <Card.Body>
                <Card.Title className="fiord-blue card-titulo">
                  <p className="text-center">Bienvenido</p>
                </Card.Title>
                <Card.Subtitle className="garey-text reagent-gray text-center">
                  ¿No tienes una cuenta? <Link to="/registro" className="text-decoration-none">Registro</Link>
                </Card.Subtitle><br/>
                <Form noValidate onSubmit={this.onSubmit}>
                  <Form.Group>
                    <Form.Control
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
                    <Form.Text className="text-danger">
                      {errors.email}
                      {errors.emailnotfound}
                      {errors.userstate}
                    </Form.Text>
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
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
                    <Form.Text className="text-danger">
                      {errors.password}
                      {errors.passwordincorrect}
                    </Form.Text>
                  </Form.Group>
                  <div className="mx-auto" style={{ marginTop: "1rem" }}>
                    <Button type="submit" className="btn btn-primary blue accent-4" >
                      Ingresar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
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