import React from 'react'
import {
  Table, Badge, Button, CustomInput
} from 'reactstrap'
import axios from 'axios'
import Moment from 'react-moment'
import Swal from "sweetalert2"; 
//variables de la api
import ReactApi from '../../global';

//configuracion del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

const TablaCapitulos = ({primerCampo, capitulos, editar, borrar, loading}) => {

  const actualizarEstado = async (e, numero, idCap) => {
    let estado = e.target.checked == true ? "Aprobado": "Pendiente"
    await axios({
      method: 'patch',
      url: ReactApi.url_api + '/api/capitulos/buscar/' + idCap,
      data: {
        method: "actualizarEstado",
        set: {estado: estado},
      }
    }).then((res) => {
      if (res.data.status == "success") {
        Toast.fire({
          type: res.data.status,
          title: `El Capítulo N° ${numero} fue actualizado a ${estado}.`,
        })
      } else {
        Toast.fire({
          type: res.data.status,
          title: res.data.title,
        })
      }
      
    });
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <Table hover responsive>
      <thead>
        <tr className="table-light">
          <th>{`Titulo ${primerCampo}`}</th>
          <th>N° Capitulo</th>
          <th>Traductor</th>
          <th>Actualizado</th>
          <th>Estado</th>
          <th>Accion</th>
        </tr>
      </thead>
      <tbody>
        {
          capitulos.map((capitulo, index) => (
            <tr className="table-light py-3" key={index}>
              <td>{primerCampo=="Capitulo" ? capitulo.titulo:capitulo.id_novela == null ? "Novela No Encontrada": capitulo.id_novela.titulo}</td>
              <td>
                <Badge pill color="primary">
                  {capitulo.numero}
                </Badge>
              </td>
              <td>{capitulo.traductor}</td>
              <td>
                <Moment format="YYYY/MM/DD"> 
                  {capitulo.updatedAt}
                </Moment>
              </td>
              <td>
                <CustomInput 
                  type="switch" 
                  defaultChecked={capitulo.estado == "Aprobado" ? true: false}
                  id={index}
                  name="estado"
                  color="success"
                  onChange={e => actualizarEstado(e, capitulo.numero, capitulo._id)}
                />
              </td>
              <td>
                <Button 
                  title="Editar Capitulo" 
                  color="warning" 
                  onClick={() => editar(capitulo)}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button 
                  title="Borrar Capitulo"
                  color="danger" 
                  onClick={() => borrar(capitulo._id, capitulo.numero)}
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  )
}

export default TablaCapitulos
