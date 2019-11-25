import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { 
  Container, Row, Col,
  Button
} from 'reactstrap';
import Swal from 'sweetalert2'
import axios from 'axios';
//variables de la api
import ReactApi from '../global';

import TablaImagenes from '../components/novelas/imagenes/TablaImagenes';
import Error404 from '../components/layout/404';

const SWBB = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const Imagenes = (props) => {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState('')
  //parametros para enviar por url
  const [slug, setSlug] = useState('');
  const [idNovela, setIdNovela] = useState('');
  const [tituloNovela, setTituloNovela] = useState('');

  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }

  useEffect(() => {
    setSlug(props.match.params.var);
    setIdNovela(props.location.state.params.id);
    setTituloNovela(props.location.state.params.titulo);
    cargarImagenes();
  }, []);
  //cargar array de imagenes
  const cargarImagenes = async () => {
    setLoading(true);
    const res = await axios.get(ReactApi.url_api + '/api/imagenes/listar/' + props.location.state.params.id);    
    if (Object.entries(res).length) {
      setImagenes(res.data);
    } else {
      Toast.fire({
        type: 'error',
        title: 'No se encontraron imagenes'
      });
      console.log("No hay imagenes papu revisa en el servidor")
    }
    setLoading(false);
  };
  //borrar imagenes
  const borrarImagen = async (id, titulo, key) => {
    SWBB.fire({
      title: '¿Eliminar Imagen?',
      text: `Estas borrando "${titulo}"`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Eliminalo compa!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async e => {
            Swal.showLoading()
            await axios({
              method: 'delete',
              url: (ReactApi.url_api + '/api/imagenes/listar/' + id),
              data: { 
                method: "borrarImagen", 
                key: key}
            }).then((res) => {
              Swal.hideLoading()
              SWBB.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status == "error"){
                  console.log(res.data.errorData);
                } else if (result.value && res.data.status == "success"){
                  console.log(res.data.messageData)
                  cargarImagenes();
                }
              });
            });
          }
        })
      }else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
      ){
        SWBB.fire(
          'Cancelado',
          'Tu imagen esta segura compa',
          'error',
        )
      }
    })    
  }

  return (
    <Container className="bg-white shadow-sm">
      <Row className="mb-3" className="py-3">
        <Col sm={9} md={9} lg={10}>
          <h4>Imagenes de "{props.location.state.params.titulo}"</h4><br/>
        </Col>
        <Col sm={3} md={3} lg={2}>
          <Button 
            title="Agregar Imagen" 
            color="success" 
            tag={Link} 
            to={{
              pathname: '/cms/imagenes/subir/' + slug, 
              state: { 
                params: { 
                  id: idNovela,
                  titulo: tituloNovela
                }
              }
            }}
          >
            <i className="fas fa-plus-circle"></i>{` `}Nuevo
          </Button>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <TablaImagenes
          imagen={imagenes}
          loading={loading}
          borrar={borrarImagen}
          tituloNovela={props.location.state.params.titulo}
        />
      </Row>
    </Container>
  )
}

export default Imagenes
