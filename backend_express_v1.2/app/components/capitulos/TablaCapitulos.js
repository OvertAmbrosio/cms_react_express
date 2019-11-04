import React, {useState, useEffect} from 'react'
import {
  Table, Badge, Button, CustomInput
} from 'reactstrap'
import Moment from 'react-moment'

const TablaCapitulos = ({primerCampo, capitulos, editar, borrar, loading}) => {
  const [estado, setEstado] = useState('')

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
    <Table hover >
      <thead>
        <tr className="table-light">
          <th>{primerCampo}</th>
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
              <td>{capitulo.titulo}</td>
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
                  label={capitulo.estado} 
                  onChange={e => console.log(e)}
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

TablaCapitulos.propTypes = {

}

export default TablaCapitulos
