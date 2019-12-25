import React from 'react';
import { Link } from 'react-router-dom'
import {
  Pagination, PaginationItem, PaginationLink,
} from 'reactstrap';

const Paginacion = ({objetosPorPagina, totalObjetos, paginacion, idNovela, tituloNovela, loading}) => {

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalObjetos / objetosPorPagina); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return(
      <div style={{overflowX: 'hidden'}}></div>
    )
  }
  
  return (
    <Pagination style={{overflowX: 'scroll', width: '80vh'}}>
      {pageNumbers.map(number => (
        <PaginationItem key={number}>
          <PaginationLink onClick={() => paginacion(number)}>
            {number}
          </PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  )
}


export default Paginacion
