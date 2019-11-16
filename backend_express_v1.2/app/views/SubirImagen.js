import React, {useState,useEffect} from 'react'
import { Link } from "react-router-dom";
import {
  Row, Col,
  Card, CardHeader, CardBody
} from 'reactstrap'

import FormImagen from '../components/novelas/imagenes/FormImagen';
import Error404 from '../components/layout/404'

const SubirImagen = (props) => {
  //parametros para enviar en la url
  const [slug, setSlug] = useState('');
  const [idNovela, setIdNovel] = useState('');
  const [tituloNovela, setTituloNovela] = useState('');


  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }

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
              pathname: '/cms/imagenes/listar/' + slug, 
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
            Subir Imagen
          </CardHeader>
          <CardBody>
            <FormImagen
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

export default SubirImagen
