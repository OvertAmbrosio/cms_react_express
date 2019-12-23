import React, { useState, useEffect, useRef} from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import {
  Container, Row, Col, Button,
  Form, FormGroup, Input,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import Swal from "sweetalert2"; 
//variables de la api
import ReactApi from '../../global';
//componentes adicionales
import TablaCapitulos from '../../components/capitulos/TablaCapitulos';
import Paginacion from '../../components/common/Paginacion';
import FormCapitulos from '../../components/capitulos/FormCapitulos'
import Error404 from '../../components/layout/404'
//personalizar estilo del sweetalert
const SWBB = Swal.mixin({
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
  if (props.location.state === undefined) {
    return(
      <Error404/>
    )
  }

  const inputBusqueda = useRef(null);
  const [numeroOrTraductor, setNumeroOrTraductor] = useState('');
  const [estadoModal, setEstadoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [capitulosPorPagina] = useState(50);
  const [capitulo, setCapitulo] = useState({});
  const [capitulos, setCapitulos] = useState([]);//array de capitulos para manipular
  const [capitulosAux, setCapitulosAux] = useState([]);//capitulos solo de lectura
  //parametros para enviar por url
  const [slug, setSlug] = useState(props.match.params.var);
  const [idNovela, setIdNovel] = useState(props.location.state.params.id);
  const [tituloNovela, setTituloNovela] = useState(props.location.state.params.titulo);
  
  useEffect(() => {
    inputBusqueda.current.focus();
    cargarCapitulos();
  }, []);
  //cargar capitulos
  const cargarCapitulos = async () => {
    setLoading(true);
    let data = [];
    await axios.get(ReactApi.url_api + '/api/capitulos/listar/' + props.location.state.params.id)
      .then(function (res) {
        var promises = (res.data).map(function(capitulos){
          return (capitulos.capitulos).map((c) => (
            data.push({
              id_novela: capitulos._id,
              id_cap: c._id,
              id_contenido: c.contenido[0]._id,
              titulo_novela : capitulos.titulo,
              titulo: c.titulo,
              numero : c.numero,
              slug: c.slug,
              traductor : c.contenido[0].traductor.nombre,
              updatedAt : c.updatedAt,
              estado : c.estado
            })
          ))
        })
        Promise.all(promises).then(function() {
          setCapitulos(data);
          setCapitulosAux(data);
        })
      })
      .catch(function (error) {
        console.log(error);
      })      
    setLoading(false);
  };
  //borrar capitulos
  const borrarCapitulo = async (capituloId, numero, contenidoId) => {
    SWBB.fire({
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
              url: (ReactApi.url_api + '/api/capitulos/buscar/' + capituloId),
              data: {
                method: 'borrarCapitulo',
                id_contenido: contenidoId
              }
            }).then((res) => {
              Swal.hideLoading()
              SWBB.fire({
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
        SWBB.fire(
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
      SWBB.fire({
        title: 'Ingresar dato de busqueda',
        text: 'Buscar por N° de Capitulo o Usuario',
        type: 'warning',
        cancelButtonText: 'Cancelar',
      }).then(() => {
        cargarCapitulos();
      });
    } else {
      setLoading(true);
      if (!isNaN(numeroOrTraductor)) {
        let a = capitulosAux.filter( capitulo => capitulo.numero == numeroOrTraductor);
        if (a.length == 0) {
          Toast.fire({type: 'error',
                      title: 'No se encontraron datos'});
          inputBusqueda.current.value = '';//limpiar input
          setNumeroOrTraductor('');//limpiar estado
          setCapitulos(capitulosAux); //volver la lista original
        } else {
          Toast.fire({type: 'success',
                      title: `Se encontraron ${a.length} resultados. `})
          setCapitulos(a);
        }
      } else {
        try {
          let a = capitulosAux.filter( 
            capitulo => 
              capitulo.contenido[0].traductor.nombre == numeroOrTraductor
          );
          if (a.length == 0) {
            Toast.fire({type: 'error',
                        title: 'No se encontraron datos'});
            inputBusqueda.current.value = '';//limpiar input
            setNumeroOrTraductor('');//limpiar estado
            setCapitulos(capitulosAux); //volver la lista original
          } else {
            Toast.fire({type: 'success',
                        title: `Se encontraron ${a.length} resultados. `})
            setCapitulos(a);
          }
        } catch (error) {
          console.log(error)
          Toast.fire({type: 'error',
                      title: 'Error en la busqueda, archivos defectuosos'});
        }
      }
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
                  pathname: '/cms/capitulos/crear/' + slug, 
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
          primerCampo="Capitulo"
          capitulos={currentCaps}
          loading={loading}
          borrar={borrarCapitulo}
          editar={editarCapitulo}
        />
        <Paginacion 
          objetosPorPagina={capitulosPorPagina}
          totalObjetos={capitulos.length}
          paginacion={paginacion}
          idNovela={idNovela}
          tituloNovela={tituloNovela}
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
