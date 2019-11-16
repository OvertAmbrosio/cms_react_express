import React from 'react';
import { Link } from 'react-router-dom'

import { Button } from 'reactstrap';

const Error404 = () => {
  return (
    <div className="h-75">
      <div className="row h-100">
        <div className="m-auto row">
          <div className="card sombra border-0 rounded">
            <div className="card-body justify-content-center">
              <h1 className="text-center numero">404</h1>
              <h2 className="text-center"><i className="fa fa-times text-danger"></i><span className="titulo"> Esta no es la forma de entrar aqui papu.</span></h2>
              <h6 className="text-center visita">
                Regresa a lista y vuelve a intentarlo: <br/><br/>
                <Button
                  color="blue-accent"
                  tag={Link}
                  to="/cms/novelas"
                >
                  Lista
                </Button>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error404
