import React, { useState, useEffect} from 'react';

import {
  Row, Col,
  Card, CardHeader, CardBody
} from 'reactstrap';

import axios from 'axios';

import FormImagen from '../../components/novelas/imagenes/FormImagen';
import Error404 from '../../components/layout/404';
//variables de la api
import ReactApi from '../../global';

const EditarImagen = (props) => {

  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }
  const [imagen, setImagen] = useState('');
  const [loading, setLoading] = useState(true);
  //parametros para enviar en la url
  const [slug, setSlug] = useState('');
  const [tituloNovela, setTituloNovela] = useState('');

  useEffect(() => {
    buscarImagen();
    setSlug(props.match.params.var);
    setTituloNovela(props.location.state.params.titulo);
  },[]);
  //
  const buscarImagen = async () => {
    await axios.get(ReactApi.url_api + '/api/imagenes/buscar/' + props.location.state.params.id)
                .then((data) => {
                  setImagen(data.data);
              }).then(() => {
                setLoading(false)
              }).catch((err) => {
                console.log(err);
              });
  }

  return (
    <Row className="my-3">
      <Col m="10" sm="12">
        <Card>
          <CardHeader tag="h4">
            Editar Imagen
          </CardHeader>
          <CardBody>
            <FormImagen
              loading={loading}
              imagen={imagen}
              tituloNovela={props.location.state.params.tituloNovela}
              accion="editar"
              cancelar={props.history.goBack}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default EditarImagen
