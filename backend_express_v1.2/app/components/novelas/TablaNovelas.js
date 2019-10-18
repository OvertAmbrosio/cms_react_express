import React from 'react'
import PropTypes from 'prop-types'
import {
  Table, Badge, Button
} from 'reactstrap'
import Moment from 'react-moment'

const TablaNovelas = ({novela, editar, borrar, loading}) => {
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
          <th>#</th>
          <th>Titulo</th>
          <th>Tipo</th>
          <th>Usuario</th>
          <th>Actualizado</th>
          <th>Accion</th>
        </tr>
      </thead>
      <tbody>
        {
          novela.map((novela, index) => (
            <tr className="table-light py-3" key={index}>
              <th scope="row">{index + 1}</th>
              <td>{novela.titulo}</td>
              <td>
                <Badge pill color="info">
                  {novela.tipo}
                </Badge>
              </td>
              <td>{novela.createdBy}</td>
              <td>
                <Moment format="YYYY/MM/DD"> 
                  {novela.updatedAt}
                </Moment>
              </td>
              <td>
                <Button color="warning" onClick={() => editar(novela)}>
                  <i className="fas fa-edit"></i>
                </Button>
                <Button color="danger" onClick={() => borrar(novela._id, novela.titulo)}>
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

TablaNovelas.propTypes = {
  novela: PropTypes.array,
  editar: PropTypes.func,
  borrar: PropTypes.func
}

export default TablaNovelas
