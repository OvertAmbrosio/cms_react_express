import React, { useState, useRef } from 'react';
import {
  Row, Col,
  Table, Button, 
  Form, FormGroup, Label, Input
} from 'reactstrap';
import slugify from 'slugify';
import Swal from "sweetalert2"; 
import AgregarUtil from './AgregarUtil'

//configuracion del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})


const TablaUtils = ({objetos, tipo, agregar, metodo}) => {

  return (
    <Row>
      <Col sm="12">
        <AgregarUtil
          agregar={agregar}
          metodo={metodo}
          tipo={tipo}
        />
        <Table hover responsive>
          <thead>
            <tr className="table-light">
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
              objetos.map((obj, i) => (
                <tr className="table-light py-3" key={i}>
                  <td>{obj.text}</td>
                  <td>{obj.slug}</td>
                  <td>{'Sin Descripción'}</td>
                  <td>
                      <Button 
                      title="Editar Imagen" 
                      color="warning"
                      
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      title="Borrar Imagen"
                      color="danger" 
                      
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </td>
                </tr>
              ))
              :
              objetos.map((obj, i) => (
                <tr className="table-light py-3" key={i}>
                  <td>{obj.nombre}</td>
                  <td>{obj.slug}</td>
                  <td>{obj.descripcion}</td>
                  <td>
                      <Button 
                      title="Editar Imagen" 
                      color="warning"
                      
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      title="Borrar Imagen"
                      color="danger" 
                      
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </td>
                </tr>
              ))
          }
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default TablaUtils
