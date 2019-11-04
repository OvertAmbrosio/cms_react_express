import React, { useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from 'prop-types'
import {
  Row, Col,
  Card, CardHeader, CardBody
} from 'reactstrap'

import FormCapitulos from '../components/capitulos/FormCapitulos'


const CrearCapitulo = (props) => {
  const [tipo] = useState(props.location.state.params.tipo);
  //parametros para enviar en la url
  const [slug, setSlug] = useState('');
  const [idNovela, setIdNovel] = useState('');
  const [tituloNovela, setTituloNovela] = useState('');

  useEffect(() => {
    setSlug(props.match.params.var);
    setIdNovel(props.location.state.params.id);
    setTituloNovela(props.location.state.params.titulo);
  });

  return (
      <Row className="my-3">
        <Col m="10" sm="12">
          <div className="mb-2">
            <Link 
              to={{
                pathname: '/capitulos/listar/' + slug, 
                state: { 
                  params: { 
                    id: idNovela,
                    titulo: tituloNovela,
                  }
                }
              }}
              className="text-decoration-none">
              <i className="fas fa-arrow-left text-primary"></i>{` `}Lista
            </Link>
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
