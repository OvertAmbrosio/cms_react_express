import React from 'react';
import { Link } from 'react-router-dom'
import {
  Pagination, PaginationItem, PaginationLink,
} from 'reactstrap';

const Paginacion = ({objetosPorPagina, totalObjetos, paginacion, idNovela, tituloNovela}) => {

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalObjetos / objetosPorPagina); i++) {
    pageNumbers.push(i);
  }
  
  return (
    <Pagination>
      {pageNumbers.map(number => (
        <PaginationItem key={number}>
          <PaginationLink onClick={() => paginacion(number)} tag={Link} to={{pathname:'#', state: {params: {id: idNovela, titulo: tituloNovela}}}}>
            {number}
          </PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  )
}


export default Paginacion
