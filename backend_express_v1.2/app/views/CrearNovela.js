import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { connect } from "react-redux";
import PropTypes from 'prop-types'

import FormNovela from '../components/novelas/FormNovela'

const CrearNovela = (props) => {
  return (
    <Row className="my-3">
      <Col m="10" sm="12">
        <div className="mb-2">
          <Link to="/cms/novelas" className="text-decoration-none">
            <i className="fas fa-arrow-left text-primary"></i>{` `}Lista
          </Link>
        </div>
        <FormNovela
          accion="Crear"
          usuario={props.name}
        />
      </Col>
    </Row>
  )
}

CrearNovela.propTypes = {
  auth: PropTypes.object
}

function mapStateToProps(state) {
  const auth = state.auth.user;
  return auth
}

export default connect(
  mapStateToProps
)(CrearNovela);


