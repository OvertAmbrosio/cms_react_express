import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Button, Card, CardBody, CardHeader
 } from 'reactstrap';
import axios from 'axios';

import FormCapitulos from '../../components/capitulos/FormCapitulos';
import Error404 from '../../components/layout/404';
//variables de la api
import ReactApi from '../../global';

const EditarCapitulo = (props) => {

  const [capitulo, setCapitulo] = useState('');
  const [loading, setLoading] = useState('');
  
  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }

  useEffect(()=> {
    buscarCapitulo();
  },[]);

  const buscarCapitulo = async () => {
    setLoading(true);
    await axios.get(ReactApi.url_api + '/api/capitulos/buscar/' + props.location.state.params.id_novela, {
        params: {id_cap : props.location.state.params.id_cap}
      })
      .then(function (res) {
        setCapitulo(res.data.capitulos[0])
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      })     
  }
  //volver atras
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
            Que fue
          </CardHeader>
          <CardBody>
            <FormCapitulos
              loading={loading}
              tituloNovela={props.location.state.params.titulo_novela}
              idNovela={props.location.state.params.id_novela}
              capitulo={capitulo}
              accion="editar"
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default EditarCapitulo
