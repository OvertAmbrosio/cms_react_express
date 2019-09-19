import React, {Component} from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
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

class Registro extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
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
          email: this.state.email,
          password: this.state.password,
          password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history); 
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
                    <span className="text-danger">{errors.email}</span>
                    <FormInput
                      onChange={this.onChange}
                      value={this.state.email}
                      error={errors.email}
                      id="email"
                      autoComplete="username"
                      type="email"
                      placeholder="Email"
                      className={classnames("", {
                        invalid: errors.email
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="password">Contraseña</label>
                    <span className="text-danger">{errors.password}</span>
                    <FormInput
                      onChange={this.onChange}
                      value={this.state.password}
                      error={errors.password}
                      key="registroPassword"
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Contraseña"
                      className={classnames("", {
                        invalid: errors.password
                      })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label htmlFor="password">Confirmar Contraseña</label>
                    <span className="text-danger">{errors.password2}</span>
                    <FormInput
                      onChange={this.onChange}
                      value={this.state.password2}
                      error={errors.password2}
                      id="password2"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Contraseña"
                      className={classnames("", {
                        invalid: errors.password2
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