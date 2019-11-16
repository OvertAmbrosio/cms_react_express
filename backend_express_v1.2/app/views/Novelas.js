import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { 
  Container, Row, Col,
  Form, Input, Button, FormGroup,
} from 'reactstrap';
import axios from 'axios';
import "regenerator-runtime/runtime";
import Swal from "sweetalert2";  

import TablaNovelas from '../components/novelas/TablaNovelas';
import Paginacion from '../components/common/Paginacion';

const SWBB = Swal.mixin({
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
  const [tituloOrUser, setTituloOrUser] = useState('');
  const [novelas, setNovelas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [novelasPorPagina] = useState(30);
  const inputBusqueda = useRef(null);  
  //Efecto para listar novelas y focus en el input de busqueda
  useEffect(() => {
    inputBusqueda.current.focus();
    cargarNovelas();
  }, []);
  //listar novela
  const cargarNovelas = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:4000/api/novelas');
    setNovelas(res.data);
    setLoading(false);
  };
  //borrar novela
  const borrarNovela = async(novelaId, titulo) => {
    SWBB.fire({
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
              url: ('http://localhost:4000/api/novelas/buscar/' + novelaId),
              data: { method: "borrarNovela"}
            }).then((res) => {
              Swal.hideLoading()
              SWBB.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status == "error"){
                  console.log(res.data.errorData);
                } else if (result.value){
                  cargarNovelas();
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
  //ejecutar funcion al presionar enter
  const enterPressed = (e) => {
    var code = e.keyCode || event.which;
    if(code === 13){
      busqueda(e);
    }
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
                onChange={e => setTituloOrUser(e.target.value)} 
                onKeyPress={enterPressed}/>
              <Button color="primary" onClick={busqueda}>
                <i className="fas fa-search"></i>{` `}Buscar
              </Button>
              <Button color="success" tag={Link} to="/cms/novelas/crear">
                  <i className="fas fa-plus-circle"></i>{` `}Nuevo
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
        />
        <Paginacion 
          objetosPorPagina={novelasPorPagina}
          totalObjetos={novelas.length}
          paginacion={paginacion}
        /> 
      </Row>
    </Container>
  );
}

export default Novelas;
