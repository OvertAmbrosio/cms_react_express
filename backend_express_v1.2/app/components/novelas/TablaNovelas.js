import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Table, Badge, Button
} from 'reactstrap'
import Moment from 'react-moment'

const TablaNovelas = ({novela, borrar, loading}) => {
  
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
                <Button 
                  title="Editar Novela" 
                  color="warning"
                  tag={Link} 
                  to={{
                    pathname: '/cms/novelas/editar/' + novela.slug, 
                    state: { 
                      params: { 
                        id: novela._id,
                      }
                    }
                  }}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                <Button 
                  title="Lista de Capitulos" 
                  color="info" 
                  tag={Link} 
                  to={{
                    pathname: '/cms/capitulos/listar/' + novela.slug, 
                    state: { 
                      params: { 
                        id: novela._id,
                        titulo: novela.titulo
                      }
                    }
                  }}
                >
                  <i className="fas fa-folder-plus"></i>
                </Button>
                <Button 
                  title="Listar imagenes" 
                  color="blue-accent" 
                  tag={Link} 
                  to={{
                    pathname: '/cms/imagenes/listar/' + novela.slug, 
                    state: { 
                      params: { 
                        id: novela._id,
                        titulo: novela.titulo
                      }
                    }
                  }}
                >
                  <i className="fas fa-images"></i>
                </Button>
                <Button 
                  title="Borrar Novela"
                  color="danger" 
                  onClick={() => borrar(novela._id, novela.titulo)}
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

TablaNovelas.propTypes = {
  novela: PropTypes.array,
  borrar: PropTypes.func
}

export default TablaNovelas
