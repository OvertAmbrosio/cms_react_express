import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

import { 
  Container, 
  Row, 
  Col, 
  Card, 
  CardBody, 
  CardHeader, 
  Form, 
  FormInput, 
  FormGroup, 
  Button } from "shards-react";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/"); // push user to dashboard when they login
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
  render() {

    const { errors } = this.state;

    return (
      <Container fluid className="main-content-container px-4 pb-4">
        <Row>
          <Col lg={{ size: 6, offset: 3 }} md={{ size: 6, offset: 3 }} sm="12" className="mb-4 error">
            <Card small className="error__content card-post card-post--aside card-post--1 p-4">
              <CardHeader>
                <h5 className="card-title">
                  Bienvenido
                </h5>
              </CardHeader>
              <CardBody>
                <Form noValidate onSubmit={this.onSubmit}>
                  <FormGroup>
                    <label htmlFor="email">Usuario</label>
                    <span className="text-danger">
                      {errors.email}
                      {errors.emailnotfound}
                    </span>
                    <FormInput
                      onChange={this.onChange}
                      value={this.state.email}
                      error={errors.email}
                      id="email"
                      autoComplete="username"
                      type="email"
                      placeholder="Email"
                      className={classnames("", {
                        invalid: errors.email || errors.emailnotfound
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="password">Password</label>
                    <span className="text-danger">
                      {errors.password}
                      {errors.passwordincorrect}
                    </span>
                    <FormInput
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      id="password"
                      autoComplete="current-password"
                      type="password"
                      placeholder="Password"
                      className={classnames("", {
                        invalid: errors.password || errors.passwordincorrect
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button pill type="submit">Ingresar</Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
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