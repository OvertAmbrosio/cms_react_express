import React, { Component, useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { 
  Container, Row, Col,
  Form, Input, Button, FormGroup,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import axios from 'axios';
import "regenerator-runtime/runtime";
import Swal from "sweetalert2";  

import TablaNovelas from '../components/novelas/TablaNovelas';
import Paginacion from '../components/common/Paginacion';
import FormNovela from '../components/Novelas/FormNovela';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

const Novelas = () => {
  const [tituloOrUser, setTituloOrUser] = useState('')
  const [estadoModal, setEstadoModal] = useState(false);
  const [novela, setNovela] = useState({});
  const [novelas, setNovelas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [novelasPorPagina] = useState(10);
  const inputBusqueda = useRef(null);
  
  //Efecto para listar novelas y focus en el input de busqueda
  useEffect(() => {
    inputBusqueda.current.focus();
    listarNovelas();
  }, []);
  //listar novela
  function listarNovelas() {
    const cargarNovelas = async () => {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/api/novelas');
      setNovelas(res.data);
      setLoading(false);
    };

    cargarNovelas();
  }
  //borrar novela
  function borrarNovela(novelaId, titulo) {
    swalWithBootstrapButtons.fire({
      title: '¿Eliminar Novela?',
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
              url: ('http://localhost:4000/api/novelas/buscar/' + novelaId)
            }).then((res) => {
              Swal.hideLoading()
              Swal.fire({
                title: '¡Novela Eliminada!',
                text: res.message,
                type: 'success'
              }).then((result) => {
                if(result.value){
                  listarNovelas();
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
          'Tu novela esta segura compa',
          'error',
        )
      }
    })
  }
  //ejecutar funcion al presionar enter
  const enterPressed = (e) => {
    var code = e.keyCode || event.which;
    if(code === 13){
      busqueda(e);
    }
  }
  //guardar cambios en el input
  const detectarCambio = (e) => {
    setTituloOrUser(e.target.value);
  }
  //realizar busqueda
  const busqueda = async (e) => {
    e.preventDefault();

    if (tituloOrUser == '') {
      swalWithBootstrapButtons.fire({
        title: 'Ingresar dato de busqueda',
        text: 'Buscar por Titulo o Usuario',
        type: 'warning',
        cancelButtonText: 'Cancelar',
      }).then(() => {
        listarNovelas();
      });
    } else {
      setLoading(true);
      await axios({
        method: 'get',
        url: 'http://localhost:4000/api/novelas/busqueda/' + tituloOrUser
      }).then((res) => {
          if (res.data.message) {
            Toast.fire({
              type: 'error',
              title: 'No se encontraron datos'
            })
            inputBusqueda.current.value = '';//limpiar input
            setTituloOrUser('');//limpiar estado
            console.log(res);
          } else {
            Toast.fire({
              type: 'success',
              title: `Se encontraron ${res.data.length} resultados. `
            })
            setNovelas(res.data);
          }
        })
      setLoading(false);
      
    }
  } 
  //abrir modal
  const abrirModal = async () => {
    setEstadoModal(!estadoModal);
  }
  //editar novela
  function editarNovela(e) {
    if(e){
      try {
        setNovela(e);
        abrirModal();
      } catch (error) {
        console.log(error)
      } finally {
        console.log("final")
      }
    }
  }
  
  //Conseguir Pagina actual
  const indexOfLastNovel = currentPage * novelasPorPagina;
  const indexOfFirstNovel = indexOfLastNovel - novelasPorPagina;
  const currentNovels = novelas.slice(indexOfFirstNovel, indexOfLastNovel);

  //cambiar pagina
  const paginacion = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="bg-white py-3 px-4 shadow-sm">
      <Row className="mb-3 justify-content-between">
        <Col sm={4} md={4} className="pt-2">
          <h4>Lista de Novelas</h4>
        </Col>
        <Col sm={8} md={8} lg={5}>
          <Form className="my-2 my-lg-0" inline>
            <FormGroup>
              <Input 
                type="text" 
                placeholder="Buscar" 
                innerRef={inputBusqueda}
                onChange={detectarCambio} 
                onKeyPress={enterPressed}/>
              <Button color="primary" onClick={busqueda}>
                <i className="fas fa-search"></i>{` `}Buscar
              </Button>
              <Button color="success">
                <Link to="/novelas/crear" className="text-decoration-none text-white">
                  <i className="fas fa-plus-circle"></i>{` `}Nuevo
                </Link>
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <TablaNovelas
          novela={currentNovels}
          loading={loading}
          borrar={borrarNovela}
          editar={editarNovela}
        />
        <Paginacion 
          novelasPorPagina={novelasPorPagina}
          totalNovelas={novelas.length}
          paginacion={paginacion}
        />
        <Modal isOpen={estadoModal} toggle={abrirModal} centered size="lg">
          <ModalHeader toggle={abrirModal} className="text-truncate pr-1">
            <span className="d-inline-block text-truncate" style={{maxWidth: '400px'}}>
              Editar Novela
            </span>
          </ModalHeader>
          <ModalBody>
            <FormNovela
              novela={novela}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={abrirModal}>Cerrar</Button>
          </ModalFooter>
        </Modal>             
      </Row>
    </Container>
  );
}

export default Novelas;

export class  ListarNovelas extends Component {

  constructor (props){

    super(props);

    this.state = {
      novelas: [],
      isModalOpen: false,
      modalTitle: '',
      modalBody: ''
    }
    this.editarNovela = this.editarNovela.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
    this.abrirModal = this.abrirModal.bind(this);

  }

  editarNovela = async (novelaId) => {
    this.modalOpen();
    console.log("editando" + novelaId);
  }

  modalOpen() {
    this.setState(({
      isModalOpen: !this.state.isModalOpen,
    }));
  }

  abrirModal = (e, titulo, url) => {
    this.modalOpen();
    this.setState(({
      modalTitle: titulo,
      modalBody: url
    }));
  }

  render() {
    return (
      <Container className="bg-white py-3 px-4 shadow-sm">
        <Row className="mb-3 justify-content-between">
          <Col sm={4} md={4} className="pt-2">
            <h4>Lista de Novelas</h4>
          </Col>
          <Col sm={8} md={8} lg={5}>
            <Form className="my-2 my-lg-0" inline>
              <FormGroup>
                <Input type="text" placeholder="Search"/>
                <Button color="primary" type="submit">
                  <i className="fas fa-search"></i>{` `}Buscar
                </Button>
                <Button color="success">
                  <Link to="/novelas/crear" className="text-decoration-none text-white">
                    <i className="fas fa-plus-circle"></i>{` `}Nuevo
                  </Link>
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <TablaNovelas
            novela={this.state.novelas}
            editar={this.editarNovela}
            borrar={this.borrarNovela}
          />          
            <Modal isOpen={this.state.isModalOpen} toggle={this.modalOpen} centered>
              <ModalHeader toggle={this.modalOpen} className="text-truncate pr-1">
                <span className="d-inline-block text-truncate" style={{maxWidth: '400px'}}>
                  Hola
                </span>
              </ModalHeader>
              <ModalBody>
                Que fue
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.modalOpen}>Cerrar</Button>
              </ModalFooter>
            </Modal>                  
        </Row>
      </Container>
    )
  }
}