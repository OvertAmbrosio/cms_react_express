import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Table, Badge, Button
} from 'reactstrap'
import Moment from 'react-moment'

const TablaImagenes = ({imagen, borrar, loading, tituloNovela}) => {
  
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
          <th>#</th>
          <th>Titulo</th>
          <th>Nombre de archivo</th>
          <th>Tipo</th>
          <th>Actualizado</th>
          <th>Accion</th>
        </tr>
      </thead>
      <tbody>
        {
          imagen.map((imagen, index) => (
            <tr className="table-light py-3" key={index}>
              <th scope="row">{index + 1}</th>
              <td>{imagen.titulo}</td>
              <td>{imagen.contentType?(imagen.key).substring(8) + '.' + (imagen.contentType).split('/')[1]:imagen.key}</td>
              <td>
                <Badge pill color="blue-accent">
                  {imagen.tipo}
                </Badge>
              </td>
              <td>
                <Moment format="YYYY/MM/DD"> 
                  {imagen.updatedAt}
                </Moment>
              </td>
              <td>
                <Button 
                  title="Editar Imagen" 
                  color="warning"
                  tag={Link} 
                  to={{
                    pathname: '/cms/imagenes/editar/' + (imagen.key).substring(8), 
                    state: { 
                      params: { 
                        id: imagen._id,
                        tituloNovela: tituloNovela
                      }
                    }
                  }}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button 
                  title="Borrar Imagen"
                  color="danger" 
                  onClick={() => borrar(imagen._id, imagen.titulo, imagen.key)}
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

TablaImagenes.propTypes = {
  imagen: PropTypes.array,
  editar: PropTypes.func,
  borrar: PropTypes.func
}

export default TablaImagenes
