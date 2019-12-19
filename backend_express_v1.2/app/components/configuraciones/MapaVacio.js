import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Swal from "sweetalert2";  
import axios from 'axios';
import ReactApi from '../../global';

const SWBB = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

const MapaVacio = () => {

  const crearMapa = () => {
    SWBB.fire({
      text: 'Se creará el contenedor para las Categorias, Etiquetas y Tipos de novelas',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, apurale compa',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async e => {
            Swal.showLoading()
            await axios({
              method: 'post',
              url: (ReactApi.url_api + '/api/novelas/utils'),
              data: { method: "crearMapa"}
            }).then((res) => {
              Swal.hideLoading()
              SWBB.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status == "error"){
                  console.log('Error en el servidor');
                } else if (result.value){
                  window.location.reload(true);
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
          'Tu novela esta segura compa',
          'error',
        )
      }
    })
  }

  return (
    <Container className="bg-white py-3 px-4 shadow-sm">
      <Row className="mb-3 justify-content-between">
        <Col sm={8} md={8} className="pt-2">
          <p>Aun no has agregado el contendor (categorias/tipo/etiqueas), ¿Deseas agregarlo ahora?</p>
        </Col>
        <Col sm={4} md={4} lg={4}>
          <Button color="success" onClick={crearMapa}>
              <i className="fas fa-plus-circle"></i>{` `}Agregar
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default MapaVacio
