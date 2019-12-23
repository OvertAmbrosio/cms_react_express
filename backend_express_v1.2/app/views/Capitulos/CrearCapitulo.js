import React, { useState, useEffect} from 'react'
import { connect } from "react-redux";
import PropTypes from 'prop-types'
import {
  Row, Col, Button,
  Card, CardHeader, CardBody
} from 'reactstrap'

import FormCapitulos from '../../components/capitulos/FormCapitulos';
import Error404 from '../../components/layout/404';


const CrearCapitulo = (props) => {
  const [tipo] = useState(props.location.state === undefined ? '': props.location.state.params.tipo);

  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }

  const atras = () => {
    window.history.back();
  }

  return (
    <Row className="my-3">
      <Col m="10" sm="12">
        <div className="mb-2">
          <Button onClick={atras} color='blue-accent'>
            <i className="fas fa-arrow-left text-white"></i>{` `}Lista
          </Button>
        </div>
        <Card>
          <CardHeader tag="h4">
            {tipo}{` `}nuevo capitulo
          </CardHeader>
          <CardBody>
            <FormCapitulos
              usuario={props.name}
              idNovela={props.location.state.params.id}
              tituloNovela={props.location.state.params.titulo}
              accion="crear"
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

CrearCapitulo.propTypes = {
  auth: PropTypes.object
}

function mapStateToProps(state) {
  const auth = state.auth.user;
  return auth
}

export default connect(
  mapStateToProps
)(CrearCapitulo);
