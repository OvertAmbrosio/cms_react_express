import React, { useState, useEffect, useRef} from 'react'
import axios from 'axios'
import {
  Container, Row, Col, Button,
  Form, FormGroup, Input
} from 'reactstrap'
import Swal from "sweetalert2"; 
//variables de la api
import ReactApi from '../../global';
//componentes adicionales
import TablaCapitulos from '../../components/capitulos/TablaCapitulos';
import Paginacion from '../../components/common/Paginacion';
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

const Capitulos = () => {
  const inputBusqueda = useRef(null);
  const [numeroOrTraductor, setNumeroOrTraductor] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [capitulosPorPagina] = useState(50);
  const [capitulos, setCapitulos] = useState([]);
  const [capitulosAux, setCapitulosAux] = useState([]);

  useEffect(() => {
    inputBusqueda.current.focus();
    cargarCapitulos();
  }, []);
  //cargar capitulos
  const cargarCapitulos = async () => {
    setLoading(true);
    let data = [];
    await axios.get(ReactApi.url_api + '/api/capitulos')
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
          onBeforeOpen: async () => {
            Swal.showLoading()
            await axios({
              method: 'delete',
              url: (ReactApi.url_api + '/api/capitulos/buscar/' + capituloId),
              data: {
                method : "borrarCapitulo",
                id_contenido: contenidoId
              }
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
              capitulo.traductor == numeroOrTraductor
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
          <h4>Lista de Capitulos</h4>
        </Col>
        <Col sm={8} md={6} lg={4}>
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
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <TablaCapitulos
          primerCampo="Novelas"
          capitulos={currentCaps}
          loading={loading}
          borrar={borrarCapitulo}
        />
        <Paginacion 
          objetosPorPagina={capitulosPorPagina}
          totalObjetos={capitulos.length}
          paginacion={paginacion}
        />
      </Row>   
    </Container>
  )
};

export default Capitulos;