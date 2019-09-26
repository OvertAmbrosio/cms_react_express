import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import classnames from "classnames";

import { Button, Card, Form} from "react-bootstrap"

class Registro extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }
  componentDidMount() {
    // Si estas logeado y navegas sobre la ruta de registro, entonces serás redireccionado a dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
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
  const newUser = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password2: this.state.password2
      };
  this.props.registerUser(newUser, this.props.history); 
    };
  render() {
    const { errors } = this.state;
    return (
      <div className="vh-100" style={{overflow: "hidden"}}>
        <div className="row h-100">
          <div className="m-auto col-10 col-sm-6 col-md-4 col-lg-3">
            <Card className="shadow-sm rounded-lg">
              <Card.Body>
                <Card.Title className="fiord-blue card-titulo">
                  <p className="text-center">Registro</p>
                </Card.Title>
                <Card.Subtitle className="garey-text reagent-gray text-center">
                  ¿Ya tienes una cuenta? <Link to="/" className="text-decoration-none">Ingresar</Link>
                </Card.Subtitle><br/>
              <Form noValidate onSubmit={this.onSubmit}>
                <Form.Group>
                  <Form.Control
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    autoComplete="name"
                    placeholder="Nombre"
                    id="name"
                    type="text"
                    className={classnames("", {
                      'is-invalid': errors.name
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors.name}
                  </Form.Text>
                </Form.Group>
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
                      'is-invalid': errors.email
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors.email}
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
                    autoComplete="password"
                    className={classnames("", {
                      invalid: errors.password
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors.password}
                  </Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    autoComplete="current-password"
                    placeholder="Confirmar Password"
                    id="password2"
                    type="password"
                    autoComplete="password2"
                    className={classnames("", {
                      invalid: errors.password2
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors.password2}
                  </Form.Text>
                </Form.Group>
                  <div className="mx-auto" style={{ marginTop: "1rem" }}>
                    <Button type="submit" className="btn btn-primary blue accent-4" >
                      Registrarte
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
Registro.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Registro));