import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';

import FormNovela from '../../components/novelas/FormNovela';
import Error404 from '../../components/layout/404';
//variables de la api
import ReactApi from '../../global';

const EditarNovela = (props) => {
  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }

  const [novela, setNovela] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(()=> {
    buscarNovela();
  },[]);

  const buscarNovela = async () => {
    setLoading(true);
    await axios.get(ReactApi.url_api + '/api/novelas/buscar/' + props.location.state.params.id)
    .then(function (res) {
      setNovela(res.data) 
      setLoading(false)  
    })
    .catch(function (error) {
      console.log(error);
    })  
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
        <FormNovela
          accion="Editar"
          usuario={novela.createdBy}
          novela={novela}
          loading={loading}
        />
      </Col>
    </Row>
  )
}

export default EditarNovela
