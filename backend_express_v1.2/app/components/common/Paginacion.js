import React from 'react';
import {
  Pagination, PaginationItem, PaginationLink,
} from 'reactstrap';

const Paginacion = ({novelasPorPagina, totalNovelas, paginacion}) => {

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalNovelas / novelasPorPagina); i++) {
    pageNumbers.push(i);
  }
  
  return (
    <Pagination>
      {pageNumbers.map(number => (
        <PaginationItem key={number}>
          <PaginationLink onClick={() => paginacion(number)} href='#'>
            {number}
          </PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  )
}


export default Paginacion
