import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { logoutUser } from "../../actions/authActions";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";

class TopNav extends Component {
  
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {

    const { user } = this.props.auth;

    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand to="/" as={Link}>Esnovel CMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="justify-content-end">
              <Nav.Link to="/novelas" as={Link}>Novelas</Nav.Link>
              <Nav.Link to="/Capitulos" as={Link}>Capitulos</Nav.Link>
              <Nav.Link to="/" as={Link}>Usuarios</Nav.Link>
              <div ></div>
              <NavDropdown id="basic-nav-dropdown" title={<span><i className="fas fa-user-circle"></i> Hola, {user.name}</span>} drop="down">
                <NavDropdown.Item href="#action/3.1"><i className="fas fa-cog"></i> Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.onLogoutClick} className="text-danger"><i className="fas fa-power-off"></i> Desconectar</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

TopNav.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(TopNav);
