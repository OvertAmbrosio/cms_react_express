import React, { useState, useRef } from 'react';
import {
  Row, Col,
  Table, Button
} from 'reactstrap';
import AgregarActualizar from './AgregarActualizar'
import Swal from "sweetalert2"; 

//configuracion del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})


const ObjetoEtiqueta = ({objeto, enviarObjeto, borrarObjeto}) => (
  objeto.map((obj, i) => (
    <tr className="table-light py-3" key={i}>
      <td>{i + 1}</td>
      <td>{obj.text}</td>
      <td>{obj.id}</td>
      <td>{'Sin Descripción'}</td>
      <td>
          <Button 
          title="Editar Etiqueta" 
          color="warning"
          onClick={e => enviarObjeto(obj.text, 'etiqueta', obj._id)}
        >
          <i className="fas fa-edit"></i>
        </Button>
        <Button 
          title="Borrar Etiqueta"
          color="danger" 
          onClick={e => borrarObjeto(obj._id)}
        >
          <i className="fas fa-trash-alt"></i>
        </Button>
      </td>
    </tr>
  ))
)

const ObjetoCateTipo = ({objeto, enviarObjeto, borrarObjeto}) => (
  objeto.map((obj, i) => (
    <tr className="table-light py-3" key={i}>
      <td>{i + 1}</td>
      <td>{obj.nombre}</td>
      <td>{obj.slug}</td>
      <td>{obj.descripcion}</td>
      <td>
          <Button 
          title="Editar Objeto" 
          color="warning"
          onClick={e => enviarObjeto(obj.nombre, obj.descripcion, obj._id)}
        >
          <i className="fas fa-edit"></i>
        </Button>
        <Button 
          title="Borrar Objeto"
          color="danger"
          onClick={e => borrarObjeto(obj._id)}
        >
          <i className="fas fa-trash-alt"></i>
        </Button>
      </td>
    </tr>
  ))
)

const TablaUtils = ({objetos, agregar, editar, borrar, metodo, tipo}) => {

  const [ funcionTipo, setFuncionTipo ] = useState('agregar');
  const [ data, setData ] = useState('');

  //enviar objeto a actualizar
  const enviarObjeto = (n, d, id) => {
    let dataAux = {
      id:id,
      sugerencia:'',
      nombre:'',
      descripcion:''
    };
    window.scroll(0, 0);
    if (d == 'etiqueta' ) {
      dataAux.sugerencia = n;
      setData(dataAux);
      setFuncionTipo('editar')
    } else {
      dataAux.nombre = n;
      dataAux.descripcion = d;
      setData(dataAux);
      setFuncionTipo('editar')
    }
  }
  //borrar objeto
  const borrarObjeto = async (id) => {
    const res = await borrar(metodo.borrar, id);
    Toast.fire({
      type: res.data.status,
      title: res.data.message,
    })
  }

  return (
    <Row>
      <Col sm="12">
        <AgregarActualizar
          funcionTipo={funcionTipo}
          agregar={agregar}
          editar={editar}
          metodo={metodo}
          tipo={tipo}
          data={data}
        />
        <Table hover responsive>
          <thead>
            <tr className="table-light">
              <th>#</th>
              <th>Nombre</th>
              <th>Slug</th>
              <th>Descripción</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
          {
            objetos.length == 0 ?
              <tr>
                <td>No hay data</td>
              </tr>
            : tipo=='etiquetas'?
              <ObjetoEtiqueta objeto={objetos} enviarObjeto={enviarObjeto} borrarObjeto={borrarObjeto}/>
              :
              <ObjetoCateTipo objeto={objetos} enviarObjeto={enviarObjeto} borrarObjeto={borrarObjeto}/>
          }
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default TablaUtils
