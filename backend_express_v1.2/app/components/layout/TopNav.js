import React, { Component, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { logoutUser } from "../../actions/authActions";

import {
  Collapse,
  Nav, NavItem, NavLink,
  Navbar, NavbarToggler, NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

const TopNav = ({logoutUser, auth}) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const onLogoutClick = (e) => {
    e.preventDefault();
    logoutUser();
  };

  const { user } = auth;

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand to="/cms/" tag={Link}>TuNovelaOnline CMS</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Novelas
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem to="/cms/novelas" tag={Link}>
                  Listar
                </DropdownItem>
                <DropdownItem to="/cms/novelas/crear" tag={Link}>
                  Crear
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  Configuraciones
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink to="/cms/capitulos" tag={Link}>Capitulos</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <span>
                  <i className="fas fa-user-circle"></i>{` `}Hola, {user.name}
                </span>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem to="/cms/novelas" tag={Link}>
                  <i className="fas fa-cog"></i> Perfil
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem className="text-danger" onClick={onLogoutClick}>
                  <i className="fas fa-power-off"></i> Desconectar
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
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
