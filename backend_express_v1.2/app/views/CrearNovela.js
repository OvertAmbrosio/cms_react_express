import React from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from "react-redux";
import PropTypes from 'prop-types'

import FormNovela from '../components/novelas/FormNovela'

const CrearNovela = (props) => {
  return (
    <Row className="my-3">
      <Col m="10" sm="12">
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


