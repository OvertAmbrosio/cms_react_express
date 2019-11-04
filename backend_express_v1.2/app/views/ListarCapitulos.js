import React, { useState, useEffect, useRef} from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import {
  Container, Row, Col, Button,
  Form, FormGroup, Input,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import Swal from "sweetalert2"; 
//componentes adicionales
import TablaCapitulos from '../components/capitulos/TablaCapitulos';
import Paginacion from '../components/common/Paginacion';
import FormCapitulos from '../components/capitulos/FormCapitulos'
//personalizar estilo del sweetalert
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
//configuracion del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

const ListarCapitulos = (props) => {
  const inputBusqueda = useRef(null);
  const [numeroOrTraductor, setNumeroOrTraductor] = useState('');
  const [estadoModal, setEstadoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [capitulosPorPagina] = useState(50);
  const [capitulo, setCapitulo] = useState({});
  const [capitulos, setCapitulos] = useState([]);
  //parametros para enviar por url
  const [slug, setSlug] = useState('');
  const [idNovela, setIdNovel] = useState('');
  const [tituloNovela, setTituloNovela] = useState('');

  useEffect(() => {
    inputBusqueda.current.focus();
    cargarCapitulos();
    setSlug(props.match.params.var);
    setIdNovel(props.location.state.params.id);
    setTituloNovela(props.location.state.params.titulo);
  }, []);
  //cargar capitulos
  const cargarCapitulos = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:4000/api/capitulos/listar/' + props.location.state.params.id);
    setCapitulos(res.data);
    setLoading(false);
  };
  //borrar capitulos
  const borrarCapitulo = async (capituloId, numero) => {
    swalWithBootstrapButtons.fire({
      title: '¿Eliminar Capitulo?',
      text: `Estas borrando el capitulo N° ${numero}`,
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
              url: ('http://localhost:4000/api/capitulos/buscar/' + capituloId)
            }).then((res) => {
              Swal.hideLoading()
              Swal.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value){
                  cargarCapitulos();
                }
              });
            });
          }
        })
      }else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
      ){
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu capitulo esta seguro compa',
          'error',
        )
      }
    })
  };
  //editar capitulo
  const editarCapitulo = async (e) => {
    setCapitulo(e);
    abrirModal();
    console.log("Modal Abierto compa")
  };
  //abrir modal
  const abrirModal = () => {
    setEstadoModal(!estadoModal);
  };
  //ejecutar funcion al presionar enter
  const enterPressed = (e) => {
    var code = e.keyCode || event.which;
    if(code === 13){
      busqueda(e);
    }
  };
  ///realizar busqueda
  const busqueda = async (e) => {
    e.preventDefault();
    if (numeroOrTraductor == '') {
      swalWithBootstrapButtons.fire({
        title: 'Ingresar dato de busqueda',
        text: 'Buscar por N° de Capitulo o Usuario',
        type: 'warning',
        cancelButtonText: 'Cancelar',
      }).then(() => {
        cargarCapitulos();
      });
    } else {
      setLoading(true);
      await axios({
        method: 'get',
        url: 'http://localhost:4000/api/capitulos/busqueda/',
        params: {
          idNovela: idNovela,
          var: numeroOrTraductor
        }
      }).then((res) => {      
        if (res.data.length == 0) {
          Toast.fire({
            type: 'error',
            title: 'No se encontraron datos'
          })
          inputBusqueda.current.value = '';//limpiar input
          setNumeroOrTraductor('');//limpiar estado
        } else {
          Toast.fire({
            type: 'success',
            title: `Se encontraron ${res.data.length} resultados. `
          })
          setCapitulos(res.data);
        }
      })
      setLoading(false);
    }
  };
  //Conseguir Pagina actual
  const indexOfLastCap = currentPage * capitulosPorPagina;
  const indexOfFirstCap = indexOfLastCap - capitulosPorPagina;
  const currentCaps = capitulos.slice(indexOfFirstCap, indexOfLastCap);

  //cambiar pagina
  const paginacion = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="bg-white py-3 px-4 shadow-sm">
      <Row className="mb-3 justify-content-between">
        <Col sm={4} md={4} className="pt-2">
          <h4>Capitulos de "{props.location.state.params.titulo}"</h4>
        </Col>
        <Col sm={8} md={8} lg={5}>
          <Form className="my-2 my-lg-0" inline>
            <FormGroup>
              <Input 
                type="text" 
                placeholder="Buscar" 
                size="20"
                innerRef={inputBusqueda}
                onChange={e => setNumeroOrTraductor(e.target.value)} 
                onKeyPress={enterPressed}/>
              <Button color="primary" onClick={busqueda}>
                <i className="fas fa-search"></i>{` `}Buscar
              </Button>
              <Button 
                title="Agregar Capitulo" 
                color="success" 
                tag={Link} 
                to={{
                  pathname: '/capitulos/crear/' + slug, 
                  state: { 
                    params: { 
                      id: idNovela,
                      titulo: tituloNovela,
                      tipo: "Crear"
                    }
                  }
                }}
              >
                <i className="fas fa-plus-circle"></i>{` `}Nuevo
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <TablaCapitulos
          primerCampo="Titulo Capitulo"
          capitulos={currentCaps}
          loading={loading}
          borrar={borrarCapitulo}
          editar={editarCapitulo}
        />
        <Paginacion 
          objetosPorPagina={capitulosPorPagina}
          totalObjetos={capitulos.length}
          paginacion={paginacion}
        />
      </Row>
      <Modal isOpen={estadoModal} toggle={abrirModal} centered size="lg">
        <ModalHeader toggle={abrirModal} className="text-truncate pr-1">
          <span className="d-inline-block text-truncate" style={{maxWidth: '400px'}}>
            Editar Capitlo
          </span>
        </ModalHeader>
        <ModalBody>
          <FormCapitulos
            capitulo={capitulo}
            idNovela={idNovela}
            tituloNovela={tituloNovela}
            accion="editar"
            listar={cargarCapitulos}
            modal={abrirModal}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={abrirModal}>Cerrar</Button>
        </ModalFooter>
      </Modal>       
    </Container>
  )
}


export default ListarCapitulos
